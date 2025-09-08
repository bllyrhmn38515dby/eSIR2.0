const db = require('../config/db');

class DatabaseMonitor {
  constructor() {
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000; // 5 seconds
    this.monitorInterval = null;
  }

  // Test database connection
  async testConnection() {
    try {
      const [rows] = await db.execute('SELECT 1 as test');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      // Only log on first successful connection or reconnection
      if (!this.isConnected) {
        console.log('✅ Database connection test successful');
      }
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  // Start monitoring database connection
  startMonitoring() {
    console.log('🔍 Starting database connection monitoring...');
    
    this.monitorInterval = setInterval(async () => {
      const isConnected = await this.testConnection();
      
      if (!isConnected && this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`🔄 Attempting to reconnect to database (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        this.reconnectAttempts++;
        
        // Try to reconnect
        setTimeout(async () => {
          await this.testConnection();
        }, this.reconnectInterval);
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('🚨 Max reconnection attempts reached. Database connection failed.');
        this.stopMonitoring();
      }
    }, 300000); // Check every 5 minutes instead of 30 seconds
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      console.log('🛑 Database monitoring stopped');
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  // Force reconnect
  async forceReconnect() {
    console.log('🔄 Force reconnecting to database...');
    this.reconnectAttempts = 0;
    return await this.testConnection();
  }
}

// Create singleton instance
const databaseMonitor = new DatabaseMonitor();

module.exports = databaseMonitor;
