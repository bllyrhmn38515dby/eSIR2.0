// eSIR 2.0 UCD Prototype - Main JavaScript

class PrototypeApp {
    constructor() {
        this.currentScreen = 'login';
        this.mockData = this.loadMockData();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.simulateRealTimeUpdates();
        this.initializeScreen();
    }
    
    // Load mock data
    loadMockData() {
        return {
            users: {
                admin: {
                    id: 1,
                    name: "Admin Pusat",
                    role: "admin_pusat",
                    avatar: "👨‍💼",
                    permissions: ["all"]
                },
                faskes: {
                    id: 2,
                    name: "Admin Faskes",
                    role: "admin_faskes",
                    avatar: "👩‍⚕️",
                    permissions: ["rujukan", "pasien"]
                },
                driver: {
                    id: 3,
                    name: "Sopir Ambulans",
                    role: "sopir_ambulans",
                    avatar: "🚑",
                    permissions: ["tracking"]
                }
            },
            rujukan: [
                {
                    id: 1234,
                    patient: "Ahmad Suryadi",
                    age: 45,
                    condition: "Cardiac Arrest",
                    priority: "critical",
                    status: "dalam_perjalanan",
                    from: "Puskesmas A",
                    to: "RS B",
                    timestamp: "2024-11-30 14:30:00",
                    ambulance: "Ambulans 001"
                },
                {
                    id: 1233,
                    patient: "Siti Nurhaliza",
                    age: 32,
                    condition: "Appendicitis",
                    priority: "urgent",
                    status: "selesai",
                    from: "Puskesmas B",
                    to: "RS A",
                    timestamp: "2024-11-30 14:15:00",
                    ambulance: "Ambulans 002"
                },
                {
                    id: 1232,
                    patient: "Budi Santoso",
                    age: 28,
                    condition: "Fracture",
                    priority: "normal",
                    status: "menunggu",
                    from: "Klinik C",
                    to: "RS C",
                    timestamp: "2024-11-30 14:00:00",
                    ambulance: null
                }
            ],
            ambulans: [
                {
                    id: "001",
                    driver: "Dr. Ahmad Suryadi",
                    status: "available",
                    location: "Jl. Merdeka No. 123",
                    eta: "5 menit",
                    speed: "45 km/h",
                    lastUpdate: "2024-11-30 14:30:00"
                },
                {
                    id: "002",
                    driver: "Dr. Siti Nurhaliza",
                    status: "on_route",
                    location: "Jl. Sudirman No. 456",
                    eta: "15 menit",
                    speed: "35 km/h",
                    lastUpdate: "2024-11-30 14:25:00"
                },
                {
                    id: "003",
                    driver: "Dr. Budi Santoso",
                    status: "maintenance",
                    location: "Workshop",
                    eta: "N/A",
                    speed: "0 km/h",
                    lastUpdate: "2024-11-30 10:00:00"
                },
                {
                    id: "004",
                    driver: "Dr. Rina Wulandari",
                    status: "available",
                    location: "Jl. Thamrin No. 789",
                    eta: "8 menit",
                    speed: "40 km/h",
                    lastUpdate: "2024-11-30 14:28:00"
                }
            ],
            metrics: {
                totalRujukan: 150,
                todayRujukan: 25,
                pendingRujukan: 8,
                completeRujukan: 117,
                totalChange: 12,
                todayChange: 5,
                pendingChange: -3,
                completeChange: 8
            }
        };
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.navigateTo(screen);
            });
        });
        
        // Login form
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Quick actions
        document.querySelectorAll('.quick-actions .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.target.textContent.trim());
            });
        });
        
        // Alert actions
        document.querySelectorAll('.alert-item .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAlertAction(e.target.textContent.trim());
            });
        });
        
        // Metric cards
        document.querySelectorAll('.metric-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleMetricClick(card);
            });
        });
    }
    
    // Navigation
    navigateTo(screen) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-screen="${screen}"]`).classList.add('active');
        
        // Update screen
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
        });
        document.getElementById(`${screen}-screen`).classList.add('active');
        
        this.currentScreen = screen;
        this.updateScreenData();
    }
    
    // Handle login
    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            // Simulate login
            this.showNotification('Login berhasil!', 'success');
            setTimeout(() => {
                this.navigateTo('dashboard');
            }, 1000);
        } else {
            this.showNotification('Username dan password harus diisi!', 'error');
        }
    }
    
    // Handle quick actions
    handleQuickAction(action) {
        switch (action) {
            case '📋 New Rujukan':
                this.showNotification('Membuka form rujukan baru...', 'info');
                setTimeout(() => {
                    this.navigateTo('rujukan-form');
                }, 1000);
                break;
            case '🔍 Search Pasien':
                this.showNotification('Membuka pencarian pasien...', 'info');
                break;
            case '📊 Generate Report':
                this.showNotification('Membuka dashboard laporan...', 'info');
                setTimeout(() => {
                    this.navigateTo('reports');
                }, 1000);
                break;
            case '⚙️ System Settings':
                this.showNotification('Membuka pengaturan sistem...', 'info');
                break;
        }
    }
    
    // Handle alert actions
    handleAlertAction(action) {
        switch (action) {
            case 'View All Alerts':
                this.showNotification('Membuka semua alert...', 'info');
                break;
        }
    }
    
    // Handle metric click
    handleMetricClick(card) {
        const label = card.querySelector('.metric-label').textContent;
        this.showNotification(`Membuka detail: ${label}`, 'info');
    }
    
    // Update screen data
    updateScreenData() {
        if (this.currentScreen === 'dashboard') {
            this.updateDashboardData();
        }
    }
    
    // Update dashboard data
    updateDashboardData() {
        // Update metrics
        const metrics = this.mockData.metrics;
        document.querySelectorAll('.metric-value').forEach((el, index) => {
            const values = [metrics.totalRujukan, metrics.todayRujukan, metrics.pendingRujukan, metrics.completeRujukan];
            if (values[index]) {
                el.textContent = values[index];
            }
        });
        
        // Update activity
        this.updateActivityFeed();
        
        // Update ambulans status
        this.updateAmbulansStatus();
    }
    
    // Update activity feed
    updateActivityFeed() {
        const activityContainer = document.querySelector('.activity-item').parentElement;
        if (activityContainer) {
            activityContainer.innerHTML = '';
            
            this.mockData.rujukan.slice(0, 3).forEach(rujukan => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                
                const icon = this.getStatusIcon(rujukan.status);
                const statusText = this.getStatusText(rujukan.status);
                
                activityItem.innerHTML = `
                    <div class="activity-icon">${icon}</div>
                    <div class="activity-content">
                        <div class="activity-title">Rujukan #${rujukan.id} - ${rujukan.to}</div>
                        <div class="activity-subtitle">Status: ${statusText}</div>
                        <div class="activity-time">Time: ${rujukan.timestamp.split(' ')[1]}</div>
                    </div>
                `;
                
                activityContainer.appendChild(activityItem);
            });
        }
    }
    
    // Update ambulans status
    updateAmbulansStatus() {
        const ambulansContainer = document.querySelector('.ambulans-item').parentElement;
        if (ambulansContainer) {
            ambulansContainer.innerHTML = '';
            
            this.mockData.ambulans.forEach(ambulans => {
                const ambulansItem = document.createElement('div');
                ambulansItem.className = 'ambulans-item';
                
                const statusIcon = this.getAmbulansStatusIcon(ambulans.status);
                const statusText = this.getAmbulansStatusText(ambulans.status);
                
                ambulansItem.innerHTML = `
                    <div class="ambulans-icon">${statusIcon}</div>
                    <div class="ambulans-info">
                        <div class="ambulans-name">Ambulans ${ambulans.id} - ${statusText}</div>
                    </div>
                `;
                
                ambulansContainer.appendChild(ambulansItem);
            });
        }
    }
    
    // Get status icon
    getStatusIcon(status) {
        const icons = {
            'dalam_perjalanan': '🚑',
            'selesai': '✅',
            'menunggu': '⏳',
            'dijemput': '🚑',
            'tiba': '🏥'
        };
        return icons[status] || '📋';
    }
    
    // Get status text
    getStatusText(status) {
        const texts = {
            'dalam_perjalanan': 'Dalam Perjalanan',
            'selesai': 'Selesai',
            'menunggu': 'Menunggu',
            'dijemput': 'Dijemput',
            'tiba': 'Tiba'
        };
        return texts[status] || status;
    }
    
    // Get ambulans status icon
    getAmbulansStatusIcon(status) {
        const icons = {
            'available': '🟢',
            'on_route': '🟡',
            'maintenance': '🔴',
            'busy': '🟠'
        };
        return icons[status] || '⚪';
    }
    
    // Get ambulans status text
    getAmbulansStatusText(status) {
        const texts = {
            'available': 'Available',
            'on_route': 'On Route',
            'maintenance': 'Maintenance',
            'busy': 'Busy'
        };
        return texts[status] || status;
    }
    
    // Simulate real-time updates
    simulateRealTimeUpdates() {
        setInterval(() => {
            if (this.currentScreen === 'dashboard') {
                this.simulateDataUpdates();
            }
        }, 30000); // Update every 30 seconds
    }
    
    // Simulate data updates
    simulateDataUpdates() {
        // Randomly update metrics
        const metrics = this.mockData.metrics;
        const changes = [-1, 0, 1];
        
        metrics.todayRujukan += changes[Math.floor(Math.random() * changes.length)];
        metrics.pendingRujukan += changes[Math.floor(Math.random() * changes.length)];
        metrics.completeRujukan += changes[Math.floor(Math.random() * changes.length)];
        
        // Update display
        this.updateDashboardData();
        
        // Show update notification
        this.showNotification('Data diperbarui', 'info');
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }
    
    // Get notification color
    getNotificationColor(type) {
        const colors = {
            'success': '#16A34A',
            'error': '#DC2626',
            'warning': '#D97706',
            'info': '#2563EB'
        };
        return colors[type] || '#2563EB';
    }
    
    // Initialize screen
    initializeScreen() {
        this.updateScreenData();
    }
}

// Global functions
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function resetPrototype() {
    if (confirm('Apakah Anda yakin ingin mereset prototype?')) {
        location.reload();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.prototypeApp = new PrototypeApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
