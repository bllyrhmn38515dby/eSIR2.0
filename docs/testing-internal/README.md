# Laporan Uji Internal & Ekspor Grafik

Berkas diagram (.mmd):
- auth_access_pass_fail.mmd → Autentikasi & Akses
- form_autosave_validation.mmd → Auto-save & Validasi Form
- db_sync_distribution.mmd → Distribusi Operasi DB
- ui_responsiveness_status.mmd → Responsivitas UI
- gps_update_interval.mmd → Interval Update GPS

## Cara Ekspor PNG (Windows PowerShell)
1. Install Mermaid CLI (sekali saja):
   ```powershell
   npm i -g @mermaid-js/mermaid-cli
   ```
2. Jalankan ekspor dari folder ini:
   ```powershell
   ./export-mermaid-to-png.ps1 -InputDir . -OutDir ./png
   ```
3. Hasil PNG akan berada di folder `png/`.

## Referensi Endpoint & Log Uji
Lihat `ENDPOINTS_DAN_LOG_UJI.md` untuk spesifikasi endpoint dan ringkasan log uji.
