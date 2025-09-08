// eSIR 2.0 UCD Prototype - Emergency JavaScript

class EmergencyAlertSystem {
    constructor() {
        this.alerts = [];
        this.emergencyMode = false;
        this.alertCounter = 0;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadInitialAlerts();
        this.startRealTimeUpdates();
        this.setupAlertFiltering();
    }
    
    setupEventListeners() {
        // Emergency banner actions
        const acknowledgeBtn = document.getElementById('acknowledge-btn');
        if (acknowledgeBtn) {
            acknowledgeBtn.addEventListener('click', () => {
                this.acknowledgeEmergency();
            });
        }
        
        const dismissBtn = document.getElementById('dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                this.dismissEmergency();
            });
        }
        
        // Overview controls
        const newEmergencyBtn = document.getElementById('new-emergency-btn');
        if (newEmergencyBtn) {
            newEmergencyBtn.addEventListener('click', () => {
                this.createNewEmergency();
            });
        }
        
        const refreshAlertsBtn = document.getElementById('refresh-alerts-btn');
        if (refreshAlertsBtn) {
            refreshAlertsBtn.addEventListener('click', () => {
                this.refreshAlerts();
            });
        }
        
        // Alert filter
        const alertFilter = document.getElementById('alert-filter');
        if (alertFilter) {
            alertFilter.addEventListener('change', (e) => {
                this.filterAlerts(e.target.value);
            });
        }
    }
    
    loadInitialAlerts() {
        // Load initial alerts data
        this.alerts = [
            {
                id: 'ambulans-001',
                type: 'critical',
                title: '🚑 Ambulans Emergency',
                description: 'Ambulans 001 mengalami kecelakaan di Jl. Sudirman. Driver terluka, pasien dalam kondisi kritis.',
                time: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
                details: {
                    location: 'Jl. Sudirman No. 45, Jakarta',
                    driver: 'Ahmad Suryadi',
                    patient: 'Maria Sari (Critical)'
                },
                status: 'active'
            },
            {
                id: 'rs-a',
                type: 'critical',
                title: '🏥 Hospital Overcapacity',
                description: 'RS A Jakarta melaporkan overcapacity. Tidak ada tempat tidur kosong untuk pasien baru.',
                time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                details: {
                    hospital: 'RS A - Jakarta',
                    capacity: '100% (0/150 beds)',
                    waitTime: '4+ hours'
                },
                status: 'active'
            },
            {
                id: 'ambulans-003',
                type: 'warning',
                title: '⏰ Response Time Delay',
                description: 'Ambulans 003 terlambat 15 menit dari ETA. Traffic congestion di Jl. Thamrin.',
                time: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
                details: {
                    ambulans: 'Ambulans 003',
                    delay: '15 minutes',
                    reason: 'Traffic congestion'
                },
                status: 'active'
            },
            {
                id: 'rujukan-001',
                type: 'info',
                title: '📋 New Rujukan',
                description: 'Rujukan baru dari Puskesmas B untuk pasien dengan kondisi darurat.',
                time: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
                details: {
                    from: 'Puskesmas B - Jakarta',
                    patient: 'Budi Santoso',
                    priority: 'High'
                },
                status: 'active'
            }
        ];
        
        this.updateAlertCounts();
    }
    
    startRealTimeUpdates() {
        // Update alert times every minute
        setInterval(() => {
            this.updateAlertTimes();
        }, 60000);
        
        // Simulate new alerts every 30 seconds
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance
                this.simulateNewAlert();
            }
        }, 30000);
        
        // Update overview stats every 10 seconds
        setInterval(() => {
            this.updateOverviewStats();
        }, 10000);
    }
    
    setupAlertFiltering() {
        // Initial filter setup
        this.filterAlerts('all');
    }
    
    acknowledgeEmergency() {
        this.showNotification('Emergency acknowledged! Response team notified.', 'success');
        
        // Hide emergency banner
        const banner = document.getElementById('emergency-banner');
        if (banner) {
            banner.style.display = 'none';
        }
        
        // Update emergency mode
        this.emergencyMode = false;
        
        // Log acknowledgment
        console.log('Emergency acknowledged at:', new Date().toISOString());
    }
    
    dismissEmergency() {
        if (confirm('Are you sure you want to dismiss this emergency alert?')) {
            this.showNotification('Emergency alert dismissed.', 'warning');
            
            // Hide emergency banner
            const banner = document.getElementById('emergency-banner');
            if (banner) {
                banner.style.display = 'none';
            }
            
            // Update emergency mode
            this.emergencyMode = false;
        }
    }
    
    createNewEmergency() {
        const emergencyTypes = [
            {
                type: 'critical',
                title: '🚑 Ambulans Breakdown',
                description: 'Ambulans mengalami kerusakan mesin di tengah perjalanan.',
                details: {
                    ambulans: 'Ambulans 005',
                    location: 'Jl. Gatot Subroto, Jakarta',
                    driver: 'Siti Nurhaliza'
                }
            },
            {
                type: 'warning',
                title: '⚠️ Weather Alert',
                description: 'Cuaca buruk mempengaruhi operasional ambulans.',
                details: {
                    condition: 'Heavy Rain',
                    affected: '3 ambulans',
                    impact: 'Delayed response'
                }
            },
            {
                type: 'info',
                title: '📋 Equipment Check',
                description: 'Pemeriksaan rutin peralatan ambulans diperlukan.',
                details: {
                    ambulans: 'Ambulans 002',
                    equipment: 'Oxygen tank',
                    status: 'Low pressure'
                }
            }
        ];
        
        const randomEmergency = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
        
        const newAlert = {
            id: `emergency-${Date.now()}`,
            type: randomEmergency.type,
            title: randomEmergency.title,
            description: randomEmergency.description,
            time: new Date(),
            details: randomEmergency.details,
            status: 'active'
        };
        
        this.alerts.unshift(newAlert);
        this.updateAlertCounts();
        this.renderAlerts();
        
        this.showNotification(`New ${randomEmergency.type} alert created!`, 'info');
        
        // If critical, show emergency banner
        if (randomEmergency.type === 'critical') {
            this.showEmergencyBanner(newAlert);
        }
    }
    
    refreshAlerts() {
        this.showNotification('Refreshing alerts...', 'info');
        
        // Simulate refresh delay
        setTimeout(() => {
            this.updateAlertTimes();
            this.updateOverviewStats();
            this.showNotification('Alerts refreshed!', 'success');
        }, 1000);
    }
    
    filterAlerts(filterType) {
        const alertItems = document.querySelectorAll('.alert-item');
        
        alertItems.forEach(item => {
            const alertType = item.dataset.type;
            
            if (filterType === 'all' || alertType === filterType) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        this.showNotification(`Filtered to show: ${filterType} alerts`, 'info');
    }
    
    updateAlertTimes() {
        const alertItems = document.querySelectorAll('.alert-item');
        
        alertItems.forEach((item, index) => {
            if (index < this.alerts.length) {
                const alert = this.alerts[index];
                const timeElement = item.querySelector('.alert-time');
                if (timeElement) {
                    timeElement.textContent = this.getTimeAgo(alert.time);
                }
            }
        });
    }
    
    updateOverviewStats() {
        const stats = this.calculateAlertStats();
        
        // Update overview cards
        const criticalCard = document.querySelector('.overview-card.critical .card-value');
        if (criticalCard) {
            criticalCard.textContent = stats.critical;
        }
        
        const warningCard = document.querySelector('.overview-card.warning .card-value');
        if (warningCard) {
            warningCard.textContent = stats.warning;
        }
        
        const infoCard = document.querySelector('.overview-card.info .card-value');
        if (infoCard) {
            infoCard.textContent = stats.info;
        }
        
        const successCard = document.querySelector('.overview-card.success .card-value');
        if (successCard) {
            successCard.textContent = stats.resolved;
        }
    }
    
    calculateAlertStats() {
        const stats = {
            critical: 0,
            warning: 0,
            info: 0,
            resolved: 0
        };
        
        this.alerts.forEach(alert => {
            if (alert.status === 'resolved') {
                stats.resolved++;
            } else {
                stats[alert.type]++;
            }
        });
        
        return stats;
    }
    
    updateAlertCounts() {
        // This method is called when alerts are added/removed
        this.updateOverviewStats();
    }
    
    simulateNewAlert() {
        const alertTypes = ['critical', 'warning', 'info'];
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        const newAlert = {
            id: `sim-${Date.now()}`,
            type: randomType,
            title: `🔄 Simulated ${randomType} alert`,
            description: `This is a simulated ${randomType} alert for testing purposes.`,
            time: new Date(),
            details: {
                source: 'System Simulation',
                priority: randomType === 'critical' ? 'High' : 'Medium'
            },
            status: 'active'
        };
        
        this.alerts.unshift(newAlert);
        this.updateAlertCounts();
        
        // Show notification
        this.showNotification(`New ${randomType} alert received!`, 'info');
        
        // If critical, show emergency banner
        if (randomType === 'critical') {
            this.showEmergencyBanner(newAlert);
        }
    }
    
    showEmergencyBanner(alert) {
        const banner = document.getElementById('emergency-banner');
        if (banner) {
            banner.style.display = 'block';
            this.emergencyMode = true;
        }
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    }
    
    renderAlerts() {
        // This method would re-render the alerts list
        // For now, we'll just update the existing alerts
        this.updateAlertTimes();
    }
    
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
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }
    
    getNotificationColor(type) {
        const colors = {
            'success': '#16A34A',
            'error': '#DC2626',
            'warning': '#D97706',
            'info': '#2563EB'
        };
        return colors[type] || '#2563EB';
    }
}

// Global functions for emergency actions
function handleEmergency(alertId) {
    window.emergencySystem.showNotification(`Emergency response activated for ${alertId}!`, 'error');
    
    // Simulate emergency response
    setTimeout(() => {
        window.emergencySystem.showNotification('Emergency team dispatched!', 'success');
    }, 2000);
}

function handleOvercapacity(hospitalId) {
    window.emergencySystem.showNotification(`Overcapacity alert sent to ${hospitalId}!`, 'warning');
    
    // Simulate overcapacity response
    setTimeout(() => {
        window.emergencySystem.showNotification('Alternative hospitals notified!', 'info');
    }, 1500);
}

function handleDelay(ambulansId) {
    window.emergencySystem.showNotification(`Delay alert sent for ${ambulansId}!`, 'warning');
    
    // Simulate delay response
    setTimeout(() => {
        window.emergencySystem.showNotification('Traffic updates sent to driver!', 'info');
    }, 1000);
}

function handleRujukan(rujukanId) {
    window.emergencySystem.showNotification(`Rujukan ${rujukanId} processed!`, 'info');
    
    // Simulate rujukan processing
    setTimeout(() => {
        window.emergencySystem.showNotification('Ambulans assigned to rujukan!', 'success');
    }, 1500);
}

function viewDetails(alertId) {
    window.emergencySystem.showNotification(`Viewing details for ${alertId}...`, 'info');
    
    // Simulate opening details modal
    setTimeout(() => {
        window.emergencySystem.showNotification('Details modal opened!', 'success');
    }, 500);
}

// Emergency response functions
function dispatchAmbulans() {
    window.emergencySystem.showNotification('Dispatching nearest ambulans...', 'info');
    
    setTimeout(() => {
        window.emergencySystem.showNotification('Ambulans dispatched! ETA: 8 minutes', 'success');
    }, 2000);
}

function findHospital() {
    window.emergencySystem.showNotification('Searching for available hospitals...', 'info');
    
    setTimeout(() => {
        window.emergencySystem.showNotification('Found 3 available hospitals nearby!', 'success');
    }, 1500);
}

function contactTeam() {
    window.emergencySystem.showNotification('Contacting emergency team...', 'info');
    
    setTimeout(() => {
        window.emergencySystem.showNotification('Emergency team contacted!', 'success');
    }, 1000);
}

function createReport() {
    window.emergencySystem.showNotification('Creating emergency report...', 'info');
    
    setTimeout(() => {
        window.emergencySystem.showNotification('Emergency report created!', 'success');
    }, 2000);
}

// Emergency contact functions
function callEmergency(number) {
    window.emergencySystem.showNotification(`Calling ${number}...`, 'info');
    
    // Simulate call
    setTimeout(() => {
        window.emergencySystem.showNotification(`Connected to ${number}!`, 'success');
    }, 1500);
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
    if (confirm('Apakah Anda yakin ingin mereset emergency system?')) {
        location.reload();
    }
}

// Initialize emergency system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.emergencySystem = new EmergencyAlertSystem();
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
