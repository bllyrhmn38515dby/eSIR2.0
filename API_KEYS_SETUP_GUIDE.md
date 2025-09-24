# 🗝️ API Keys Setup Guide untuk Routing Presisi

## 📋 Daftar API Keys yang Dibutuhkan

Sistem routing presisi eSIR2.0 mendukung multiple API providers dengan fallback otomatis:

1. **OpenRouteService** (Recommended - Gratis)
2. **Google Directions API** (Akurasi Tinggi - Berbayar)
3. **Mapbox Directions API** (Gratis/Berbayar)

---

## 🆓 1. OpenRouteService API (Gratis)

### Langkah-langkah:
1. **Kunjungi:** https://openrouteservice.org/
2. **Klik "Sign Up"** di pojok kanan atas
3. **Isi form registrasi:**
   - Email: your_email@example.com
   - Password: your_password
   - Confirm Password: your_password
4. **Klik "Sign Up"**
5. **Verifikasi email** Anda
6. **Login** ke dashboard
7. **Klik "Generate API Key"**
8. **Copy API Key** yang diberikan

### Konfigurasi:
```bash
# Tambahkan ke file .env di backend/
OPENROUTE_API_KEY=your_openroute_api_key_here
```

### Limit Gratis:
- ✅ **2,000 requests/hari**
- ✅ **Tidak perlu kartu kredit**
- ✅ **Akurasi tinggi untuk Indonesia**

---

## 💰 2. Google Directions API (Berbayar)

### Langkah-langkah:
1. **Kunjungi:** https://console.cloud.google.com/
2. **Login** dengan akun Google
3. **Buat project baru:**
   - Klik "Select a project" > "New Project"
   - Project name: "eSIR2-Routing"
   - Klik "Create"
4. **Enable Google Directions API:**
   - Go to "APIs & Services" > "Library"
   - Search "Directions API"
   - Klik "Enable"
5. **Create API Key:**
   - Go to "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "API Key"
   - Copy the API Key
6. **Set Billing (Opsional):**
   - Go to "Billing" untuk set up payment method
   - Atau gunakan free tier ($200 credit)

### Konfigurasi:
```bash
# Tambahkan ke file .env di backend/
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Pricing:
- 💰 **$5 per 1,000 requests** (setelah free tier)
- ✅ **Akurasi sangat tinggi**
- ✅ **Traffic information**
- ✅ **Multiple routing options**

---

## 🗺️ 3. Mapbox Directions API (Gratis/Berbayar)

### Langkah-langkah:
1. **Kunjungi:** https://www.mapbox.com/
2. **Klik "Sign Up"**
3. **Isi form registrasi:**
   - Email: your_email@example.com
   - Password: your_password
4. **Verifikasi email**
5. **Login** ke dashboard
6. **Go to Account** > "Access Tokens"
7. **Copy Default Public Token**

### Konfigurasi:
```bash
# Tambahkan ke file .env di backend/
MAPBOX_API_KEY=your_mapbox_api_key_here
```

### Limit Gratis:
- ✅ **100,000 requests/bulan**
- ✅ **Akurasi tinggi**
- ✅ **Custom styling**

---

## ⚙️ Setup di Backend

### 1. Copy Environment File:
```bash
cd backend
cp env.example .env
```

### 2. Edit .env File:
```bash
# Buka file .env dan tambahkan API keys
OPENROUTE_API_KEY=5b3ce3597851110001cf6248c8b8b8b8
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
MAPBOX_API_KEY=your_mapbox_api_key_here
```

### 3. Restart Backend:
```bash
# Stop backend jika sedang berjalan
# Kemudian start lagi
cd backend
node app.js
```

---

## 🧪 Testing API Keys

### Test OpenRouteService:
```bash
curl -X POST http://localhost:3001/api/routing/precise-route \
  -H "Content-Type: application/json" \
  -d '{"startLat": -6.5971, "startLng": 106.8060, "endLat": -6.4000, "endLng": 106.9000}'
```

### Expected Response:
```json
{
  "success": true,
  "data": {
    "coordinates": [[-6.5971, 106.8060], ...],
    "pointCount": 150,
    "distance": 24259.038989
  }
}
```

---

## 🔒 Security Best Practices

### 1. Environment Variables:
- ✅ **Jangan hardcode API keys** di source code
- ✅ **Gunakan .env file** untuk development
- ✅ **Gunakan environment variables** untuk production

### 2. API Key Restrictions:
- ✅ **Restrict API keys** ke domain/IP tertentu
- ✅ **Set usage quotas** untuk mencegah abuse
- ✅ **Monitor usage** secara berkala

### 3. Production Setup:
```bash
# Set environment variables di production server
export OPENROUTE_API_KEY=your_production_api_key
export GOOGLE_MAPS_API_KEY=your_production_api_key
export MAPBOX_API_KEY=your_production_api_key
```

---

## 🚀 Fallback Strategy

Sistem akan mencoba API dalam urutan berikut:

1. **OpenRouteService** (jika API key tersedia)
2. **Google Directions** (jika API key tersedia)
3. **Mapbox** (jika API key tersedia)
4. **Realistic Route Generation** (fallback terakhir)

### Log Output:
```
🗺️ Getting precise route from: [-6.5971, 106.8060] to: [-6.4000, 106.9000]
✅ Got route from OpenRouteService: 150 points
```

---

## 📞 Support

Jika mengalami masalah:

1. **Check API key validity**
2. **Verify billing setup** (untuk Google Maps)
3. **Check API quotas/limits**
4. **Review error logs** di backend console

---

## 💡 Tips

- **Mulai dengan OpenRouteService** (gratis dan mudah)
- **Upgrade ke Google Maps** jika butuh akurasi maksimal
- **Monitor usage** untuk menghindari overage charges
- **Cache routes** untuk mengurangi API calls
