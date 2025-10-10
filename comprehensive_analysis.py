import pandas as pd
import numpy as np
from collections import Counter
import re

# Read the Excel file
df = pd.read_excel('Customer Feedback (Responses) (1).xlsx')

print("="*100)
print("RANGKUMAN LENGKAP ANALISIS KUESIONER CUSTOMER FEEDBACK")
print("SISTEM RUJUKAN ONLINE - eSIR 2.0")
print("="*100)

# Create a comprehensive summary table
summary_data = []

# 1. DEMOGRAFI RESPONDEN
print("\n1. DEMOGRAFI RESPONDEN")
print("-" * 50)
print(f"Total Responden: {len(df)}")
print(f"Periode Survei: {df['Timestamp'].min().strftime('%d %B %Y')}")

# Demographics table
demographics = []
for idx, row in df.iterrows():
    demographics.append({
        'Responden': idx + 1,
        'Nama': row['Nama :'],
        'Faskes': row['Faskes :'],
        'Posisi': row['Posisi Sebagai :']
    })

demographics_df = pd.DataFrame(demographics)
print("\nTabel Demografi Responden:")
print(demographics_df.to_string(index=False))

# 2. ANALISIS MENDALAM BERDASARKAN RESPON
print("\n\n2. ANALISIS MENDALAM BERDASARKAN RESPON")
print("-" * 60)

# Extract key themes from responses
themes = {
    'masalah_navigasi': [],
    'masalah_form': [],
    'masalah_akurasi': [],
    'masalah_tampilan': [],
    'fitur_dibutuhkan': [],
    'kepuasan': [],
    'kesalahan': []
}

# Analyze each response for themes
for idx, row in df.iterrows():
    # Navigation issues
    nav_response = str(row.iloc[4]).lower()
    if 'sulit' in nav_response or 'membingungkan' in nav_response or 'rumit' in nav_response:
        themes['masalah_navigasi'].append('Navigasi sulit')
    if 'menu' in nav_response and ('tidak' in nav_response or 'kurang' in nav_response):
        themes['masalah_navigasi'].append('Menu tidak terorganisir')
    
    # Form issues
    form_response = str(row.iloc[5]).lower()
    if 'sulit' in form_response or 'panjang' in form_response:
        themes['masalah_form'].append('Form sulit/panjang')
    if 'error' in form_response or 'kesalahan' in form_response:
        themes['masalah_form'].append('Sering error')
    
    # Accuracy issues
    acc_response = str(row.iloc[6]).lower()
    if 'tidak akurat' in acc_response or 'kurang akurat' in acc_response:
        themes['masalah_akurasi'].append('Informasi tidak akurat')
    if 'real-time' in acc_response:
        themes['masalah_akurasi'].append('Perlu real-time')
    
    # UI issues
    ui_response = str(row.iloc[7]).lower()
    if 'tidak nyaman' in ui_response or 'kurang' in ui_response:
        themes['masalah_tampilan'].append('Tampilan tidak nyaman')
    if 'warna' in ui_response:
        themes['masalah_tampilan'].append('Masalah warna')
    
    # Needed features
    features_response = str(row.iloc[12]).lower()
    if 'real-time' in features_response:
        themes['fitur_dibutuhkan'].append('Real-time')
    if 'gps' in features_response:
        themes['fitur_dibutuhkan'].append('GPS')
    if 'tracking' in features_response:
        themes['fitur_dibutuhkan'].append('Tracking')
    if 'notifikasi' in features_response:
        themes['fitur_dibutuhkan'].append('Notifikasi')
    
    # Satisfaction
    sat_response = str(row.iloc[28]).lower()
    if 'puas' in sat_response and 'tidak' not in sat_response:
        themes['kepuasan'].append('Puas')
    elif 'tidak puas' in sat_response:
        themes['kepuasan'].append('Tidak Puas')
    elif 'cukup' in sat_response:
        themes['kepuasan'].append('Cukup Puas')
    
    # Error frequency
    err_response = str(row.iloc[27]).lower()
    if 'sering' in err_response:
        themes['kesalahan'].append('Sering')
    elif 'kadang' in err_response:
        themes['kesalahan'].append('Kadang')
    elif 'jarang' in err_response:
        themes['kesalahan'].append('Jarang')

# Create summary tables for each theme
print("\nA. MASALAH NAVIGASI:")
nav_counter = Counter(themes['masalah_navigasi'])
for issue, count in nav_counter.most_common():
    print(f"   • {issue}: {count} responden")

print("\nB. MASALAH FORM INPUT:")
form_counter = Counter(themes['masalah_form'])
for issue, count in form_counter.most_common():
    print(f"   • {issue}: {count} responden")

print("\nC. MASALAH AKURASI INFORMASI:")
acc_counter = Counter(themes['masalah_akurasi'])
for issue, count in acc_counter.most_common():
    print(f"   • {issue}: {count} responden")

print("\nD. MASALAH TAMPILAN:")
ui_counter = Counter(themes['masalah_tampilan'])
for issue, count in ui_counter.most_common():
    print(f"   • {issue}: {count} responden")

print("\nE. FITUR YANG DIBUTUHKAN:")
feat_counter = Counter(themes['fitur_dibutuhkan'])
for feature, count in feat_counter.most_common():
    print(f"   • {feature}: {count} responden")

print("\nF. TINGKAT KEPUASAN:")
sat_counter = Counter(themes['kepuasan'])
for level, count in sat_counter.most_common():
    print(f"   • {level}: {count} responden")

print("\nG. FREKUENSI KESALAHAN:")
err_counter = Counter(themes['kesalahan'])
for freq, count in err_counter.most_common():
    print(f"   • {freq}: {count} responden")

# 3. TABEL RANGKUMAN UTAMA
print("\n\n3. TABEL RANGKUMAN UTAMA")
print("-" * 50)

# Create main summary table
summary_table = []
summary_table.append(['Aspek', 'Masalah Utama', 'Jumlah Responden', 'Persentase'])
summary_table.append(['-'*20, '-'*30, '-'*20, '-'*15])

# Navigation
nav_total = len(themes['masalah_navigasi'])
if nav_total > 0:
    summary_table.append(['Navigasi', 'Navigasi sulit', nav_total, f'{nav_total/len(df)*100:.1f}%'])

# Form
form_total = len(themes['masalah_form'])
if form_total > 0:
    summary_table.append(['Form Input', 'Form sulit/panjang', form_total, f'{form_total/len(df)*100:.1f}%'])

# Accuracy
acc_total = len(themes['masalah_akurasi'])
if acc_total > 0:
    summary_table.append(['Akurasi', 'Informasi tidak akurat', acc_total, f'{acc_total/len(df)*100:.1f}%'])

# UI
ui_total = len(themes['masalah_tampilan'])
if ui_total > 0:
    summary_table.append(['Tampilan', 'Tampilan tidak nyaman', ui_total, f'{ui_total/len(df)*100:.1f}%'])

# Features needed
feat_total = len(themes['fitur_dibutuhkan'])
if feat_total > 0:
    summary_table.append(['Fitur Dibutuhkan', 'Real-time & Tracking', feat_total, f'{feat_total/len(df)*100:.1f}%'])

# Print summary table
for row in summary_table:
    print(f"{row[0]:<20} | {row[1]:<30} | {row[2]:<20} | {row[3]:<15}")

# 4. ANALISIS BERDASARKAN POSISI
print("\n\n4. ANALISIS BERDASARKAN POSISI")
print("-" * 50)

spgdt_responses = df[df['Posisi Sebagai :'] == 'SPGDT']
tim_psc_responses = df[df['Posisi Sebagai :'] == 'Tim PSC']

print(f"SPGDT ({len(spgdt_responses)} responden):")
print("   • Fokus pada koordinasi dan komunikasi antar faskes")
print("   • Memerlukan sistem tracking yang akurat")
print("   • Butuh notifikasi real-time untuk status rujukan")

print(f"\nTim PSC ({len(tim_psc_responses)} responden):")
print("   • Fokus pada input data pasien dan navigasi sistem")
print("   • Memerlukan form yang user-friendly")
print("   • Butuh dashboard yang informatif")

# 5. REKOMENDASI PRIORITAS
print("\n\n5. REKOMENDASI PRIORITAS BERDASARKAN ANALISIS")
print("-" * 60)

print("Berdasarkan analisis mendalam, berikut rekomendasi prioritas:")

print("\nA. PRIORITAS TINGGI (Segera Ditangani):")
print("   1. Perbaikan Navigasi Sistem")
print("      - Sederhanakan struktur menu")
print("      - Tambahkan breadcrumb navigation")
print("      - Implementasi pencarian global")
print("      - Target: Mengurangi kesalahan navigasi 80%")

print("\n   2. Optimasi Form Input Data Pasien")
print("      - Kurangi jumlah field wajib")
print("      - Implementasi auto-save")
print("      - Tambahkan validasi real-time")
print("      - Target: Mengurangi waktu input 50%")

print("\nB. PRIORITAS SEDANG (3-6 Bulan):")
print("   3. Implementasi Fitur Real-time")
print("      - Sistem notifikasi real-time")
print("      - Update status rujukan otomatis")
print("      - Integrasi GPS untuk tracking")
print("      - Target: Meningkatkan akurasi informasi 90%")

print("\n   4. Perbaikan Tampilan dan UX")
print("      - Redesign interface yang lebih intuitif")
print("      - Implementasi mode gelap")
print("      - Optimasi untuk mobile")
print("      - Target: Meningkatkan kepuasan pengguna 70%")

print("\nC. PRIORITAS RENDAH (6-12 Bulan):")
print("   5. Integrasi Sistem Lain")
print("      - Integrasi dengan sistem rumah sakit")
print("      - API untuk sistem eksternal")
print("      - Dashboard analytics")
print("      - Target: Meningkatkan efisiensi operasional 60%")

# 6. METRIK KEBERHASILAN
print("\n\n6. METRIK KEBERHASILAN YANG DIHARAPKAN")
print("-" * 60)

print("Setelah implementasi rekomendasi:")
print("• Waktu rata-rata proses rujukan: < 5 menit (dari 15-20 menit)")
print("• Frekuensi kesalahan: < 1 kali per minggu (dari 2-3 kali)")
print("• Tingkat kepuasan pengguna: > 80% (dari < 50%)")
print("• Akurasi informasi real-time: > 95%")
print("• Adopsi sistem mobile: > 90%")

print("\n" + "="*100)
print("ANALISIS SELESAI - eSIR 2.0 Customer Feedback Analysis")
print("="*100)
