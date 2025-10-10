# Spesifikasi Endpoint & Log Uji Internal

## Endpoint Autentikasi
```http
POST /api/auth/login
Authorization: -
Content-Type: application/json

{
  "emailOrUsername": "admin",
  "password": "******"
}
```

Respon contoh:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "<JWT>",
    "user": {
      "id": 1,
      "nama_lengkap": "Administrator",
      "email": "admin@esir.local",
      "role": "admin_pusat",
      "last_login": "2025-10-07T03:22:41.112Z"
    }
  }
}
```

## Endpoint Tracking
```http
POST /api/tracking/start-session
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "rujukan_id": 123,
  "device_id": "android-abc-123"
}
```

```http
POST /api/tracking/update-position
Authorization: -
Content-Type: application/json

{
  "session_token": "<hex-64>",
  "latitude": -6.5975,
  "longitude": 106.8061,
  "speed": 35,
  "heading": 120,
  "accuracy": 12,
  "battery_level": 0.82
}
```

```http
GET /api/tracking/:rujukan_id
Authorization: Bearer <JWT>
```

```http
GET /api/tracking/sessions/active
Authorization: Bearer <JWT>
```

```http
POST /api/tracking/end-session/:session_id
Authorization: Bearer <JWT>
```

## Cuplikan Kode Terkait Endpoint
```71:81:backend/index.js
app.use('/api/search', searchRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/dokumen', dokumenRoutes);
```

```111:144:backend/routes/tracking.js
router.post('/update-position', async (req, res) => {
  // validasi field, cek token sesi, hitung distance & ETA,
  // update tabel tracking_data, throttle & emit via Socket.IO
});
```

## Log Uji Coba (Ringkasan)
Autentikasi:
```text
POST /api/auth/login 200 162ms - payload: { emailOrUsername: "admin", password: "***" }
JWT issued for userId=1 role=admin_pusat
```

Tracking (update posisi):
```text
🔄 Update position request: { session_token: "<hex>", lat:-6.5975, lng:106.8061, speed:35 }
📍 Validating coordinates: OK
📍 Tracking update for rujukan 123: { distance: 4.28, time: 9, speed: 35 }
📍 Tracking update emitted for rujukan 123 (throttled)
```

Sinkronisasi DB:
```text
MySQL affectedRows: 1 (tracking_data UPDATE)
SELECT latest tracking_data for rujukan=123 -> 1 row
```

Responsivitas UI (metrik build lokal):
```text
FCP=1.4s, LCP=2.3s, CLS=0.02, TTFB=240ms
Total load < 3s (dashboard, rujukan, tracking)
```

Interval GPS (sampel 50 event):
```text
5–6s: 14 event | 7–8s: 26 event | 9–10s: 10 event
Median: 7.2s | Jitter p95: 1.4s
```

## Catatan
- Realtime Socket.IO: event `tracking-update` di room `tracking-{rujukan_id}`.
- Validasi koordinat: Jawa Barat (lat -7.5..-5.5, lng 106.0..108.5).
- Throttling emisi: minimal 5 detik antar broadcast.
