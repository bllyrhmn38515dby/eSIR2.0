# 🚀 Panduan Deployment eSIR 2.0

Panduan lengkap untuk deployment aplikasi eSIR 2.0 ke production environment.

## 📋 Prerequisites

### **Server Requirements**
- **OS:** Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM:** Minimum 2GB (Recommended: 4GB+)
- **Storage:** Minimum 20GB (Recommended: 50GB+)
- **CPU:** 2 cores minimum (Recommended: 4 cores+)

### **Software Requirements**
- **Node.js:** v16.0.0 atau lebih baru
- **MySQL:** v8.0 atau lebih baru
- **Nginx:** v1.18+ (untuk reverse proxy)
- **PM2:** Untuk process management
- **Git:** Untuk deployment

### **Domain & SSL**
- Domain name yang sudah dikonfigurasi
- SSL certificate (Let's Encrypt recommended)

## 🛠️ Server Setup

### **1. Update System**
```bash
sudo apt update && sudo apt upgrade -y
```

### **2. Install Node.js**
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### **3. Install MySQL**
```bash
# Install MySQL
sudo apt install mysql-server -y

# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE esir_db;
CREATE USER 'esir_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON esir_db.* TO 'esir_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **4. Install Nginx**
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### **5. Install PM2**
```bash
sudo npm install -g pm2
```

## 📁 Application Deployment

### **1. Clone Repository**
```bash
cd /var/www
sudo git clone <your-repository-url> esir2.0
sudo chown -R $USER:$USER esir2.0
cd esir2.0
```

### **2. Setup Backend**
```bash
cd backend

# Install dependencies
npm install --production

# Create environment file
cp .env.example .env
nano .env
```

**Backend Environment Configuration (.env):**
```env
DB_HOST=localhost
DB_USER=esir_user
DB_PASSWORD=your_secure_password
DB_NAME=esir_db
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=production
```

### **3. Setup Database**
```bash
# Import database schema
mysql -u esir_user -p esir_db < database.sql

# Run setup scripts
node setup-database.js
node create-user.js
node add-faskes-id-to-users.js
node setup-rujukan-database.js
node setup-notifications.js
```

### **4. Setup Frontend**
```bash
cd ../frontend

# Install dependencies
npm install --production

# Create production build
npm run build
```

### **5. Configure Frontend for Production**
Edit `frontend/src/context/AuthContext.js` dan `frontend/src/context/SocketContext.js` untuk menggunakan production URLs:

```javascript
// Change from localhost to your domain
const API_BASE_URL = 'https://your-domain.com/api';
const SOCKET_URL = 'https://your-domain.com';
```

## 🔧 PM2 Configuration

### **1. Create PM2 Ecosystem File**
```bash
cd /var/www/esir2.0
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'esir-backend',
      script: './backend/index.js',
      cwd: '/var/www/esir2.0',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
```

### **2. Start Application**
```bash
# Create logs directory
mkdir logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

## 🌐 Nginx Configuration

### **1. Create Nginx Configuration**
```bash
sudo nano /etc/nginx/sites-available/esir2.0
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Frontend (React build)
    location / {
        root /var/www/esir2.0/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
```

### **2. Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/esir2.0 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL Certificate (Let's Encrypt)

### **1. Install Certbot**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### **2. Obtain SSL Certificate**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### **3. Setup Auto-renewal**
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Environment-Specific Configurations

### **Production Environment Variables**

**Backend (.env):**
```env
NODE_ENV=production
DB_HOST=localhost
DB_USER=esir_user
DB_PASSWORD=your_secure_password
DB_NAME=esir_db
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h
PORT=3001
CORS_ORIGIN=https://your-domain.com
```

**Frontend Configuration:**
Update API base URLs in your React components to use HTTPS and your domain.

### **Database Optimization**
```sql
-- Add indexes for better performance
CREATE INDEX idx_rujukan_status ON rujukan(status);
CREATE INDEX idx_rujukan_faskes_asal ON rujukan(faskes_asal_id);
CREATE INDEX idx_rujukan_faskes_tujuan ON rujukan(faskes_tujuan_id);
CREATE INDEX idx_rujukan_tanggal ON rujukan(tanggal_rujukan);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

## 📊 Monitoring & Logging

### **1. PM2 Monitoring**
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs

# View specific app logs
pm2 logs esir-backend
```

### **2. Nginx Logs**
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### **3. MySQL Logs**
```bash
# Enable MySQL slow query log
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add these lines:
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

## 🔄 Deployment Script

### **Create Deployment Script**
```bash
nano deploy.sh
```

```bash
#!/bin/bash

echo "🚀 Starting eSIR 2.0 Deployment..."

# Navigate to project directory
cd /var/www/esir2.0

# Pull latest changes
git pull origin main

# Backend deployment
echo "📦 Deploying Backend..."
cd backend
npm install --production
pm2 restart esir-backend

# Frontend deployment
echo "📦 Deploying Frontend..."
cd ../frontend
npm install --production
npm run build

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
```

### **Make Script Executable**
```bash
chmod +x deploy.sh
```

## 🧪 Post-Deployment Testing

### **1. Health Checks**
```bash
# Test backend API
curl -X GET https://your-domain.com/api/auth/profile

# Test frontend
curl -I https://your-domain.com

# Test Socket.IO
curl -I https://your-domain.com/socket.io
```

### **2. Database Connection**
```bash
# Test database connection
mysql -u esir_user -p -e "USE esir_db; SHOW TABLES;"
```

### **3. SSL Certificate**
```bash
# Test SSL configuration
sudo certbot certificates
```

## 🔧 Troubleshooting

### **Common Issues**

1. **PM2 Process Not Starting**
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.js
   pm2 save
   ```

2. **Nginx Configuration Error**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **Database Connection Issues**
   ```bash
   # Check MySQL status
   sudo systemctl status mysql
   
   # Test connection
   mysql -u esir_user -p -e "SELECT 1;"
   ```

4. **SSL Certificate Issues**
   ```bash
   sudo certbot renew --dry-run
   sudo systemctl reload nginx
   ```

### **Performance Optimization**

1. **Enable MySQL Query Cache**
2. **Configure Nginx caching**
3. **Optimize PM2 cluster mode**
4. **Enable Gzip compression**

## 📈 Backup Strategy

### **1. Database Backup**
```bash
# Create backup script
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/esir2.0"

mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u esir_user -p esir_db > $BACKUP_DIR/db_backup_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/esir2.0

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### **2. Automated Backup**
```bash
# Add to crontab
0 2 * * * /var/www/esir2.0/backup.sh
```

## 🔐 Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Database user with minimal privileges
- [ ] SSL certificate installed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Backup strategy implemented

---

**Status:** ✅ **PRODUCTION READY** - Sistem siap untuk deployment ke production environment.
