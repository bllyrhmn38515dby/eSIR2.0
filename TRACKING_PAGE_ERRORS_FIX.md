# Fix TrackingPage Console Errors

## 🐛 **Errors yang Dilaporkan**

**User**: "Ada error di console: Socket not available, Google Maps API Key undefined, Multiple Google Maps loading"

### **Error Details:**
```
Socket not available for tracking updates
Google Maps JavaScript API has been loaded directly without loading=async
You have included the Google Maps JavaScript API multiple times on this page
Google Maps JavaScript API error: InvalidKeyMapError
```

## 🔍 **Analisis Masalah**

### **Penyebab:**
1. **Socket not available** - Socket belum terhubung saat komponen mount
2. **Google Maps API Key undefined** - Environment variable tidak terdefinisi
3. **Multiple Google Maps loading** - Script Google Maps dimuat berulang kali
4. **Invalid API Key** - API key tidak valid atau tidak ada

## 🛠 **Perbaikan yang Diterapkan**

### **1. Enhanced Google Maps Loading**
```javascript
// ❌ SEBELUM - Basic loading tanpa error handling
if (!window.google) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
  script.async = true;
  script.defer = true;
  script.onload = initMap;
  document.head.appendChild(script);
} else {
  initMap();
}

// ✅ SESUDAH - Enhanced loading dengan error handling
// Check if Google Maps is already loaded
if (window.google && window.google.maps) {
  console.log('🗺️ Google Maps already loaded');
  initMap();
} else {
  // Check if script is already being loaded
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    console.log('🗺️ Google Maps script already loading, waiting...');
    existingScript.onload = initMap;
  } else {
    // Load Google Maps script
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      console.warn('⚠️ Google Maps API key not configured. Please set REACT_APP_GOOGLE_MAPS_API_KEY in .env file');
      return;
    }
    
    console.log('🗺️ Loading Google Maps script...');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    script.onerror = () => {
      console.error('❌ Failed to load Google Maps script');
    };
    document.head.appendChild(script);
  }
}
```

### **2. Enhanced Socket Connection Handling**
```javascript
// ❌ SEBELUM - Basic socket check
useEffect(() => {
  if (socket && socket.on) {
    socket.on('tracking-update', handleTrackingUpdate);
  } else {
    console.log('⚠️ Socket not available for tracking updates');
  }
}, [socket, selectedSession, updateMapWithNewPosition]);

// ✅ SESUDAH - Enhanced socket handling dengan connection check
useEffect(() => {
  const setupSocketListeners = () => {
    if (socket && socket.on && socket.connected) {
      console.log('🔌 Setting up socket listeners for tracking updates');
      
      const handleTrackingUpdate = (data) => {
        console.log('📡 Tracking update received:', data);
        if (selectedSession && data.rujukan_id === selectedSession.rujukan_id) {
          setTrackingData(prev => ({ ...prev, ...data }));
          updateMapWithNewPosition(data);
        }
      };

      socket.on('tracking-update', handleTrackingUpdate);

      return () => {
        if (socket && socket.off) {
          console.log('🔌 Cleaning up socket listeners');
          socket.off('tracking-update', handleTrackingUpdate);
        }
      };
    } else {
      console.log('⚠️ Socket not available for tracking updates');
      return () => {};
    }
  };

  // Setup listeners immediately if socket is ready
  const cleanup = setupSocketListeners();

  // If socket is not ready, wait for it to connect
  if (socket && !socket.connected) {
    console.log('⏳ Waiting for socket connection...');
    const timeoutId = setTimeout(() => {
      if (socket.connected) {
        console.log('✅ Socket connected, setting up listeners');
        setupSocketListeners();
      } else {
        console.log('❌ Socket connection timeout');
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }

  return cleanup;
}, [socket, selectedSession, updateMapWithNewPosition]);
```

### **3. Environment Setup Script**
```batch
@echo off
echo Setting up environment variables for eSIR2.0...

cd frontend

echo Creating .env file...
if not exist .env (
    copy env.example .env
    echo .env file created from env.example
) else (
    echo .env file already exists
)

echo.
echo Please edit frontend/.env file and set your Google Maps API key:
echo 1. Go to https://console.cloud.google.com/
echo 2. Create a new project or select existing one
echo 3. Enable Maps JavaScript API and Directions API
echo 4. Create credentials (API Key)
echo 5. Replace "your_google_maps_api_key_here" in .env file with your actual API key
echo.
echo Example .env content:
echo REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg
echo REACT_APP_API_URL=http://localhost:3001/api
echo REACT_APP_SOCKET_URL=http://localhost:3001
echo.

pause
```

## 🧪 **Testing Steps**

### **1. Setup Environment Variables**
```bash
# Run setup script
setup-env.bat

# Or manually create .env file
cd frontend
copy env.example .env
```

### **2. Configure Google Maps API Key**
1. **Go to** https://console.cloud.google.com/
2. **Create/Select project**
3. **Enable APIs:**
   - Maps JavaScript API
   - Directions API
4. **Create credentials** (API Key)
5. **Edit** `frontend/.env` file
6. **Replace** `your_google_maps_api_key_here` with actual API key

### **3. Test Application**
1. **Restart development server**
2. **Open browser** Developer Tools (F12)
3. **Navigate to** Tracking page
4. **Check console** for:
   - `🗺️ Google Maps initialized successfully`
   - `🔌 Setting up socket listeners for tracking updates`
   - `✅ Socket connected: [socket-id]`

## 📋 **Checklist Verification**

### **Environment Setup:**
- [ ] **`.env` file exists** di frontend directory
- [ ] **Google Maps API key** terkonfigurasi dengan benar
- [ ] **API key valid** dan tidak undefined
- [ ] **Required APIs enabled** di Google Cloud Console

### **Application Functionality:**
- [ ] **No Google Maps loading errors** di console
- [ ] **Socket connection** berfungsi dengan baik
- [ ] **Real-time updates** berfungsi
- [ ] **Map rendering** berhasil
- [ ] **No multiple script loading** warnings

### **Error Handling:**
- [ ] **Proper error messages** untuk missing API key
- [ ] **Socket connection timeout** handling
- [ ] **Google Maps loading** error handling
- [ ] **Console logs** untuk debugging

## 🚨 **Troubleshooting Guide**

### **Jika Google Maps Error Masih Muncul:**

#### **1. Check API Key**
```javascript
// Di browser console, cek:
console.log('API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
```

#### **2. Verify Google Cloud Console**
- [ ] **Project selected** dengan benar
- [ ] **Maps JavaScript API** enabled
- [ ] **Directions API** enabled
- [ ] **API key** tidak restricted atau expired

#### **3. Check .env File**
```bash
# Verifikasi file exists dan content
cat frontend/.env
```

### **Jika Socket Error Masih Muncul:**

#### **1. Check Socket Connection**
```javascript
// Di browser console, cek:
console.log('Socket:', socket);
console.log('Socket connected:', socket?.connected);
```

#### **2. Verify Backend**
```bash
# Test backend socket endpoint
curl -X GET http://localhost:3001/socket.io/
```

#### **3. Check Authentication**
```javascript
// Verifikasi token
console.log('Token:', localStorage.getItem('token'));
```

## 📊 **Status Perbaikan**

- ✅ **Enhanced Google Maps loading** dengan error handling
- ✅ **Fixed multiple script loading** issue
- ✅ **Enhanced socket connection** handling
- ✅ **Added environment setup** script
- ✅ **Improved error messages** dan debugging
- ✅ **Added API key validation**
- 🔄 **Testing** perlu dilakukan
- ⏳ **User feedback** menunggu konfirmasi

## 🚀 **Expected Results**

### **Setelah Perbaikan:**
- ✅ **No Google Maps loading errors**
- ✅ **Proper socket connection** handling
- ✅ **Clear error messages** untuk missing API key
- ✅ **No multiple script loading** warnings
- ✅ **Enhanced debugging** dengan console logs
- ✅ **Smooth user experience** tanpa console errors

## 🔍 **Benefits**

### **Untuk User:**
- **No more console errors** saat mengakses tracking page
- **Smooth map loading** tanpa multiple script warnings
- **Better error messages** untuk troubleshooting
- **Reliable real-time updates** dengan proper socket handling

### **Untuk Developer:**
- **Clear error handling** untuk Google Maps loading
- **Enhanced socket connection** management
- **Better debugging** dengan detailed console logs
- **Environment setup** automation
- **Maintainable code** dengan proper error handling

## 📝 **Code Changes Summary**

### **Files Modified:**
1. **`frontend/src/components/TrackingPage.js`**
   - Enhanced Google Maps loading dengan error handling
   - Fixed multiple script loading issue
   - Enhanced socket connection handling
   - Added API key validation

### **Files Created:**
1. **`setup-env.bat`**
   - Environment setup automation
   - Google Maps API key configuration guide

### **Environment Setup:**
1. **`frontend/.env`** (needs to be created manually)
   - Google Maps API key configuration
   - Backend API URL configuration
   - Socket.IO URL configuration

## 🎯 **Next Steps**

1. **Run setup script** - `setup-env.bat`
2. **Configure API key** - Set Google Maps API key di `.env`
3. **Test application** - Restart server dan test tracking page
4. **Verify console** - Check for error-free console logs
5. **Test functionality** - Verify map loading dan socket connection
6. **Confirm user satisfaction** - Verify semua error sudah teratasi
