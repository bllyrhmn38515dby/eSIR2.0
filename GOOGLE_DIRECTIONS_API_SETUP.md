# 🗝️ Google Directions API Setup Guide

## 🎯 **Mengapa Google Directions API?**

Google Directions API memberikan **akurasi tertinggi** untuk routing yang mengikuti jalan-jalan yang sebenarnya, sama persis dengan yang terlihat di Google Maps.

---

## 📋 **Langkah-langkah Mendapatkan API Key**

### 1. **Buat Google Cloud Account**
- Kunjungi: https://console.cloud.google.com/
- Login dengan akun Google Anda
- Jika belum punya akun, daftar dulu

### 2. **Buat Project Baru**
- Klik "Select a project" di bagian atas
- Klik "New Project"
- **Project name:** `eSIR2-Routing` (atau nama lain)
- Klik "Create"

### 3. **Enable Google Directions API**
- Di sidebar kiri, klik "APIs & Services" > "Library"
- Search: `Directions API`
- Klik pada "Directions API"
- Klik "Enable"

### 4. **Buat API Key**
- Di sidebar kiri, klik "APIs & Services" > "Credentials"
- Klik "Create Credentials" > "API Key"
- **Copy API Key** yang muncul
- **PENTING:** Klik "Restrict Key" untuk keamanan

### 5. **Restrict API Key (Opsional tapi Disarankan)**
- Klik pada API key yang baru dibuat
- Di bagian "API restrictions", pilih "Restrict key"
- Pilih "Directions API"
- Di bagian "Application restrictions", pilih "HTTP referrers"
- Tambahkan: `localhost:3001/*` dan domain production Anda

---

## ⚙️ **Setup di Backend**

### 1. **Update File .env**
```bash
# Buka file backend/.env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. **Restart Backend**
```bash
cd backend
# Stop backend jika sedang berjalan
Get-Process -Name "node" | Stop-Process -Force
# Start backend
node app.js
```

---

## 🧪 **Testing Google Directions API**

### Test dengan PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/routing/precise-route" -Method POST -ContentType "application/json" -Body '{"startLat": -6.5971, "startLng": 106.8060, "endLat": -6.4000, "endLng": 106.9000}'
```

### Expected Result:
- **Google Directions:** 1000+ titik koordinat (sangat presisi)
- **Akurasi:** Mengikuti jalan-jalan yang sebenarnya
- **Visual:** Sama persis dengan Google Maps

---

## 💰 **Pricing Google Directions API**

### Free Tier:
- ✅ **$200 credit gratis** untuk new users
- ✅ **40,000 requests gratis** per bulan
- ✅ **Tidak perlu kartu kredit** untuk free tier

### Paid Tier:
- 💰 **$5 per 1,000 requests** (setelah free tier)
- 💰 **$0.005 per request** untuk jarak pendek

### Estimasi Biaya untuk eSIR2.0:
- **100 requests/hari** = $15/bulan
- **500 requests/hari** = $75/bulan
- **1000 requests/hari** = $150/bulan

---

## 🔒 **Security Best Practices**

### 1. **API Key Restrictions**
- ✅ **Restrict to specific APIs** (Directions API only)
- ✅ **Restrict to specific domains** (localhost + production domain)
- ✅ **Set usage quotas** untuk mencegah abuse

### 2. **Environment Variables**
- ✅ **Jangan hardcode** API key di source code
- ✅ **Gunakan .env file** untuk development
- ✅ **Gunakan environment variables** untuk production

### 3. **Monitoring**
- ✅ **Monitor usage** di Google Cloud Console
- ✅ **Set up alerts** untuk usage yang tinggi
- ✅ **Review billing** secara berkala

---

## 🚀 **Fallback Strategy**

Sistem akan mencoba API dalam urutan:

1. **Google Directions API** (paling akurat)
2. **OpenRouteService** (gratis, akurasi sedang)
3. **Mapbox** (gratis/bayar, akurasi baik)
4. **Realistic Route Generation** (fallback terakhir)

---

## 📊 **Perbandingan Akurasi**

| API Provider | Akurasi | Titik Koordinat | Biaya |
|--------------|---------|-----------------|-------|
| **Google Directions** | ⭐⭐⭐⭐⭐ | 1000+ | $5/1k requests |
| **OpenRouteService** | ⭐⭐⭐ | 500+ | Gratis |
| **Mapbox** | ⭐⭐⭐⭐ | 800+ | Gratis/Paid |
| **Fallback Algorithm** | ⭐⭐ | 100+ | Gratis |

---

## 🎯 **Hasil yang Diharapkan**

Setelah setup Google Directions API:

- ✅ **Rute mengikuti jalan-jalan yang sebenarnya**
- ✅ **Akurasi sama dengan Google Maps**
- ✅ **1000+ titik koordinat** untuk rute panjang
- ✅ **Visual yang realistis** di frontend

---

## 🆘 **Troubleshooting**

### Error: "API key not valid"
- ✅ **Check API key** di Google Cloud Console
- ✅ **Verify Directions API** sudah di-enable
- ✅ **Check API restrictions**

### Error: "Quota exceeded"
- ✅ **Check usage** di Google Cloud Console
- ✅ **Increase quota** jika diperlukan
- ✅ **Monitor daily usage**

### Error: "Billing not enabled"
- ✅ **Enable billing** di Google Cloud Console
- ✅ **Add payment method** (untuk paid tier)
- ✅ **Check free tier** masih tersedia

---

## 💡 **Tips**

- **Mulai dengan free tier** untuk testing
- **Monitor usage** untuk menghindari overage
- **Cache routes** untuk mengurangi API calls
- **Use fallback** untuk reliability

**Dengan Google Directions API, rute akan mengikuti jalan-jalan yang sebenarnya seperti Google Maps!** 🗺️✨
