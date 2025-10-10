#!/usr/bin/env python3
"""
Generator data log GPS sintetis untuk uji kinerja eSIR 2.0.

Membuat lintasan ~N langkah dengan interval 5 detik, total jarak ~ langkah * step_meters.
Menghasilkan dua perangkat: AMBULANCE01 (referensi) dan MEDIC01 (dengan noise kecil).

Contoh pakai:
  python generate_sample_logs.py --output logs_gps.csv --steps 70 --step-meters 70 \
    --start-lat -6.2001 --start-lon 106.8167 --server-delay-amb 0.6 --server-delay-medic 0.8

Hasil CSV kolom:
  device_id,timestamp,latitude,longitude,server_timestamp
"""

from __future__ import annotations

import argparse
import csv
from datetime import datetime, timedelta, timezone
import math
import random
from typing import Tuple


def meters_to_deg(d_m: float, lat_deg: float) -> Tuple[float, float]:
    # 1 deg lat ~ 111_000 m, 1 deg lon ~ 111_000 * cos(lat)
    dlat = d_m / 111_000.0
    dlon = d_m / (111_000.0 * max(0.1, math.cos(math.radians(lat_deg))))
    return dlat, dlon


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate synthetic GPS logs")
    parser.add_argument("--output", required=True, help="Path output CSV")
    parser.add_argument("--steps", type=int, default=70, help="Jumlah langkah (titik) - 1")
    parser.add_argument("--step-meters", type=float, default=70.0, help="Jarak per langkah (meter)")
    parser.add_argument("--start-lat", type=float, default=-6.2001, help="Latitude awal")
    parser.add_argument("--start-lon", type=float, default=106.8167, help="Longitude awal")
    parser.add_argument("--bearing-deg", type=float, default=45.0, help="Arah gerak (derajat dari utara, searah jarum jam)")
    parser.add_argument("--start-time", type=str, default="2025-10-08T12:00:00Z", help="Waktu mulai ISO8601")
    parser.add_argument("--interval-s", type=int, default=5, help="Interval detik")
    parser.add_argument("--server-delay-amb", type=float, default=0.6, help="Delay server ambulans (detik)")
    parser.add_argument("--server-delay-medic", type=float, default=0.8, help="Delay server medic (detik)")
    parser.add_argument("--noise-medic-m", type=float, default=6.0, help="Noise posisi MEDIC01 (meter RMS)")
    args = parser.parse_args()

    # Seed agar deterministik
    random.seed(42)

    # Parse waktu mulai
    t0 = datetime.fromisoformat(args.start_time.replace("Z", "+00:00")).astimezone(timezone.utc)

    # Komponen gerak per langkah
    bearing_rad = math.radians(args.bearing_deg)
    step_forward_m = args.step_meters

    lat = args.start_lat
    lon = args.start_lon

    rows = []
    for i in range(args.steps + 1):
        t = t0 + timedelta(seconds=i * args.interval_s)
        # AMBULANCE01
        amb_time = t
        amb_server = amb_time + timedelta(seconds=args.server_delay_amb)
        rows.append(
            [
                "AMBULANCE01",
                amb_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                f"{lat:.6f}",
                f"{lon:.6f}",
                amb_server.strftime("%Y-%m-%dT%H:%M:%SZ"),
            ]
        )

        # MEDIC01 - tambahkan noise kecil agar ada deviasi realistis
        # Noise Gaussian skala meter, konversi ke derajat
        noise_m_north = random.gauss(0.0, args.noise_medic_m)
        noise_m_east = random.gauss(0.0, args.noise_medic_m)
        dlat_noise, _ = meters_to_deg(noise_m_north, lat)
        _, dlon_noise = meters_to_deg(noise_m_east, lat)
        medic_lat = lat + dlat_noise
        medic_lon = lon + dlon_noise

        medic_time = t
        medic_server = medic_time + timedelta(seconds=args.server_delay_medic)
        rows.append(
            [
                "MEDIC01",
                medic_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                f"{medic_lat:.6f}",
                f"{medic_lon:.6f}",
                medic_server.strftime("%Y-%m-%dT%H:%M:%SZ"),
            ]
        )

        # Update posisi untuk langkah berikutnya
        # Proyeksikan per langkah berdasarkan bearing
        north_m = step_forward_m * math.cos(bearing_rad)
        east_m = step_forward_m * math.sin(bearing_rad)
        dlat_deg, _ = meters_to_deg(north_m, lat)
        _, dlon_deg = meters_to_deg(east_m, lat)
        lat += dlat_deg
        lon += dlon_deg

    # Tulis CSV
    with open(args.output, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["device_id", "timestamp", "latitude", "longitude", "server_timestamp"])
        writer.writerows(rows)

    print(f"Berhasil membuat {args.output} dengan {len(rows)} baris.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())



