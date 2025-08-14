# Status Realtime eSIR 2.0

## Penjelasan Status Realtime

Status realtime di eSIR 2.0 menunjukkan koneksi Socket.IO antara frontend dan backend untuk menerima notifikasi real-time.

### Status yang Tersedia:

#### 🟢 **Realtime Aktif**
- **Kondisi**: Socket.IO berhasil terhubung ke server
- **Fitur yang berfungsi**:
  - Notifikasi real-time untuk rujukan baru
  - Update status rujukan secara real-time
  - Tracking posisi ambulans real-time
  - Notifikasi browser (jika diizinkan)

#### 🔴 **Realtime Terputus**
- **Kondisi**: Socket.IO tidak dapat terhubung ke server
- **Fitur yang tidak berfungsi**:
  - Notifikasi real-time
  - Update otomatis data
  - Tracking real-time

## Faktor yang Mempengaruhi Status Realtime

### 1. **Koneksi Server Backend**
- **Masalah**: Server backend tidak berjalan
- **Solusi**: Pastikan server backend berjalan di port 3001
- **Command**: `cd backend && npm start`

### 2. **Koneksi Internet/Network**
- **Masalah**: Koneksi internet terputus atau lambat
- **Solusi**: Periksa koneksi internet
- **Dampak**: Socket.IO akan mencoba reconnect otomatis

### 3. **Firewall/Security**
- **Masalah**: Firewall memblokir koneksi WebSocket
- **Solusi**: Pastikan port 3001 tidak diblokir
- **Dampak**: Koneksi akan gagal

### 4. **Token Autentikasi**
- **Masalah**: Token JWT tidak valid atau expired
- **Solusi**: Login ulang untuk mendapatkan token baru
- **Dampak**: Socket.IO akan menolak koneksi

### 5. **Browser Support**
- **Masalah**: Browser tidak mendukung WebSocket
- **Solusi**: Gunakan browser modern (Chrome, Firefox, Safari, Edge)
- **Dampak**: Socket.IO akan fallback ke polling

## Mekanisme Reconnection

Socket.IO di eSIR 2.0 memiliki mekanisme reconnection otomatis:

### Konfigurasi Reconnection:
```javascript
{
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
}
```

### Proses Reconnection:
1. **Deteksi Disconnect**: Socket.IO mendeteksi koneksi terputus
2. **Delay Awal**: Menunggu 1 detik sebelum mencoba reconnect
3. **Attempt Pertama**: Mencoba reconnect
4. **Delay Bertahap**: Jika gagal, delay akan bertambah (max 5 detik)
5. **Maksimal 5 Attempt**: Jika masih gagal, berhenti mencoba

## Troubleshooting

### Jika Status Selalu "Realtime Terputus":

1. **Periksa Server Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Periksa Console Browser**:
   - Buka Developer Tools (F12)
   - Lihat tab Console untuk error Socket.IO

3. **Periksa Network Tab**:
   - Lihat apakah ada request ke `ws://localhost:3001`
   - Periksa status response

4. **Restart Aplikasi**:
   - Refresh halaman browser
   - Login ulang jika diperlukan

### Log yang Berguna:

#### Backend Logs:
```
✅ User connected: [socket-id]
👑 Admin joined room: [socket-id]
🏥 Faskes [id] joined room: [socket-id]
❌ User disconnected: [socket-id]
```

#### Frontend Logs:
```
✅ Socket connected: [socket-id]
👑 Joined admin room
🏥 Joined faskes room: [id]
❌ Socket disconnected: [reason]
🔄 Socket reconnected after [n] attempts
```

## Room System

Socket.IO menggunakan sistem room untuk mengirim notifikasi yang tepat:

### Room yang Tersedia:
- **`admin`**: Untuk user dengan role admin
- **`faskes-{id}`**: Untuk user faskes tertentu
- **`tracking-{rujukanId}`**: Untuk tracking rujukan tertentu

### Contoh Penggunaan:
```javascript
// Admin menerima semua notifikasi
socket.emit('join-admin');

// Faskes menerima notifikasi untuk faskesnya
socket.emit('join-faskes', faskesId);

// Tracking rujukan tertentu
socket.emit('join-tracking', rujukanId);
```

## Notifikasi yang Dikirim

### 1. **Rujukan Baru**
- **Event**: `rujukan-baru`
- **Target**: Faskes tujuan + Admin
- **Data**: Informasi rujukan lengkap

### 2. **Update Status**
- **Event**: `status-update`
- **Target**: Faskes asal + Admin
- **Data**: Status baru rujukan

### 3. **Tracking Update**
- **Event**: `tracking-update`
- **Target**: Room tracking tertentu
- **Data**: Posisi GPS ambulans

## Best Practices

### Untuk Developer:
1. **Selalu periksa status realtime** sebelum mengirim data
2. **Gunakan fallback** jika realtime tidak tersedia
3. **Log error** untuk debugging
4. **Test koneksi** di berbagai kondisi network

### Untuk User:
1. **Pastikan koneksi internet stabil**
2. **Refresh halaman** jika status stuck di "Terputus"
3. **Login ulang** jika ada masalah autentikasi
4. **Periksa browser** support WebSocket
