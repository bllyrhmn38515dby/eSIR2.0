import pandas as pd
import numpy as np
from collections import Counter
import re

# Read the Excel file
df = pd.read_excel('Customer Feedback (Responses) (1).xlsx')

print("="*80)
print("RANGKUMAN ANALISIS KUESIONER CUSTOMER FEEDBACK")
print("SISTEM RUJUKAN ONLINE")
print("="*80)

# 1. DEMOGRAFI RESPONDEN
print("\n1. DEMOGRAFI RESPONDEN")
print("-" * 40)
print(f"Total Responden: {len(df)}")
print(f"Tanggal Survei: {df['Timestamp'].min().strftime('%d %B %Y')} - {df['Timestamp'].max().strftime('%d %B %Y')}")

print("\nDistribusi Berdasarkan Fasilitas Kesehatan:")
faskes_counts = df['Faskes :'].value_counts()
for faskes, count in faskes_counts.items():
    print(f"  • {faskes}: {count} responden ({count/len(df)*100:.1f}%)")

print("\nDistribusi Berdasarkan Posisi:")
posisi_counts = df['Posisi Sebagai :'].value_counts()
for posisi, count in posisi_counts.items():
    print(f"  • {posisi}: {count} responden ({count/len(df)*100:.1f}%)")

# 2. ANALISIS PENGALAMAN PENGGUNAAN SISTEM
print("\n\n2. ANALISIS PENGALAMAN PENGGUNAAN SISTEM")
print("-" * 50)

# Analisis durasi penggunaan
print("\nDurasi Penggunaan Sistem:")
durasi_responses = df.iloc[:, 3].tolist()  # Kolom pengalaman penggunaan
durasi_keywords = {
    'baru': 0, 'bulan': 0, 'tahun': 0, 'minggu': 0, 'hari': 0,
    'lama': 0, 'sudah': 0, 'belum': 0
}

for response in durasi_responses:
    response_lower = str(response).lower()
    for keyword in durasi_keywords:
        if keyword in response_lower:
            durasi_keywords[keyword] += 1

for keyword, count in durasi_keywords.items():
    if count > 0:
        print(f"  • Menggunakan sistem {keyword}: {count} responden")

# 3. ANALISIS MASALAH NAVIGASI
print("\n\n3. ANALISIS MASALAH NAVIGASI")
print("-" * 40)

# Analisis masalah navigasi umum
nav_problems = []
for response in df.iloc[:, 4].tolist():  # Kolom navigasi
    response_str = str(response).lower()
    if 'sulit' in response_str:
        nav_problems.append('Sulit navigasi')
    if 'mudah' in response_str:
        nav_problems.append('Mudah navigasi')
    if 'rumit' in response_str:
        nav_problems.append('Navigasi rumit')
    if 'confusing' in response_str or 'bingung' in response_str:
        nav_problems.append('Navigasi membingungkan')

nav_counter = Counter(nav_problems)
print("Masalah Navigasi yang Ditemukan:")
for problem, count in nav_counter.most_common():
    print(f"  • {problem}: {count} responden")

# 4. ANALISIS MASALAH FORM INPUT
print("\n\n4. ANALISIS MASALAH FORM INPUT DATA PASIEN")
print("-" * 50)

form_problems = []
for response in df.iloc[:, 5].tolist():  # Kolom form input
    response_str = str(response).lower()
    if 'sulit' in response_str:
        form_problems.append('Form sulit digunakan')
    if 'panjang' in response_str:
        form_problems.append('Form terlalu panjang')
    if 'error' in response_str or 'kesalahan' in response_str:
        form_problems.append('Sering terjadi error')
    if 'loading' in response_str or 'lambat' in response_str:
        form_problems.append('Loading lambat')

form_counter = Counter(form_problems)
print("Masalah Form Input yang Ditemukan:")
for problem, count in form_counter.most_common():
    print(f"  • {problem}: {count} responden")

# 5. ANALISIS AKURASI INFORMASI
print("\n\n5. ANALISIS AKURASI INFORMASI FASILITAS")
print("-" * 50)

accuracy_issues = []
for response in df.iloc[:, 6].tolist():  # Kolom akurasi informasi
    response_str = str(response).lower()
    if 'tidak akurat' in response_str or 'kurang akurat' in response_str:
        accuracy_issues.append('Informasi tidak akurat')
    if 'update' in response_str or 'terbaru' in response_str:
        accuracy_issues.append('Perlu update informasi')
    if 'real-time' in response_str:
        accuracy_issues.append('Perlu informasi real-time')

accuracy_counter = Counter(accuracy_issues)
print("Masalah Akurasi Informasi:")
for issue, count in accuracy_counter.most_common():
    print(f"  • {issue}: {count} responden")

# 6. ANALISIS TAMPILAN SISTEM
print("\n\n6. ANALISIS TAMPILAN SISTEM")
print("-" * 40)

ui_feedback = []
for response in df.iloc[:, 7].tolist():  # Kolom tampilan sistem
    response_str = str(response).lower()
    if 'nyaman' in response_str:
        ui_feedback.append('Tampilan nyaman')
    if 'tidak nyaman' in response_str:
        ui_feedback.append('Tampilan tidak nyaman')
    if 'warna' in response_str:
        ui_feedback.append('Masalah warna')
    if 'layout' in response_str or 'tata letak' in response_str:
        ui_feedback.append('Masalah layout')

ui_counter = Counter(ui_feedback)
print("Feedback Tampilan Sistem:")
for feedback, count in ui_counter.most_common():
    print(f"  • {feedback}: {count} responden")

# 7. ANALISIS FITUR YANG DIBUTUHKAN
print("\n\n7. ANALISIS FITUR YANG DIBUTUHKAN")
print("-" * 50)

needed_features = []
for response in df.iloc[:, 12].tolist():  # Kolom fitur yang dibutuhkan
    response_str = str(response).lower()
    if 'real-time' in response_str:
        needed_features.append('Fitur Real-time')
    if 'gps' in response_str:
        needed_features.append('Integrasi GPS')
    if 'tracking' in response_str or 'pelacakan' in response_str:
        needed_features.append('Fitur Tracking')
    if 'notifikasi' in response_str:
        needed_features.append('Sistem Notifikasi')
    if 'dashboard' in response_str:
        needed_features.append('Dashboard yang lebih baik')
    if 'mobile' in response_str or 'smartphone' in response_str:
        needed_features.append('Aplikasi Mobile')

features_counter = Counter(needed_features)
print("Fitur yang Paling Dibutuhkan:")
for feature, count in features_counter.most_common():
    print(f"  • {feature}: {count} responden")

# 8. ANALISIS KEPUASAN KESELURUHAN
print("\n\n8. ANALISIS KEPUASAN KESELURUHAN")
print("-" * 50)

satisfaction_levels = []
for response in df.iloc[:, 28].tolist():  # Kolom kepuasan keseluruhan
    response_str = str(response).lower()
    if 'puas' in response_str and 'tidak' not in response_str:
        satisfaction_levels.append('Puas')
    elif 'tidak puas' in response_str:
        satisfaction_levels.append('Tidak Puas')
    elif 'cukup' in response_str:
        satisfaction_levels.append('Cukup Puas')
    elif 'kurang' in response_str:
        satisfaction_levels.append('Kurang Puas')

satisfaction_counter = Counter(satisfaction_levels)
print("Tingkat Kepuasan Responden:")
for level, count in satisfaction_counter.most_common():
    print(f"  • {level}: {count} responden")

# 9. ANALISIS FREKUENSI KESALAHAN
print("\n\n9. ANALISIS FREKUENSI KESALAHAN")
print("-" * 50)

error_frequency = []
for response in df.iloc[:, 27].tolist():  # Kolom frekuensi kesalahan
    response_str = str(response).lower()
    if 'sering' in response_str:
        error_frequency.append('Sering melakukan kesalahan')
    elif 'kadang' in response_str or 'terkadang' in response_str:
        error_frequency.append('Kadang melakukan kesalahan')
    elif 'jarang' in response_str:
        error_frequency.append('Jarang melakukan kesalahan')
    elif 'tidak pernah' in response_str:
        error_frequency.append('Tidak pernah melakukan kesalahan')

error_counter = Counter(error_frequency)
print("Frekuensi Kesalahan Penggunaan:")
for freq, count in error_counter.most_common():
    print(f"  • {freq}: {count} responden")

# 10. REKOMENDASI UTAMA
print("\n\n10. REKOMENDASI UTAMA BERDASARKAN ANALISIS")
print("-" * 60)

print("Berdasarkan analisis feedback responden, berikut rekomendasi utama:")
print("\n1. PERBAIKAN NAVIGASI:")
print("   • Sederhanakan struktur menu")
print("   • Tambahkan breadcrumb navigation")
print("   • Perbaiki pencarian fitur")

print("\n2. OPTIMASI FORM INPUT:")
print("   • Kurangi jumlah field yang harus diisi")
print("   • Tambahkan validasi real-time")
print("   • Implementasi auto-save")

print("\n3. PENINGKATAN AKURASI INFORMASI:")
print("   • Integrasi sistem real-time")
print("   • Update informasi fasilitas secara berkala")
print("   • Implementasi GPS tracking")

print("\n4. PERBAIKAN TAMPILAN:")
print("   • Gunakan warna yang lebih soft untuk lingkungan medis")
print("   • Perbaiki layout untuk kemudahan navigasi")
print("   • Tambahkan mode gelap")

print("\n5. FITUR PRIORITAS:")
print("   • Sistem notifikasi real-time")
print("   • Dashboard yang lebih informatif")
print("   • Aplikasi mobile yang responsif")
print("   • Integrasi GPS untuk tracking")

print("\n" + "="*80)
print("ANALISIS SELESAI")
print("="*80)
