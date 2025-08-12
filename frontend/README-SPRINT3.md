# Sprint 3: Implementasi Realtime - Socket.IO

## Yang Sudah Selesai ✅

### 1. Backend Socket.IO Integration
- ✅ Socket.IO server setup dengan CORS
- ✅ Room-based connections (faskes rooms, admin room)
- ✅ Realtime notifications untuk rujukan baru
- ✅ Realtime notifications untuk update status
- ✅ Global io instance untuk broadcasting

### 2. Frontend Socket.IO Client
- ✅ Socket.IO client integration
- ✅ SocketContext untuk state management
- ✅ Automatic room joining berdasarkan user role
- ✅ Connection status monitoring
- ✅ Browser notifications support

### 3. Notification System
- ✅ NotificationBell component dengan dropdown
- ✅ Real-time notification display
- ✅ Unread count badge dengan animation
- ✅ Mark as read functionality
- ✅ Notification history (last 10 notifications)

### 4. Dashboard Realtime Updates
- ✅ Connection status indicator
- ✅ Realtime status display
- ✅ Visual feedback untuk realtime mode

## Struktur Komponen Baru

```
backend/
├── index.js                    # Socket.IO server setup
└── routes/
    └── rujukan.js             # Realtime notifications

frontend/src/
├── context/
│   └── SocketContext.js       # Socket.IO context
├── components/
│   ├── NotificationBell.js    # Notification component
│   ├── NotificationBell.css   # Notification styling
│   └── [komponen yang diupdate...]
└── [file lainnya...]
```

## Fitur yang Tersedia

### 🔌 Socket.IO Server
- **Room Management**: 
  - Faskes-specific rooms (`faskes-{id}`)
  - Admin room untuk admin pusat
  - Automatic room joining berdasarkan user role

- **Event Broadcasting**:
  - `rujukan-baru`: Saat rujukan baru dibuat
  - `status-update`: Saat status rujukan diupdate
  - Targeted broadcasting ke faskes terkait

### 🔔 Notification System
- **Real-time Notifications**:
  - Instant notification saat rujukan baru
  - Status update notifications
  - Browser notifications (jika diizinkan)

- **Notification Management**:
  - Unread count dengan badge
  - Mark as read functionality
  - Clear all notifications
  - Notification history (10 terakhir)

- **Visual Features**:
  - Animated notification badge
  - Connection status indicator
  - Dropdown dengan smooth animations
  - Responsive design

### 📊 Dashboard Realtime
- **Connection Status**:
  - Real-time connection indicator
  - Visual feedback (🟢/🔴)
  - Connection status text

- **Realtime Features**:
  - Live connection monitoring
  - Realtime mode indicator
  - Automatic status updates

## Cara Menjalankan

### 1. Backend (dengan Socket.IO)
```bash
cd backend
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm start
```

### 3. Test Realtime Features
1. Buka 2 browser window/tab
2. Login dengan user berbeda (Admin Pusat + Admin Faskes)
3. Buat rujukan di salah satu window
4. Lihat notifikasi realtime di window lain

## Testing Realtime Features

### 1. Connection Testing
1. Login ke aplikasi
2. Lihat connection status di dashboard (🟢 = connected)
3. Check browser console untuk socket connection logs
4. Test disconnect/reconnect

### 2. Notification Testing
1. **Rujukan Baru**:
   - Login sebagai Admin Faskes A
   - Login sebagai Admin Faskes B (di window lain)
   - Buat rujukan dari Faskes A ke Faskes B
   - Lihat notifikasi realtime di Faskes B

2. **Status Update**:
   - Login sebagai Admin Faskes A dan B
   - Buat rujukan dari A ke B
   - Update status di Faskes B
   - Lihat notifikasi di Faskes A

3. **Admin Notifications**:
   - Login sebagai Admin Pusat
   - Buat/update rujukan dari faskes manapun
   - Lihat notifikasi di Admin Pusat

### 3. Browser Notifications
1. Allow browser notifications saat diminta
2. Buat rujukan atau update status
3. Lihat browser notification popup

## Socket.IO Events

### Backend Events (Server → Client)
- `rujukan-baru`: Notifikasi rujukan baru
- `status-update`: Notifikasi update status

### Frontend Events (Client → Server)
- `join-faskes`: Join faskes room
- `join-admin`: Join admin room

### Event Data Structure
```javascript
// rujukan-baru event
{
  type: 'rujukan-baru',
  data: { /* rujukan data */ },
  message: 'Rujukan baru dari Faskes A',
  timestamp: Date
}

// status-update event
{
  type: 'status-update',
  data: { /* updated rujukan data */ },
  message: 'Status rujukan RJ20241201001 diubah menjadi diterima',
  timestamp: Date
}
```

## Room Management

### Room Types
- **Faskes Rooms**: `faskes-{faskes_id}`
  - Admin Faskes otomatis join room faskes mereka
  - Menerima notifikasi rujukan masuk/keluar

- **Admin Room**: `admin-room`
  - Admin Pusat otomatis join admin room
  - Menerima semua notifikasi sistem

### Room Logic
```javascript
// Admin Pusat
if (user.nama_role === 'admin_pusat') {
  socket.emit('join-admin');
}

// Admin Faskes
if (user.nama_role === 'admin_faskes' && user.faskes_id) {
  socket.emit('join-faskes', user.faskes_id);
}
```

## Error Handling

### Connection Errors
- Automatic reconnection
- Connection status monitoring
- Visual feedback untuk connection state

### Notification Errors
- Fallback untuk browser notifications
- Graceful handling untuk permission denied
- Error logging untuk debugging

## Performance Considerations

### Backend
- Room-based broadcasting (tidak broadcast ke semua client)
- Efficient event handling
- Connection cleanup pada disconnect

### Frontend
- Notification limit (10 terakhir)
- Efficient re-rendering
- Memory cleanup pada component unmount

## Browser Compatibility

### Supported Features
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ WebSocket support
- ✅ Notification API (dengan permission)

### Fallbacks
- Connection status indicator
- In-app notifications (selalu tersedia)
- Graceful degradation untuk browser lama

## Langkah Selanjutnya

Setelah Sprint 3 selesai, kita akan lanjut ke:
1. **Sprint 4**: Peta Interaktif dengan Leaflet.js
   - Tampilkan faskes di peta
   - Garis rujukan antar faskes
   - Realtime map updates
2. **Sprint 5**: Fitur Pendukung & UI Polish
   - Manajemen tempat tidur
   - Laporan dan statistik detail
   - Export data

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**
   - Pastikan backend berjalan di port 3001
   - Check CORS configuration
   - Verify network connectivity

2. **Notifications Not Working**
   - Check browser notification permissions
   - Verify user role dan faskes_id
   - Check browser console untuk errors

3. **Room Joining Issues**
   - Verify user authentication
   - Check user role dan faskes_id
   - Restart backend server

### Debug Mode

1. **Backend Debug**:
   ```bash
   # Check socket connections
   console.log('Connected users:', io.sockets.sockets.size);
   ```

2. **Frontend Debug**:
   ```javascript
   // Check socket connection
   console.log('Socket connected:', socket.connected);
   
   // Check room membership
   console.log('Socket rooms:', socket.rooms);
   ```

### Development Tips

1. **Testing Multiple Users**:
   - Gunakan incognito windows
   - Atau browser berbeda
   - Atau multiple tabs

2. **Real-time Testing**:
   - Buat rujukan di satu window
   - Lihat notifikasi di window lain
   - Test berbagai skenario role

3. **Performance Monitoring**:
   - Monitor memory usage
   - Check network tab untuk WebSocket traffic
   - Monitor console untuk errors
