# 🚗 DriverDashboard Troubleshooting Guide - eSIR 2.0

## 📋 **Common Issues & Solutions**

### 1. **Geolocation Error Code 3 (TIMEOUT)**

**Error Message:**
```
Geolocation error: GeolocationPositionError { code: 3, message: "Timeout" }
```

**Causes:**
- GPS signal weak atau tidak tersedia
- Browser timeout dalam mendapatkan lokasi
- Permission geolocation ditolak

**Solutions:**
- ✅ **Timeout diperpanjang** dari 10 detik ke 15 detik
- ✅ **Cache time diperpanjang** dari 5 detik ke 10 detik
- ✅ **Error handling yang lebih baik** dengan pesan yang jelas
- ✅ **Permission check** sebelum memulai tracking

**Code Changes:**
```javascript
// Timeout dan cache time diperpanjang
{
  enableHighAccuracy: true,
  timeout: 15000, // Increase timeout
  maximumAge: 10000 // Increase cache time
}

// Error handling yang lebih baik
switch(error.code) {
  case error.PERMISSION_DENIED:
    errorMessage += 'Akses lokasi ditolak. Silakan izinkan akses lokasi.';
    break;
  case error.POSITION_UNAVAILABLE:
    errorMessage += 'Lokasi tidak tersedia.';
    break;
  case error.TIMEOUT:
    errorMessage += 'Timeout mendapatkan lokasi.';
    break;
}
```

### 2. **404 Error pada Resource Loading**

**Error Message:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**Causes:**
- Service worker cache issue
- Missing favicon atau resource
- Backend endpoint tidak tersedia

**Solutions:**
- ✅ **Enhanced error handling** untuk fetch requests
- ✅ **Better logging** untuk debugging
- ✅ **HTTP status check** sebelum parsing response

**Code Changes:**
```javascript
// Enhanced error handling
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

// Better error logging
if (error.message.includes('404')) {
  console.error('❌ Endpoint not found. Check if backend is running on port 3001');
}
```

### 3. **Service Worker Loading**

**Message:**
```
🚀 eSIR 2.0 Service Worker loaded!
```

**Status:** ✅ **Normal** - Ini adalah pesan sukses, bukan error.

### 4. **Position Update Success**

**Message:**
```
✅ Position updated successfully
```

**Status:** ✅ **Normal** - GPS tracking berfungsi dengan baik.

## 🔧 **Troubleshooting Steps**

### **Step 1: Check Browser Permissions**
1. Buka Developer Tools (F12)
2. Go to Console tab
3. Look for permission messages:
   ```
   📍 Geolocation permission: granted/denied/prompt
   ```

### **Step 2: Check Backend Status**
1. Verify backend is running on port 3001:
   ```bash
   netstat -an | findstr :3001
   ```

2. Test endpoint manually:
   ```bash
   curl -X POST http://localhost:3001/api/tracking/update-position
   ```

### **Step 3: Check Network Requests**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Look for failed requests (red status)
4. Check request/response details

### **Step 4: Clear Browser Cache**
1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache
3. Disable service worker temporarily

## 🚀 **Best Practices**

### **For Users:**
1. **Allow Location Permission** when prompted
2. **Use HTTPS** for better geolocation accuracy
3. **Enable High Accuracy** in browser settings
4. **Check Internet Connection** for API calls

### **For Developers:**
1. **Monitor Console Logs** for detailed error info
2. **Test on Different Browsers** (Chrome, Firefox, Safari)
3. **Test on Different Devices** (Desktop, Mobile)
4. **Check Network Conditions** (WiFi, Mobile Data)

## 📊 **Error Codes Reference**

| Code | Name | Description | Solution |
|------|------|-------------|----------|
| 1 | PERMISSION_DENIED | User denied location access | Allow permission in browser |
| 2 | POSITION_UNAVAILABLE | Location unavailable | Check GPS/network |
| 3 | TIMEOUT | Request timeout | Increase timeout, check signal |

## 🔍 **Debug Information**

### **Console Logs to Monitor:**
```
📍 Geolocation permission: granted
📍 GPS Position received: {latitude, longitude, accuracy}
🔄 Updating position: {session_token, latitude, longitude}
✅ Position updated successfully
```

### **Error Logs to Watch:**
```
❌ Geolocation error: [error details]
❌ Error updating position: [error details]
❌ Endpoint not found. Check if backend is running on port 3001
```

## 🛠️ **Advanced Troubleshooting**

### **If GPS Still Not Working:**
1. **Check Browser Compatibility:**
   ```javascript
   if (!navigator.geolocation) {
     console.error('Geolocation not supported');
   }
   ```

2. **Test with Different Coordinates:**
   ```javascript
   // Use known coordinates for testing
   const testCoords = { latitude: -6.5971, longitude: 106.8060 };
   ```

3. **Check HTTPS Requirement:**
   - Geolocation requires HTTPS in production
   - Use `http://localhost` for development

### **If Backend Connection Fails:**
1. **Check CORS Settings:**
   ```javascript
   // Backend should allow frontend origin
   app.use(cors({
     origin: 'http://localhost:3000'
   }));
   ```

2. **Verify API Endpoints:**
   ```bash
   # Test tracking endpoint
   curl -X POST http://localhost:3001/api/tracking/update-position \
     -H "Content-Type: application/json" \
     -d '{"session_token":"test","latitude":-6.5971,"longitude":106.8060}'
   ```

## ✅ **Success Indicators**

When everything is working correctly, you should see:
```
🚀 eSIR 2.0 Service Worker loaded!
📍 Geolocation permission: granted
📍 GPS Position received: {latitude: -6.5971, longitude: 106.8060, accuracy: 10}
🔄 Updating position: {session_token: "abc123", latitude: -6.5971, longitude: 106.8060}
✅ Position updated successfully
```

---

**DriverDashboard sekarang memiliki error handling yang lebih robust dan debugging yang lebih baik!** 🚗✨
