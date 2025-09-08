// eSIR 2.0 UCD Prototype - Tracking JavaScript

class AmbulansTracking {
    constructor() {
        this.isTracking = true;
        this.currentLocation = {
            lat: -6.2088,
            lng: 106.8456,
            address: "Jl. Merdeka No. 123, Kelurahan Sejahtera, Kecamatan Bahagia, Kota Jakarta Selatan 12345"
        };
        this.destination = {
            lat: -6.1751,
            lng: 106.8650,
            name: "RS A - Jakarta"
        };
        this.currentStatus = 'on-route';
        this.route = [
            { lat: -6.2088, lng: 106.8456, name: "Start Point" },
            { lat: -6.2000, lng: 106.8500, name: "Waypoint 1" },
            { lat: -6.1900, lng: 106.8600, name: "Waypoint 2" },
            { lat: -6.1751, lng: 106.8650, name: "RS A - Jakarta" }
        ];
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startRealTimeTracking();
        this.updateLocationDisplay();
        this.animateAmbulansMovement();
    }
    
    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshLocation();
            });
        }
        
        // Center map button
        const centerMapBtn = document.getElementById('center-map-btn');
        if (centerMapBtn) {
            centerMapBtn.addEventListener('click', () => {
                this.centerMap();
            });
        }
        
        // Status action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleStatusChange(e.currentTarget);
            });
        });
        
        // Mobile control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleMobileControl(e.currentTarget);
            });
        });
        
        // Map click events
        const mapView = document.getElementById('map-view');
        if (mapView) {
            mapView.addEventListener('click', (e) => {
                this.handleMapClick(e);
            });
        }
    }
    
    startRealTimeTracking() {
        // Update location every 5 seconds
        setInterval(() => {
            if (this.isTracking) {
                this.updateLocation();
                this.updateStatusInfo();
                this.updateLastUpdateTime();
            }
        }, 5000);
        
        // Update ETA every 10 seconds
        setInterval(() => {
            this.updateETA();
        }, 10000);
    }
    
    updateLocation() {
        // Simulate GPS movement
        const movement = {
            lat: (Math.random() - 0.5) * 0.001,
            lng: (Math.random() - 0.5) * 0.001
        };
        
        this.currentLocation.lat += movement.lat;
        this.currentLocation.lng += movement.lng;
        
        // Update location display
        this.updateLocationDisplay();
        
        // Update map marker position
        this.updateMapMarker();
        
        // Show location update notification
        this.showNotification('Location updated', 'info');
    }
    
    updateLocationDisplay() {
        // Update coordinates
        const coordItems = document.querySelectorAll('.coord-item');
        if (coordItems.length >= 2) {
            coordItems[0].textContent = `Lat: ${this.currentLocation.lat.toFixed(4)}°`;
            coordItems[1].textContent = `Lng: ${this.currentLocation.lng.toFixed(4)}°`;
        }
        
        // Update address (simulate address lookup)
        const addressElement = document.querySelector('.location-address');
        if (addressElement) {
            addressElement.textContent = this.currentLocation.address;
        }
    }
    
    updateMapMarker() {
        const marker = document.getElementById('ambulans-marker');
        if (marker) {
            // Calculate relative position on map
            const progress = this.calculateRouteProgress();
            const x = 30 + (progress * 40); // Move from 30% to 70% horizontally
            const y = 60 - (progress * 20); // Move from 60% to 40% vertically
            
            marker.style.left = `${x}%`;
            marker.style.top = `${y}%`;
            
            // Add movement animation
            marker.style.animation = 'moveAmbulans 2s ease-in-out';
            setTimeout(() => {
                marker.style.animation = '';
            }, 2000);
        }
    }
    
    calculateRouteProgress() {
        // Calculate progress based on distance to destination
        const distance = this.calculateDistance(
            this.currentLocation.lat,
            this.currentLocation.lng,
            this.destination.lat,
            this.destination.lng
        );
        
        const totalDistance = this.calculateDistance(
            this.route[0].lat,
            this.route[0].lng,
            this.destination.lat,
            this.destination.lng
        );
        
        return Math.max(0, Math.min(1, 1 - (distance / totalDistance)));
    }
    
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    updateStatusInfo() {
        const progress = this.calculateRouteProgress();
        const distance = this.calculateDistance(
            this.currentLocation.lat,
            this.currentLocation.lng,
            this.destination.lat,
            this.destination.lng
        );
        
        // Update distance
        const distanceElement = document.querySelector('.status-item:nth-child(4) .status-value');
        if (distanceElement) {
            distanceElement.textContent = `${distance.toFixed(1)} km`;
        }
        
        // Update speed (simulate varying speed)
        const speed = 35 + Math.random() * 20; // 35-55 km/h
        const speedElement = document.querySelector('.status-item:nth-child(3) .status-value');
        if (speedElement) {
            speedElement.textContent = `${Math.round(speed)} km/h`;
        }
    }
    
    updateETA() {
        const distance = this.calculateDistance(
            this.currentLocation.lat,
            this.currentLocation.lng,
            this.destination.lat,
            this.destination.lng
        );
        
        const averageSpeed = 40; // km/h
        const etaMinutes = Math.round((distance / averageSpeed) * 60);
        
        const etaElement = document.querySelector('.status-item:nth-child(2) .status-value');
        if (etaElement) {
            if (etaMinutes < 1) {
                etaElement.textContent = 'Arriving now';
            } else if (etaMinutes < 60) {
                etaElement.textContent = `${etaMinutes} menit`;
            } else {
                const hours = Math.floor(etaMinutes / 60);
                const minutes = etaMinutes % 60;
                etaElement.textContent = `${hours}h ${minutes}m`;
            }
        }
    }
    
    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const lastUpdateElement = document.getElementById('last-update');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = timeString;
        }
    }
    
    refreshLocation() {
        this.showNotification('Refreshing location...', 'info');
        
        // Simulate refresh delay
        setTimeout(() => {
            this.updateLocation();
            this.showNotification('Location refreshed!', 'success');
        }, 1000);
    }
    
    centerMap() {
        this.showNotification('Centering map on ambulans...', 'info');
        
        // Simulate map centering animation
        const mapView = document.getElementById('map-view');
        if (mapView) {
            mapView.style.transform = 'scale(1.1)';
            setTimeout(() => {
                mapView.style.transform = 'scale(1)';
            }, 500);
        }
    }
    
    handleStatusChange(btn) {
        const status = btn.dataset.status;
        
        // Remove active class from all status buttons
        document.querySelectorAll('.action-btn').forEach(b => {
            b.classList.remove('active');
        });
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Update current status
        this.currentStatus = status;
        
        // Update status display
        const statusElement = document.querySelector('.status-item:nth-child(1) .status-value');
        if (statusElement) {
            const statusTexts = {
                'available': '🟢 Available',
                'on-route': '🟡 Dalam Perjalanan',
                'emergency': '🔴 Emergency',
                'break': '⏸️ Break'
            };
            statusElement.textContent = statusTexts[status] || status;
        }
        
        // Show notification
        this.showNotification(`Status changed to: ${status}`, 'success');
        
        // Handle specific status changes
        switch (status) {
            case 'emergency':
                this.handleEmergencyStatus();
                break;
            case 'available':
                this.handleAvailableStatus();
                break;
            case 'break':
                this.handleBreakStatus();
                break;
        }
    }
    
    handleEmergencyStatus() {
        // Show emergency alert
        this.showNotification('EMERGENCY STATUS ACTIVATED!', 'error');
        
        // Flash emergency indicator
        const statusDot = document.querySelector('.status-dot');
        if (statusDot) {
            statusDot.style.animation = 'pulse 0.5s infinite';
            statusDot.style.background = 'var(--danger-red)';
        }
        
        // Update status text
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = 'Emergency';
            statusText.style.color = 'var(--danger-red)';
        }
    }
    
    handleAvailableStatus() {
        // Reset emergency indicators
        const statusDot = document.querySelector('.status-dot');
        if (statusDot) {
            statusDot.style.animation = 'pulse 2s infinite';
            statusDot.style.background = 'var(--success-green)';
        }
        
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = 'Online';
            statusText.style.color = 'var(--success-green)';
        }
    }
    
    handleBreakStatus() {
        this.showNotification('Ambulans on break - tracking paused', 'warning');
    }
    
    handleMobileControl(btn) {
        const label = btn.querySelector('.control-label').textContent;
        
        // Add touch feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
        
        switch (label) {
            case 'Update Location':
                this.refreshLocation();
                break;
            case 'Call Patient':
                this.showNotification('Calling patient...', 'info');
                break;
            case 'Emergency':
                this.handleEmergencyStatus();
                break;
        }
    }
    
    handleMapClick(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        this.showNotification(`Map clicked at ${x.toFixed(1)}%, ${y.toFixed(1)}%`, 'info');
    }
    
    animateAmbulansMovement() {
        // Continuous subtle movement animation
        setInterval(() => {
            if (this.isTracking && this.currentStatus === 'on-route') {
                const marker = document.getElementById('ambulans-marker');
                if (marker) {
                    // Add subtle shake animation
                    marker.style.animation = 'moveAmbulans 3s ease-in-out infinite';
                }
            }
        }, 3000);
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

// Global functions
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function resetPrototype() {
    if (confirm('Apakah Anda yakin ingin mereset tracking?')) {
        location.reload();
    }
}

// Initialize tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ambulansTracking = new AmbulansTracking();
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
    
    @keyframes moveAmbulans {
        0% {
            transform: translate(-50%, -50%);
        }
        25% {
            transform: translate(-48%, -52%);
        }
        50% {
            transform: translate(-52%, -48%);
        }
        75% {
            transform: translate(-48%, -48%);
        }
        100% {
            transform: translate(-50%, -50%);
        }
    }
`;
document.head.appendChild(style);
