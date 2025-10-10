#!/usr/bin/env python3
"""
Analisis Kinerja Sistem GPS Tracking (eSIR 2.0)

Fitur:
- Hitung interval pembaruan posisi per perangkat (mean/median/p95)
- Hitung delay sinkronisasi (server_timestamp - device_timestamp) per perangkat
- Evaluasi deviasi jarak (error) terhadap referensi:
  1) pair: bandingkan ke perangkat referensi (mis. ambulans) via nearest timestamp
  2) none: tanpa referensi (lewati metrik error)

Catatan:
- Opsional kolom `server_timestamp` untuk hitung delay end-to-end.
- Timestamp harus dalam ISO8601 atau epoch detik/milis. Skrip akan mencoba parse otomatis.

Keluaran:
- Tabel per perangkat (CSV): device_metrics.csv
- Tabel sinkronisasi pasangan perangkat (CSV): device_pair_sync.csv
- Tabel per sampel (opsional): detailed_samples.csv (jika --export-detailed)

Cara pakai cepat:
  python analyze_gps_performance.py \
    --input logs.csv \
    --expected-interval-s 5 \
    --reference-mode pair \
    --reference-device-id AMBULANCE01 \
    --export-detailed

Format minimal CSV:
  device_id,timestamp,latitude,longitude[,server_timestamp]
  AMBULANCE01,2025-10-08T12:00:00Z,-6.2001,106.8167,2025-10-08T12:00:00.5Z

Lisensi: MIT
"""

from __future__ import annotations

import argparse
import csv
import math
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple


# ---------- Utilitas Waktu ----------

def _parse_timestamp(value: str) -> float:
    """Parse ISO8601 atau epoch (detik/milis) menjadi detik float (UTC)."""
    v = value.strip()
    if not v:
        raise ValueError("Timestamp kosong")
    # Epoch milis/detik
    try:
        f = float(v)
        # heuristik: jika > 10^12, berarti milidetik
        if f > 1_000_000_000_000:
            return f / 1000.0
        # jika > 10^10, kemungkinan milidetik juga
        if f > 10_000_000_000:
            return f / 1000.0
        return f
    except ValueError:
        pass

    # ISO8601 umum
    # Coba beberapa format lazim; fallback ke fromisoformat (tanpa Z)
    fmts = [
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%d %H:%M:%S",
        "%Y/%m/%d %H:%M:%S",
    ]
    for fmt in fmts:
        try:
            dt = datetime.strptime(v, fmt).replace(tzinfo=timezone.utc)
            return dt.timestamp()
        except ValueError:
            continue

    # fromisoformat (tanpa Z); tangani jika ada offset
    try:
        # Ganti 'Z' dengan +00:00 untuk kompatibilitas fromisoformat
        v2 = v.replace("Z", "+00:00")
        dt = datetime.fromisoformat(v2)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.timestamp()
    except Exception as exc:  # noqa: BLE001
        raise ValueError(f"Gagal parse timestamp: {value}") from exc


# ---------- Utilitas Geodesi ----------

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Hitung jarak Haversine dalam meter antara dua koordinat (WGS84)."""
    r = 6371000.0  # radius bumi (m)
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c


# ---------- Struktur Data ----------

@dataclass
class Sample:
    device_id: str
    t_device: float
    lat: float
    lon: float
    t_server: Optional[float] = None


def read_samples(csv_path: str) -> List[Sample]:
    samples: List[Sample] = []
    with open(csv_path, "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required = {"device_id", "timestamp", "latitude", "longitude"}
        missing = [c for c in required if c not in reader.fieldnames]
        if missing:
            raise ValueError(
                f"Kolom wajib hilang: {missing}. Minimal: device_id,timestamp,latitude,longitude"
            )
        for row in reader:
            try:
                device_id = str(row["device_id"]).strip()
                t_device = _parse_timestamp(str(row["timestamp"]))
                lat = float(row["latitude"])  # type: ignore[arg-type]
                lon = float(row["longitude"])  # type: ignore[arg-type]
                t_server = None
                if "server_timestamp" in row and row["server_timestamp"]:
                    t_server = _parse_timestamp(str(row["server_timestamp"]))
                samples.append(Sample(device_id, t_device, lat, lon, t_server))
            except Exception as exc:  # noqa: BLE001
                raise ValueError(f"Baris CSV tidak valid: {row}\nError: {exc}") from exc
    samples.sort(key=lambda s: (s.device_id, s.t_device))
    return samples


def group_by_device(samples: List[Sample]) -> Dict[str, List[Sample]]:
    grouped: Dict[str, List[Sample]] = {}
    for s in samples:
        grouped.setdefault(s.device_id, []).append(s)
    return grouped


def compute_update_intervals(seconds: List[float]) -> Dict[str, float]:
    if not seconds:
        return {"mean": float("nan"), "median": float("nan"), "p95": float("nan")}
    seconds_sorted = sorted(seconds)
    n = len(seconds_sorted)
    mean_v = sum(seconds_sorted) / n
    # median
    median_v = seconds_sorted[n // 2] if n % 2 == 1 else (seconds_sorted[n // 2 - 1] + seconds_sorted[n // 2]) / 2
    # p95
    idx = int(math.ceil(0.95 * n)) - 1
    idx = min(max(idx, 0), n - 1)
    p95_v = seconds_sorted[idx]
    return {"mean": mean_v, "median": median_v, "p95": p95_v}


def compute_device_metrics(
    grouped: Dict[str, List[Sample]],
    expected_interval_s: Optional[float],
) -> Tuple[List[Dict[str, object]], Dict[str, List[Tuple[float, float]]]]:
    """Kembalikan (metrics_per_device, series_delay_per_device)."""
    per_device_rows: List[Dict[str, object]] = []
    delays_per_device: Dict[str, List[Tuple[float, float]]] = {}

    for device_id, arr in grouped.items():
        if len(arr) == 0:
            continue

        # Intervals
        intervals = [arr[i].t_device - arr[i - 1].t_device for i in range(1, len(arr))]
        intervals = [v for v in intervals if v >= 0]
        interval_stats = compute_update_intervals(intervals)

        # Delay server-device
        delays = [s.t_server - s.t_device for s in arr if s.t_server is not None]
        delays = [v for v in delays if v >= 0]
        delay_stats = compute_update_intervals(delays)
        delays_per_device[device_id] = [(s.t_device, (s.t_server - s.t_device) if s.t_server else float("nan")) for s in arr]

        # Reliability vs expected count
        total_samples = len(arr)
        missing_rate = float("nan")
        trip_duration_s = arr[-1].t_device - arr[0].t_device if total_samples > 1 else 0.0
        expected_count = None
        if expected_interval_s and expected_interval_s > 0 and trip_duration_s > 0:
            expected_count = int(math.floor(trip_duration_s / expected_interval_s)) + 1
            if expected_count > 0:
                missing_rate = max(0.0, 1.0 - (total_samples / expected_count))

        per_device_rows.append(
            {
                "device_id": device_id,
                "samples": total_samples,
                "trip_duration_s": round(trip_duration_s, 3),
                "interval_mean_s": round(interval_stats["mean"], 3),
                "interval_median_s": round(interval_stats["median"], 3),
                "interval_p95_s": round(interval_stats["p95"], 3),
                "delay_mean_s": round(delay_stats["mean"], 3),
                "delay_median_s": round(delay_stats["median"], 3),
                "delay_p95_s": round(delay_stats["p95"], 3),
                "expected_count": expected_count if expected_count is not None else "",
                "missing_rate": round(missing_rate, 4) if not math.isnan(missing_rate) else "",
            }
        )

    return per_device_rows, delays_per_device


def align_pairwise(
    a: List[Sample], b: List[Sample], max_time_diff_s: float = 2.5
) -> List[Tuple[Sample, Sample]]:
    """Cocokkan sampel A ke B menggunakan nearest timestamp dalam toleransi waktu.
    max_time_diff_s: ambang selisih waktu maksimum agar dianggap match.
    """
    j = 0
    pairs: List[Tuple[Sample, Sample]] = []
    for sa in a:
        best: Optional[Tuple[float, Sample]] = None
        while j < len(b) and b[j].t_device < sa.t_device - max_time_diff_s:
            j += 1
        # kandidat sekitar indeks j
        for k in (j - 1, j, j + 1):
            if 0 <= k < len(b):
                sb = b[k]
                dt = abs(sb.t_device - sa.t_device)
                if dt <= max_time_diff_s:
                    if best is None or dt < best[0]:
                        best = (dt, sb)
        if best is not None:
            pairs.append((sa, best[1]))
    return pairs


def compute_pair_metrics(
    grouped: Dict[str, List[Sample]],
    reference_device_id: str,
) -> Tuple[List[Dict[str, object]], List[Dict[str, object]]]:
    """Kembalikan (pair_rows, error_rows_per_sample)."""
    if reference_device_id not in grouped:
        raise ValueError(f"reference_device_id '{reference_device_id}' tidak ditemukan di data")
    ref = grouped[reference_device_id]

    pair_rows: List[Dict[str, object]] = []
    error_per_sample_rows: List[Dict[str, object]] = []

    for device_id, arr in grouped.items():
        if device_id == reference_device_id:
            continue
        pairs = align_pairwise(arr, ref, max_time_diff_s=2.5)
        if not pairs:
            continue
        # Deviasi jarak dan offset waktu
        errors_m = []
        dt_s = []
        for sa, sb in pairs:
            d = haversine_distance_meters(sa.lat, sa.lon, sb.lat, sb.lon)
            errors_m.append(d)
            dt_s.append(sa.t_device - sb.t_device)
            error_per_sample_rows.append(
                {
                    "device_id": device_id,
                    "reference_device_id": reference_device_id,
                    "t_device": round(sa.t_device, 3),
                    "t_reference": round(sb.t_device, 3),
                    "delta_t_s": round(sa.t_device - sb.t_device, 3),
                    "error_m": round(d, 3),
                }
            )

        # ringkasan
        def _stats(vals: List[float]) -> Tuple[float, float, float]:
            if not vals:
                return float("nan"), float("nan"), float("nan")
            vs = sorted(vals)
            n = len(vs)
            mean_v = sum(vs) / n
            median_v = vs[n // 2] if n % 2 == 1 else (vs[n // 2 - 1] + vs[n // 2]) / 2
            idx = int(math.ceil(0.95 * n)) - 1
            idx = min(max(idx, 0), n - 1)
            p95_v = vs[idx]
            return mean_v, median_v, p95_v

        mean_e, med_e, p95_e = _stats(errors_m)
        mean_dt, med_dt, p95_dt = _stats([abs(v) for v in dt_s])

        pair_rows.append(
            {
                "device_id": device_id,
                "reference_device_id": reference_device_id,
                "pairs": len(pairs),
                "error_mean_m": round(mean_e, 3),
                "error_median_m": round(med_e, 3),
                "error_p95_m": round(p95_e, 3),
                "time_offset_mean_s": round(mean_dt, 3),
                "time_offset_median_s": round(med_dt, 3),
                "time_offset_p95_s": round(p95_dt, 3),
            }
        )

    return pair_rows, error_per_sample_rows


def write_csv(path: str, rows: List[Dict[str, object]]) -> None:
    if not rows:
        # Buat file kosong dengan header minimal agar tidak membingungkan
        with open(path, "w", newline="", encoding="utf-8") as f:
            f.write("")
        return
    fieldnames = list(rows[0].keys())
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Analisis kinerja GPS Tracking eSIR2.0")
    parser.add_argument("--input", required=True, help="Path CSV log GPS")
    parser.add_argument(
        "--expected-interval-s",
        type=float,
        default=5.0,
        help="Interval update yang diharapkan (detik) untuk hitung reliability",
    )
    parser.add_argument(
        "--reference-mode",
        choices=["pair", "none"],
        default="pair",
        help="Metode referensi akurasi: pair=bandingkan ke perangkat referensi, none=skip",
    )
    parser.add_argument(
        "--reference-device-id",
        type=str,
        default="",
        help="Device referensi untuk mode 'pair' (mis. AMBULANCE01)",
    )
    parser.add_argument(
        "--export-detailed",
        action="store_true",
        help="Ekspor tabel per-sampel untuk audit (detailed_samples.csv)",
    )
    parser.add_argument(
        "--output-prefix",
        type=str,
        default="gps_performance_",
        help="Prefix nama file keluaran CSV",
    )

    args = parser.parse_args(argv)

    samples = read_samples(args.input)
    if not samples:
        print("Tidak ada data pada input.")
        return 1
    grouped = group_by_device(samples)

    # Metrik per perangkat
    device_rows, _ = compute_device_metrics(grouped, args.expected_interval_s)
    write_csv(f"{args.output_prefix}device_metrics.csv", device_rows)

    # Metrik pairwise (akurasi relatif)
    pair_rows: List[Dict[str, object]] = []
    detailed_rows: List[Dict[str, object]] = []
    if args.reference_mode == "pair":
        if not args.reference_device_id:
            raise SystemExit("--reference-device-id wajib untuk reference-mode=pair")
        pr, dr = compute_pair_metrics(grouped, args.reference_device_id)
        pair_rows = pr
        detailed_rows = dr
        write_csv(f"{args.output_prefix}device_pair_sync.csv", pair_rows)
        if args.export_detailed:
            write_csv(f"{args.output_prefix}detailed_samples.csv", detailed_rows)
    else:
        # reference none: kosongkan file untuk konsistensi
        write_csv(f"{args.output_prefix}device_pair_sync.csv", [])
        if args.export_detailed:
            write_csv(f"{args.output_prefix}detailed_samples.csv", [])

    # Ringkasan terminal singkat
    print("Selesai. File keluaran:")
    print(f"- {args.output_prefix}device_metrics.csv")
    print(f"- {args.output_prefix}device_pair_sync.csv")
    if args.export_detailed:
        print(f"- {args.output_prefix}detailed_samples.csv")

    return 0


if __name__ == "__main__":
    sys.exit(main())


