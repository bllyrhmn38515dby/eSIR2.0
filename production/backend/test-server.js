console.log('🔍 Testing server startup...');

try {
  require('dotenv').config();
  console.log('✅ dotenv loaded');
  
  const express = require('express');
  console.log('✅ express loaded');
  
  const cors = require('cors');
  console.log('✅ cors loaded');
  
  const pool = require('./config/db');
  console.log('✅ database config loaded');
  
  console.log('✅ All dependencies loaded successfully');
  console.log('🔧 Environment variables:');
  console.log('  - DB_HOST:', process.env.DB_HOST);
  console.log('  - DB_DATABASE:', process.env.DB_DATABASE);
  console.log('  - PORT:', process.env.PORT);
  console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
  
} catch (error) {
  console.error('❌ Error loading dependencies:', error.message);
  console.error('Stack:', error.stack);
}
