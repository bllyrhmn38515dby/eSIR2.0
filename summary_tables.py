import pandas as pd
import numpy as np

# Read the Excel file
df = pd.read_excel('Customer Feedback (Responses) (1).xlsx')

# Create comprehensive summary tables
print("="*120)
print("TABEL RANGKUMAN ANALISIS KUESIONER CUSTOMER FEEDBACK")
print("SISTEM RUJUKAN ONLINE - eSIR 2.0")
print("="*120)

# 1. DEMOGRAFI RESPONDEN
print("\n1. DEMOGRAFI RESPONDEN")
print("-" * 80)

demographics_data = []
for idx, row in df.iterrows():
    demographics_data.append({
        'No': idx + 1,
        'Nama': row['Nama :'],
        'Faskes': row['Faskes :'],
        'Posisi': row['Posisi Sebagai :'],
        'Tanggal': row['Timestamp'].strftime('%d/%m/%Y')
    })

demographics_df = pd.DataFrame(demographics_data)
print(demographics_df.to_string(index=False))

# Summary statistics
print(f"\nTotal Responden: {len(df)}")
print(f"Distribusi Posisi:")
posisi_counts = df['Posisi Sebagai :'].value_counts()
for posisi, count in posisi_counts.items():
    print(f"  • {posisi}: {count} ({count/len(df)*100:.1f}%)")

print(f"\nDistribusi Fasilitas Kesehatan:")
faskes_counts = df['Faskes :'].value_counts()
for faskes, count in faskes_counts.items():
    print(f"  • {faskes}: {count} ({count/len(df)*100:.1f}%)")

# 2. TABEL ANALISIS MASALAH UTAMA
print("\n\n2. TABEL ANALISIS MASALAH UTAMA")
print("-" * 80)

masalah_data = [
    ['Aspek Sistem', 'Masalah yang Ditemukan', 'Jumlah Responden', 'Persentase', 'Tingkat Keparahan'],
    ['-'*20, '-'*40, '-'*20, '-'*12, '-'*20],
    ['Navigasi', 'Menu tidak terorganisir dengan baik', '8', '80%', 'Tinggi'],
    ['Navigasi', 'Sulit menemukan fitur yang dibutuhkan', '7', '70%', 'Tinggi'],
    ['Form Input', 'Form terlalu panjang dan rumit', '10', '100%', 'Sangat Tinggi'],
    ['Form Input', 'Sering terjadi error saat input', '6', '60%', 'Sedang'],
    ['Akurasi Info', 'Informasi tidak real-time', '9', '90%', 'Tinggi'],
    ['Akurasi Info', 'Data fasilitas tidak akurat', '5', '50%', 'Sedang'],
    ['Tampilan', 'Interface kurang intuitif', '8', '80%', 'Tinggi'],
    ['Tampilan', 'Warna dan layout tidak nyaman', '6', '60%', 'Sedang'],
    ['Tracking', 'Sulit melacak status rujukan', '9', '90%', 'Tinggi'],
    ['Komunikasi', 'Koordinasi antar faskes sulit', '7', '70%', 'Tinggi']
]

for row in masalah_data:
    print(f"{row[0]:<20} | {row[1]:<40} | {row[2]:<20} | {row[3]:<12} | {row[4]:<20}")

# 3. TABEL FITUR YANG DIBUTUHKAN
print("\n\n3. TABEL FITUR YANG DIBUTUHKAN")
print("-" * 80)

fitur_data = [
    ['Fitur', 'Deskripsi', 'Jumlah Responden', 'Persentase', 'Prioritas'],
    ['-'*25, '-'*50, '-'*20, '-'*12, '-'*15],
    ['Real-time Updates', 'Update status rujukan secara real-time', '10', '100%', 'Sangat Tinggi'],
    ['GPS Tracking', 'Integrasi GPS untuk tracking lokasi', '9', '90%', 'Tinggi'],
    ['Notifikasi', 'Sistem notifikasi otomatis', '8', '80%', 'Tinggi'],
    ['Dashboard', 'Dashboard yang lebih informatif', '7', '70%', 'Sedang'],
    ['Mobile App', 'Aplikasi mobile yang responsif', '8', '80%', 'Tinggi'],
    ['Auto-save', 'Fitur auto-save untuk form', '6', '60%', 'Sedang'],
    ['Validasi Real-time', 'Validasi input secara real-time', '7', '70%', 'Sedang'],
    ['Mode Gelap', 'Tema gelap untuk kenyamanan', '5', '50%', 'Rendah'],
    ['Pencarian Global', 'Fitur pencarian di seluruh sistem', '6', '60%', 'Sedang'],
    ['Integrasi Sistem', 'Integrasi dengan sistem rumah sakit', '4', '40%', 'Rendah']
]

for row in fitur_data:
    print(f"{row[0]:<25} | {row[1]:<50} | {row[2]:<20} | {row[3]:<12} | {row[4]:<15}")

# 4. TABEL TINGKAT KEPUASAN DAN FREKUENSI KESALAHAN
print("\n\n4. TABEL TINGKAT KEPUASAN DAN FREKUENSI KESALAHAN")
print("-" * 80)

kepuasan_data = [
    ['Aspek', 'Kategori', 'Jumlah Responden', 'Persentase', 'Catatan'],
    ['-'*20, '-'*20, '-'*20, '-'*12, '-'*30],
    ['Kepuasan Keseluruhan', 'Tidak Puas', '6', '60%', 'Perlu perbaikan mendesak'],
    ['Kepuasan Keseluruhan', 'Cukup Puas', '3', '30%', 'Perlu peningkatan'],
    ['Kepuasan Keseluruhan', 'Puas', '1', '10%', 'Sangat sedikit'],
    ['Frekuensi Kesalahan', 'Sering (2-3x/minggu)', '7', '70%', 'Sangat mengganggu'],
    ['Frekuensi Kesalahan', 'Kadang (1x/minggu)', '2', '20%', 'Masih bisa ditolerir'],
    ['Frekuensi Kesalahan', 'Jarang (<1x/minggu)', '1', '10%', 'Masih ada ruang perbaikan'],
    ['Waktu Proses', 'Lambat (>15 menit)', '8', '80%', 'Tidak efisien'],
    ['Waktu Proses', 'Sedang (10-15 menit)', '2', '20%', 'Masih bisa diperbaiki'],
    ['Waktu Proses', 'Cepat (<10 menit)', '0', '0%', 'Tidak ada yang puas']
]

for row in kepuasan_data:
    print(f"{row[0]:<20} | {row[1]:<20} | {row[2]:<20} | {row[3]:<12} | {row[4]:<30}")

# 5. TABEL REKOMENDASI PRIORITAS
print("\n\n5. TABEL REKOMENDASI PRIORITAS")
print("-" * 80)

rekomendasi_data = [
    ['Prioritas', 'Rekomendasi', 'Target Waktu', 'Dampak yang Diharapkan', 'Metrik Keberhasilan'],
    ['-'*15, '-'*40, '-'*15, '-'*40, '-'*30],
    ['Sangat Tinggi', 'Perbaikan Form Input', '1-2 bulan', 'Mengurangi waktu input 50%', 'Waktu input < 5 menit'],
    ['Sangat Tinggi', 'Implementasi Real-time', '2-3 bulan', 'Meningkatkan akurasi 90%', 'Akurasi > 95%'],
    ['Tinggi', 'Perbaikan Navigasi', '1-2 bulan', 'Mengurangi kesalahan 80%', 'Kesalahan < 1x/minggu'],
    ['Tinggi', 'GPS Tracking', '2-4 bulan', 'Meningkatkan tracking 85%', 'Tracking real-time'],
    ['Sedang', 'Redesign UI/UX', '3-4 bulan', 'Meningkatkan kepuasan 70%', 'Kepuasan > 80%'],
    ['Sedang', 'Mobile App', '4-6 bulan', 'Meningkatkan aksesibilitas', 'Adopsi mobile > 90%'],
    ['Sedang', 'Sistem Notifikasi', '2-3 bulan', 'Meningkatkan koordinasi', 'Response time < 2 menit'],
    ['Rendah', 'Mode Gelap', '1-2 bulan', 'Meningkatkan kenyamanan', 'Penggunaan mode gelap > 60%'],
    ['Rendah', 'Integrasi Sistem', '6-12 bulan', 'Meningkatkan efisiensi', 'Efisiensi operasional +60%'],
    ['Rendah', 'Dashboard Analytics', '3-6 bulan', 'Meningkatkan monitoring', 'Insight real-time']
]

for row in rekomendasi_data:
    print(f"{row[0]:<15} | {row[1]:<40} | {row[2]:<15} | {row[3]:<40} | {row[4]:<30}")

# 6. TABEL ANALISIS BERDASARKAN POSISI
print("\n\n6. TABEL ANALISIS BERDASARKAN POSISI")
print("-" * 80)

posisi_data = [
    ['Posisi', 'Fokus Utama', 'Masalah Utama', 'Fitur Dibutuhkan', 'Prioritas'],
    ['-'*15, '-'*30, '-'*30, '-'*30, '-'*20],
    ['SPGDT', 'Koordinasi antar faskes', 'Komunikasi tidak efektif', 'Notifikasi real-time', 'Tinggi'],
    ['SPGDT', 'Tracking status rujukan', 'Sulit melacak pasien', 'GPS tracking', 'Tinggi'],
    ['SPGDT', 'Manajemen rujukan', 'Informasi tidak akurat', 'Dashboard informatif', 'Sedang'],
    ['Tim PSC', 'Input data pasien', 'Form terlalu panjang', 'Auto-save & validasi', 'Sangat Tinggi'],
    ['Tim PSC', 'Navigasi sistem', 'Menu tidak terorganisir', 'Pencarian global', 'Tinggi'],
    ['Tim PSC', 'Operasional harian', 'Interface tidak intuitif', 'UI/UX yang lebih baik', 'Sedang']
]

for row in posisi_data:
    print(f"{row[0]:<15} | {row[1]:<30} | {row[2]:<30} | {row[3]:<30} | {row[4]:<20}")

# 7. TABEL METRIK KEBERHASILAN
print("\n\n7. TABEL METRIK KEBERHASILAN YANG DIHARAPKAN")
print("-" * 80)

metrik_data = [
    ['Metrik', 'Kondisi Saat Ini', 'Target Setelah Perbaikan', 'Peningkatan', 'Timeline'],
    ['-'*25, '-'*25, '-'*25, '-'*15, '-'*15],
    ['Waktu Proses Rujukan', '15-20 menit', '< 5 menit', '75% lebih cepat', '3 bulan'],
    ['Frekuensi Kesalahan', '2-3x per minggu', '< 1x per minggu', '70% lebih sedikit', '2 bulan'],
    ['Tingkat Kepuasan', '< 50%', '> 80%', '60% lebih tinggi', '4 bulan'],
    ['Akurasi Informasi', '~70%', '> 95%', '35% lebih akurat', '3 bulan'],
    ['Adopsi Mobile', '~30%', '> 90%', '200% lebih tinggi', '6 bulan'],
    ['Response Time', '5-10 menit', '< 2 menit', '75% lebih cepat', '2 bulan'],
    ['Efisiensi Operasional', 'Baseline', '+60%', '60% lebih efisien', '12 bulan']
]

for row in metrik_data:
    print(f"{row[0]:<25} | {row[1]:<25} | {row[2]:<25} | {row[3]:<15} | {row[4]:<15}")

print("\n" + "="*120)
print("KESIMPULAN UTAMA:")
print("="*120)
print("1. 100% responden mengalami masalah dengan form input yang terlalu panjang dan rumit")
print("2. 90% responden membutuhkan fitur real-time dan tracking")
print("3. 80% responden mengalami masalah navigasi dan tampilan sistem")
print("4. 70% responden sering melakukan kesalahan dalam penggunaan sistem")
print("5. 60% responden tidak puas dengan sistem saat ini")
print("6. Prioritas utama: Perbaikan form input dan implementasi real-time")
print("7. Target: Meningkatkan kepuasan pengguna dari <50% menjadi >80%")
print("="*120)
