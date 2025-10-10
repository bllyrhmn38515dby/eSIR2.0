## Panduan Uji Kinerja GPS Tracking (eSIR 2.0)

Dokumen ini menjelaskan cara menyiapkan data uji, menjalankan analisis, dan membaca hasil untuk mengukur:
- Akurasi lokasi (deviasi jarak, meter)
- Kecepatan pembaruan (interval update)
- Keandalan sinkronisasi (delay server vs perangkat) dan reliabilitas (missing rate)

### 1) Siapkan data log (CSV)
- Nama file bebas, contoh: `logs_gps.csv`
- Wajib punya header: `device_id,timestamp,latitude,longitude`
- Opsional: `server_timestamp` (untuk mengukur delay end-to-end)
- Format `timestamp` mendukung ISO8601 (mis. `2025-10-08T12:00:00Z`) atau epoch (detik/milis)

Contoh minimal:

```csv
device_id,timestamp,latitude,longitude,server_timestamp
AMBULANCE01,2025-10-08T12:00:00Z,-6.200100,106.816700,2025-10-08T12:00:00.5Z
AMBULANCE01,2025-10-08T12:00:05Z,-6.200300,106.816900,2025-10-08T12:00:05.6Z
MEDIC01,2025-10-08T12:00:00Z,-6.200110,106.816690,2025-10-08T12:00:00.7Z
MEDIC01,2025-10-08T12:00:05Z,-6.200320,106.816920,2025-10-08T12:00:05.9Z
```

Catatan pengambilan data sesuai skenario ±5 km:
- Rekam titik setiap ±5 detik selama perjalanan.
- Gunakan `AMBULANCE01` sebagai referensi, perangkat lain (mis. `MEDIC01`) sebagai pembanding.
- Jika ada, catat `server_timestamp` saat titik diterima di server.

### 2) Jalankan analisis
Jalankan dari root proyek (Windows PowerShell):

```bash
python analyze_gps_performance.py --input logs_gps.csv --expected-interval-s 5 --reference-mode pair --reference-device-id AMBULANCE01 --export-detailed --output-prefix hasil_uji_
```

Parameter penting:
- `--input`: path file CSV log.
- `--expected-interval-s`: interval target pengiriman (default 5 detik).
- `--reference-mode`: `pair` untuk membandingkan ke perangkat referensi; `none` untuk lewati perbandingan.
- `--reference-device-id`: ID perangkat acuan (mis. ambulans).
- `--export-detailed`: ekspor tabel per-sampel untuk audit.
- `--output-prefix`: prefix nama file keluaran CSV.

### 3) Hasil keluaran (tabel CSV)
Skrip menghasilkan file berikut:

- `hasil_uji_device_metrics.csv` — ringkasan per perangkat:
  - device_id, samples, trip_duration_s, interval_mean_s, interval_median_s, interval_p95_s,
    delay_mean_s, delay_median_s, delay_p95_s, expected_count, missing_rate

- `hasil_uji_device_pair_sync.csv` — akurasi relatif ke perangkat referensi:
  - device_id, reference_device_id, pairs, error_mean_m, error_median_m, error_p95_m,
    time_offset_mean_s, time_offset_median_s, time_offset_p95_s

- `hasil_uji_detailed_samples.csv` (opsional) — data per-sampel hasil pencocokan:
  - device_id, reference_device_id, t_device, t_reference, delta_t_s, error_m

### 4) Interpretasi cepat
- Akurasi (meter): median dan p95 lebih representatif dari mean; makin kecil makin baik.
- Interval update: median mendekati 5 s sesuai target; p95 tinggi menandakan jitter.
- Delay sinkronisasi: nilai yang kecil (khususnya p95) menandakan sinkronisasi andal.
- Missing rate: mendekati 0 menunjukkan reliabilitas pengiriman titik sesuai interval ekspektasi.

### 5) Validasi silang dengan Google Maps (opsional)
- Ambil beberapa titik sampel (awal, tengah, akhir), plot di Google Maps untuk inspeksi visual.
- Bandingkan lintasan referensi (ambulans) dan perangkat lain; deviasi signifikan harus tercermin pada `error_m` tinggi.
- Untuk evaluasi rute jalan, Anda bisa gunakan layanan Directions/Roads API secara terpisah bila diperlukan.

### 6) Pertanyaan umum
- Tidak ada `server_timestamp`? Skrip tetap berjalan, namun kolom delay akan kosong.
- Timestamps tidak seragam? Parser mendukung ISO8601 dan epoch; pastikan konsisten per baris.
- Tidak ada pasangan waktu cocok saat `pair`? Baris perbandingan bisa kosong; periksa interval dan toleransi waktu.


