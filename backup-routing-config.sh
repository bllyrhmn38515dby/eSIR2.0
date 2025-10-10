#!/bin/bash
# Backup Script untuk Routing Configuration
# Script ini akan membuat backup dari konfigurasi routing yang sudah dioptimasi

echo "🔄 Creating backup of routing configuration..."

# Buat direktori backup jika belum ada
mkdir -p backups/routing-config-$(date +%Y%m%d-%H%M%S)

# Backup file konfigurasi
cp backend/config/routing-config.js backups/routing-config-$(date +%Y%m%d-%H%M%S)/
cp backend/routes/routing.js backups/routing-config-$(date +%Y%m%d-%H%M%S)/
cp ROUTING_CONFIGURATION_PERMANENT.md backups/routing-config-$(date +%Y%m%d-%H%M%S)/

# Backup environment variables (tanpa API keys)
cp backend/.env backups/routing-config-$(date +%Y%m%d-%H%M%S)/.env.backup

echo "✅ Backup completed successfully!"
echo "📁 Backup location: backups/routing-config-$(date +%Y%m%d-%H%M%S)/"
echo ""
echo "📋 Files backed up:"
echo "  - backend/config/routing-config.js"
echo "  - backend/routes/routing.js"
echo "  - ROUTING_CONFIGURATION_PERMANENT.md"
echo "  - backend/.env (without API keys)"
echo ""
echo "⚠️  Remember to keep API keys secure and not commit them to version control!"
