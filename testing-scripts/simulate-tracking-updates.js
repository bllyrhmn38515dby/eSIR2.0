const axios = require('axios');
const io = require('socket.io-client');

// Configuration
const BASE_URL = 'http://localhost:3001';
const SOCKET_URL = 'http://localhost:3001';

// Test data
const testSessions = [
  {
    rujukan_id: 1,
    nomor_rujukan: 'RUJ-2024-001',
    nama_pasien: 'Ahmad Santoso',
    faskes_asal_nama: 'RS Umum Bogor',
    faskes_tujuan_nama: 'RS Siloam Bogor',
    status: 'menunggu'
  },
  {
    rujukan_id: 2,
    nomor_rujukan: 'RUJ-2024-002',
    nama_pasien: 'Siti Nurhaliza',
    faskes_asal_nama: 'Klinik Sejahtera',
    faskes_tujuan_nama: 'RS Hermina Bogor',
    status: 'dijemput'
  },
  {
    rujukan_id: 3,
    nomor_rujukan: 'RUJ-2024-003',
    nama_pasien: 'Budi Prasetyo',
    faskes_asal_nama: 'Puskesmas Bogor Utara',
    faskes_tujuan_nama: 'RS PMI Bogor',
    status: 'dalam_perjalanan'
  }
];

// Simulated coordinates for Bogor area
const bogorCoordinates = [
  [-6.5971, 106.8060], // Kota Bogor center
  [-6.5891, 106.8060], // Slightly north
  [-6.6051, 106.8060], // Slightly south
  [-6.5971, 106.7960], // Slightly west
  [-6.5971, 106.8160], // Slightly east
  [-6.5871, 106.7960], // Northwest
  [-6.6071, 106.8160], // Southeast
  [-6.5871, 106.8160], // Northeast
  [-6.6071, 106.7960]  // Southwest
];

class TrackingSimulator {
  constructor() {
    this.socket = null;
    this.activeSessions = new Map();
    this.simulationIntervals = new Map();
    this.isRunning = false;
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Tracking Simulator...');
      
      // Connect to Socket.IO
      this.socket = io(SOCKET_URL);
      
      this.socket.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');
      });
      
      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from Socket.IO server');
      });
      
      this.socket.on('error', (error) => {
        console.error('❌ Socket.IO error:', error);
      });
      
      // Wait for connection
      await new Promise((resolve) => {
        if (this.socket.connected) {
          resolve();
        } else {
          this.socket.once('connect', resolve);
        }
      });
      
      console.log('✅ Tracking Simulator initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize simulator:', error.message);
      return false;
    }
  }

  async createTestSessions() {
    console.log('📋 Creating test tracking sessions...');
    
    for (const session of testSessions) {
      try {
        // Start tracking session
        const response = await axios.post(`${BASE_URL}/api/tracking/start`, {
          rujukan_id: session.rujukan_id,
          latitude: bogorCoordinates[0][0],
          longitude: bogorCoordinates[0][1],
          status: session.status
        }, {
          headers: {
            'Authorization': `Bearer ${await this.getTestToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          console.log(`✅ Created session for ${session.nama_pasien}`);
          this.activeSessions.set(session.rujukan_id, {
            ...session,
            session_token: response.data.data.session_token,
            current_position: 0
          });
        }
      } catch (error) {
        console.error(`❌ Failed to create session for ${session.nama_pasien}:`, error.message);
      }
    }
  }

  async getTestToken() {
    try {
      // Try to get token from login
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        username: 'admin',
        password: 'admin123'
      });
      
      return response.data.token;
    } catch (error) {
      console.log('⚠️ Using default token for testing');
      return 'test-token-123';
    }
  }

  startSimulation() {
    if (this.isRunning) {
      console.log('⚠️ Simulation is already running');
      return;
    }
    
    console.log('🎬 Starting tracking simulation...');
    this.isRunning = true;
    
    // Start simulation for each active session
    this.activeSessions.forEach((session, rujukanId) => {
      this.startSessionSimulation(rujukanId, session);
    });
    
    console.log(`✅ Started simulation for ${this.activeSessions.size} sessions`);
  }

  startSessionSimulation(rujukanId, session) {
    const interval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }
      
      try {
        // Get current session data
        const currentSession = this.activeSessions.get(rujukanId);
        if (!currentSession) {
          clearInterval(interval);
          return;
        }
        
        // Move to next position
        currentSession.current_position = (currentSession.current_position + 1) % bogorCoordinates.length;
        const newCoords = bogorCoordinates[currentSession.current_position];
        
        // Update status based on position
        let newStatus = currentSession.status;
        if (currentSession.current_position > 3 && currentSession.status === 'menunggu') {
          newStatus = 'dijemput';
        } else if (currentSession.current_position > 6 && currentSession.status === 'dijemput') {
          newStatus = 'dalam_perjalanan';
        } else if (currentSession.current_position === 8 && currentSession.status === 'dalam_perjalanan') {
          newStatus = 'tiba';
        }
        
        // Calculate simulated data
        const estimated_distance = this.calculateDistance(newCoords[0], newCoords[1], -6.5971, 106.8060);
        const estimated_time = Math.floor(estimated_distance * 10); // 10 minutes per km
        const speed = Math.random() * 30 + 20; // 20-50 km/h
        const battery_level = Math.floor(Math.random() * 20 + 80); // 80-100%
        
        // Update tracking data
        const updateData = {
          rujukan_id: rujukanId,
          latitude: newCoords[0],
          longitude: newCoords[1],
          status: newStatus,
          estimated_distance: estimated_distance,
          estimated_time: estimated_time,
          speed: speed,
          battery_level: battery_level,
          accuracy: Math.random() * 5 + 5, // 5-10 meters
          heading: Math.random() * 360, // 0-360 degrees
          timestamp: new Date().toISOString()
        };
        
        // Send update via API
        await axios.post(`${BASE_URL}/api/tracking/update`, updateData, {
          headers: {
            'Authorization': `Bearer ${await this.getTestToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Emit Socket.IO event
        if (this.socket && this.socket.connected) {
          this.socket.emit('tracking-update', updateData);
        }
        
        // Update local session data
        this.activeSessions.set(rujukanId, {
          ...currentSession,
          status: newStatus
        });
        
        console.log(`📍 Updated ${session.nama_pasien}: ${newStatus} at [${newCoords[0].toFixed(4)}, ${newCoords[1].toFixed(4)}]`);
        
        // Stop simulation if reached destination
        if (newStatus === 'tiba') {
          console.log(`🎯 ${session.nama_pasien} reached destination`);
          clearInterval(interval);
          this.simulationIntervals.delete(rujukanId);
        }
        
      } catch (error) {
        console.error(`❌ Error updating session ${rujukanId}:`, error.message);
      }
    }, 5000); // Update every 5 seconds
    
    this.simulationIntervals.set(rujukanId, interval);
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  stopSimulation() {
    console.log('⏹️ Stopping tracking simulation...');
    this.isRunning = false;
    
    // Clear all intervals
    this.simulationIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.simulationIntervals.clear();
    
    console.log('✅ Simulation stopped');
  }

  async cleanup() {
    console.log('🧹 Cleaning up test sessions...');
    
    // End all active sessions
    for (const [rujukanId, session] of this.activeSessions) {
      try {
        await axios.post(`${BASE_URL}/api/tracking/end`, {
          rujukan_id: rujukanId
        }, {
          headers: {
            'Authorization': `Bearer ${await this.getTestToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ Ended session for ${session.nama_pasien}`);
      } catch (error) {
        console.error(`❌ Failed to end session for ${session.nama_pasien}:`, error.message);
      }
    }
    
    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
    }
    
    console.log('✅ Cleanup completed');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      activeSessions: this.activeSessions.size,
      simulationIntervals: this.simulationIntervals.size
    };
  }
}

// Main execution
async function main() {
  const simulator = new TrackingSimulator();
  
  try {
    // Initialize simulator
    const initialized = await simulator.initialize();
    if (!initialized) {
      console.log('❌ Failed to initialize simulator. Exiting...');
      return;
    }
    
    // Create test sessions
    await simulator.createTestSessions();
    
    // Start simulation
    simulator.startSimulation();
    
    // Keep running for 5 minutes
    console.log('⏰ Simulation will run for 5 minutes...');
    setTimeout(async () => {
      simulator.stopSimulation();
      await simulator.cleanup();
      console.log('🎉 Simulation completed!');
      process.exit(0);
    }, 5 * 60 * 1000);
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      simulator.stopSimulation();
      await simulator.cleanup();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Simulation error:', error);
    await simulator.cleanup();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = TrackingSimulator;
