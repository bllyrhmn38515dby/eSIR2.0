# Sprint 1: Fondasi & Autentikasi - Frontend

## Yang Sudah Selesai ✅

### 1. Dependencies & Setup
- ✅ react-router-dom untuk routing
- ✅ axios untuk HTTP requests
- ✅ Context API untuk state management

### 2. Authentication Context
- ✅ AuthContext dengan login, register, logout
- ✅ Token management dengan localStorage
- ✅ Auto-login dengan token validation
- ✅ Axios interceptor untuk Authorization header

### 3. Komponen Halaman
- ✅ Login page dengan form validation
- ✅ Register page dengan role selection
- ✅ Dashboard kosong dengan user info
- ✅ ProtectedRoute untuk keamanan

### 4. Styling & UI/UX
- ✅ Modern gradient design
- ✅ Responsive layout
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

## Struktur File

```
frontend/src/
├── components/
│   ├── Login.js              # Halaman login
│   ├── Login.css             # Styling login
│   ├── Register.js           # Halaman register
│   ├── Register.css          # Styling register
│   ├── Dashboard.js          # Dashboard kosong
│   ├── Dashboard.css         # Styling dashboard
│   └── ProtectedRoute.js     # Route protection
├── context/
│   └── AuthContext.js        # Authentication state
├── App.js                    # Main app dengan routing
├── App.css                   # Global styling
└── index.js                  # Entry point
```

## Cara Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## Fitur yang Tersedia

### 🔐 Authentication
- **Login**: Username/password dengan validasi
- **Register**: Form lengkap dengan role selection
- **Auto-login**: Menggunakan token dari localStorage
- **Logout**: Clear token dan redirect ke login

### 🛡️ Security
- **Protected Routes**: Dashboard hanya bisa diakses setelah login
- **Token Validation**: Auto-check token validity
- **Role-based Access**: Tampilan berbeda untuk admin_pusat vs admin_faskes

### 🎨 UI/UX
- **Modern Design**: Gradient background, card layout
- **Responsive**: Mobile-friendly
- **Loading States**: Feedback visual saat loading
- **Error Handling**: Pesan error yang informatif

## Testing

### 1. Register User Baru
1. Buka `http://localhost:3000/register`
2. Isi form dengan data lengkap
3. Pilih role (Admin Pusat atau Admin Faskes)
4. Submit form
5. Redirect ke login page

### 2. Login User
1. Buka `http://localhost:3000/login`
2. Masukkan username/password
3. Submit form
4. Redirect ke dashboard

### 3. Dashboard Access
1. Setelah login, user akan diarahkan ke dashboard
2. Dashboard menampilkan info user dan role
3. Tombol logout untuk keluar

### 4. Protected Route Test
1. Coba akses `http://localhost:3000/dashboard` tanpa login
2. Akan diarahkan ke login page
3. Setelah login, bisa akses dashboard

## API Integration

### Backend Connection
- Base URL: `http://localhost:3001`
- Endpoints:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `GET /api/auth/profile`

### Error Handling
- Network errors
- Validation errors
- Authentication errors
- Server errors

## Langkah Selanjutnya

Setelah Sprint 1 Frontend selesai, kita akan lanjut ke:
1. **Sprint 2**: Fitur Inti Rujukan (tanpa realtime)
2. **Sprint 3**: Implementasi Realtime dengan Socket.IO
3. **Sprint 4**: Peta Interaktif dengan Leaflet.js
4. **Sprint 5**: Fitur Pendukung & UI Polish

## Troubleshooting

### Common Issues

1. **CORS Error**
   - Pastikan backend berjalan di port 3001
   - Pastikan CORS sudah dikonfigurasi di backend

2. **Token Invalid**
   - Clear localStorage dan login ulang
   - Pastikan JWT_SECRET sama di backend

3. **Database Connection**
   - Pastikan MySQL berjalan
   - Pastikan database `esir_db` sudah dibuat
   - Pastikan tabel sudah diimport dari `database.sql`

### Development Tips

1. **Hot Reload**: React akan auto-reload saat ada perubahan
2. **Browser DevTools**: Gunakan untuk debug network requests
3. **Console Logs**: Check browser console untuk error messages
