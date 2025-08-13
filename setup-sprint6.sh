#!/bin/bash

echo "🚀 Setup Sprint 6: Real-Time Route Tracking"
echo "=============================================="

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Setup tracking database
echo "Setting up tracking database..."
node add-tracking-tables.js

# Setup search database (if not exists)
if [ ! -f "search_logs_created" ]; then
    echo "Setting up search database..."
    node add-search-table.js
    touch search_logs_created
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  IMPORTANT: You need to create .env file with Google Maps API key"
    echo "Copy env.example to .env and add your Google Maps API key:"
    echo "cp env.example .env"
    echo ""
    echo "Get Google Maps API key from: https://console.cloud.google.com/"
    echo "Enable Maps JavaScript API and Directions API"
    echo ""
fi

cd ..

echo ""
echo "✅ Setup Sprint 6 completed!"
echo ""
echo "🚀 To start the application:"
echo "1. Backend: cd backend && npm start"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "📱 Features available:"
echo "- Real-time route tracking with Google Maps"
echo "- GPS position tracking for ambulance"
echo "- Live monitoring dashboard"
echo "- Status management (Menunggu → Dijemput → Dalam Perjalanan → Tiba)"
echo ""
echo "🗺️  Coverage: Kota Bogor, Jawa Barat"
echo ""
