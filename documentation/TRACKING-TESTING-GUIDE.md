# 🛰️ eSIR2.0 Tracking System Testing Guide

## 📋 Overview

Panduan lengkap untuk testing dan debugging sistem tracking eSIR2.0.

## 🚀 Quick Start

### 1. Run All Tests
```bash
cd testing-scripts
./run-tracking-tests.bat
```

### 2. Manual Testing
```bash
# Debug & Fix
node debug-tracking-system.js

# Comprehensive Tests
node test-tracking-system.js

# Real-time Monitoring
node monitor-tracking.js
```

## 🧪 Test Scripts

### test-tracking-system.js
- Database connection test
- Authentication test
- Start/end tracking sessions
- Position updates
- Route simulation
- Socket.IO connection

### debug-tracking-system.js
- Database schema validation
- Data integrity checks
- API endpoint testing
- Automatic fixes

### monitor-tracking.js
- Real-time tracking updates
- Socket.IO monitoring
- Active sessions display
- Simulation mode

## 🔧 Common Issues

### Database Connection
```bash
# Check MySQL service
sudo systemctl status mysql

# Test connection
mysql -u root -p esirv2
```

### Socket.IO Issues
- Check CORS configuration
- Verify authentication token
- Check server status

### Invalid Coordinates
- Ensure coordinates are within Jawa Barat area
- Check latitude: -7.5 to -5.5
- Check longitude: 106.0 to 108.5

## 📊 Monitoring

### Real-time Dashboard
- Access: `http://localhost:3001/api/tracking/sessions/active`
- Socket.IO events: `tracking-update`
- Admin room: `join-admin`

### Database Queries
```sql
-- Active sessions
SELECT * FROM tracking_sessions WHERE is_active = TRUE;

-- Tracking data
SELECT * FROM tracking_data ORDER BY updated_at DESC LIMIT 10;
```

## 🎯 Best Practices

1. **Always test before deployment**
2. **Monitor real-time updates**
3. **Check data integrity regularly**
4. **Validate coordinates**
5. **Handle errors gracefully**

## 📞 Support

- Check logs: `tail -f backend/logs/app.log`
- Run debug: `node debug-tracking-system.js`
- Restart services if needed

---

**Version:** 2.0 | **Last Updated:** December 2024
