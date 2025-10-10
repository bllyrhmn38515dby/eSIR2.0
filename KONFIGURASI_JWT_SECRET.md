# 🔐 KONFIGURASI JWT SECRET UNTUK PRODUCTION

## 📋 **JWT SECRET YANG SUDAH DIGENERATE**

JWT secret yang aman sudah digenerate untuk production eSIR 2.0:

```
JWT_SECRET=936aa312b4c69844640842bfa497989b2581cbba0449f4c8b6984ab8c51dd2ceff2e97a8b1cd2e804276096687863082d8d2d833931b5f9d1251c64813da69da
```

## ⚙️ **KARAKTERISTIK JWT SECRET**

- **Panjang**: 128 karakter (64 bytes)
- **Format**: Hexadecimal
- **Keamanan**: Cryptographically secure random
- **Penggunaan**: Untuk signing dan verifying JWT tokens

## 📁 **FILE YANG SUDAH DIPERBARUI**

JWT secret sudah ditambahkan ke file berikut:

1. **`backend/config.production.env`**
2. **`KONFIGURASI_DOMAIN_ESIRV02.md`**
3. **`PANDUAN_HOSTING_CPANEL_LENGKAP.md`**
4. **`LANGKAH_DEMI_LANGKAH_CPANEL.md`**

## 🔧 **CARA KERJA JWT SECRET**

### **1. Signing Token**
```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### **2. Verifying Token**
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### **3. Middleware Authentication**
```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
```

## 🛡️ **KEAMANAN JWT SECRET**

### **Best Practices:**
1. **Jangan expose** JWT secret di client-side
2. **Simpan** di environment variables
3. **Gunakan** secret yang panjang dan random
4. **Rotate** secret secara berkala
5. **Monitor** penggunaan token

### **Environment Variables:**
```env
# Production
JWT_SECRET=936aa312b4c69844640842bfa497989b2581cbba0449f4c8b6984ab8c51dd2ceff2e97a8b1cd2e804276096687863082d8d2d833931b5f9d1251c64813da69da
JWT_EXPIRES_IN=24h

# Development (jangan gunakan di production)
# JWT_SECRET=development_secret_key
```

## 🔄 **ROTASI JWT SECRET**

### **Kapan Melakukan Rotasi:**
- Setiap 6-12 bulan
- Jika terjadi security breach
- Saat update aplikasi besar
- Jika secret ter-expose

### **Cara Rotasi:**
1. **Generate secret baru**
2. **Update environment variables**
3. **Restart aplikasi**
4. **Invalidate semua token lama**

## 🧪 **TESTING JWT SECRET**

### **Test Token Generation:**
```javascript
// Test di backend
const jwt = require('jsonwebtoken');
const testToken = jwt.sign(
  { test: true },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
console.log('Test token:', testToken);
```

### **Test Token Verification:**
```javascript
// Test verification
try {
  const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
  console.log('Token valid:', decoded);
} catch (error) {
  console.error('Token invalid:', error.message);
}
```

## 📋 **CHECKLIST JWT SECRET**

- [ ] JWT secret digenerate dengan crypto.randomBytes
- [ ] Secret panjang minimal 64 bytes
- [ ] Secret disimpan di environment variables
- [ ] Secret tidak ter-expose di client-side
- [ ] Token expiration time diset (24h)
- [ ] Middleware authentication berfungsi
- [ ] Token verification berfungsi
- [ ] Error handling untuk invalid token

## 🚨 **PERINGATAN KEAMANAN**

### **JANGAN:**
- ❌ Hardcode JWT secret di source code
- ❌ Commit JWT secret ke version control
- ❌ Share JWT secret melalui email/chat
- ❌ Gunakan secret yang sama untuk development dan production
- ❌ Gunakan secret yang pendek atau mudah ditebak

### **LAKUKAN:**
- ✅ Simpan di environment variables
- ✅ Gunakan secret yang panjang dan random
- ✅ Rotate secret secara berkala
- ✅ Monitor penggunaan token
- ✅ Implement proper error handling

## 🔧 **TROUBLESHOOTING**

### **Error: "Invalid token"**
- Cek JWT secret di environment variables
- Pastikan secret sama antara signing dan verification
- Cek format token (Bearer token)

### **Error: "Token expired"**
- Cek JWT_EXPIRES_IN setting
- Implement token refresh mechanism
- Handle expired token dengan proper error message

### **Error: "jwt malformed"**
- Cek format token
- Pastikan token tidak terpotong
- Cek header Authorization

---

**JWT Secret siap untuk production!** 🔐✨
