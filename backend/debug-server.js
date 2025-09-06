console.log('🔍 Debug server startup...');

try {
  require('dotenv').config();
  console.log('✅ dotenv loaded');
  
  const express = require('express');
  console.log('✅ express loaded');
  
  const cors = require('cors');
  console.log('✅ cors loaded');
  
  const http = require('http');
  console.log('✅ http loaded');
  
  const socketIo = require('socket.io');
  console.log('✅ socket.io loaded');
  
  const pool = require('./config/db');
  console.log('✅ database config loaded');
  
  // Test database connection
  console.log('🔗 Testing database connection...');
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('❌ Database connection error:', err.message);
    } else {
      console.log('✅ Database connected successfully');
      connection.release();
    }
  });
  
  console.log('✅ All dependencies loaded successfully');
  
} catch (error) {
  console.error('❌ Error loading dependencies:', error.message);
  console.error('Stack:', error.stack);
}
