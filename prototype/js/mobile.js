// eSIR 2.0 UCD Prototype - Mobile JavaScript

class MobileDashboard {
    constructor() {
        this.isRefreshing = false;
        this.startY = 0;
        this.currentY = 0;
        this.pullThreshold = 80;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupPullToRefresh();
        this.setupSwipeGestures();
        this.simulateRealTimeUpdates();
        this.initializeData();
    }
    
    setupEventListeners() {
        // Bottom navigation
        document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavigation(e.currentTarget);
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.currentTarget);
            });
        });
        
        // Activity items
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleActivityClick(e.currentTarget);
            });
        });
        
        // Ambulans items
        document.querySelectorAll('.ambulans-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleAmbulansClick(e.currentTarget);
            });
        });
        
        // Emergency alert
        const emergencyAlert = document.querySelector('.emergency-alert .alert-action');
        if (emergencyAlert) {
            emergencyAlert.addEventListener('click', () => {
                this.handleEmergencyAlert();
            });
        }
        
        // Notification badge
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            notificationBadge.addEventListener('click', () => {
                this.showNotifications();
            });
        }
        
        // User avatar
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => {
                this.showUserMenu();
            });
        }
        
        // Stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleStatClick(e.currentTarget);
            });
        });
    }
    
    setupPullToRefresh() {
        const main = document.querySelector('.mobile-main');
        const pullRefresh = document.getElementById('pull-refresh');
        
        if (!main || !pullRefresh) return;
        
        main.addEventListener('touchstart', (e) => {
            this.startY = e.touches[0].clientY;
        }, { passive: true });
        
        main.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0) {
                this.currentY = e.touches[0].clientY;
                const pullDistance = this.currentY - this.startY;
                
                if (pullDistance > 0 && pullDistance < this.pullThreshold) {
                    pullRefresh.style.top = `${Math.min(pullDistance - 60, 0)}px`;
                }
            }
        }, { passive: true });
        
        main.addEventListener('touchend', () => {
            const pullDistance = this.currentY - this.startY;
            
            if (pullDistance > this.pullThreshold && window.scrollY === 0) {
                this.triggerRefresh();
            } else {
                pullRefresh.style.top = '-60px';
            }
            
            this.startY = 0;
            this.currentY = 0;
        }, { passive: true });
    }
    
    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.handleSwipeLeft();
                } else {
                    this.handleSwipeRight();
                }
            }
            
            // Vertical swipe
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
                if (diffY > 0) {
                    this.handleSwipeUp();
                } else {
                    this.handleSwipeDown();
                }
            }
        }, { passive: true });
    }
    
    handleNavigation(navItem) {
        // Remove active class from all nav items
        document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        navItem.classList.add('active');
        
        // Get navigation target
        const navLabel = navItem.querySelector('.nav-label').textContent;
        
        // Handle navigation
        switch (navLabel) {
            case 'Home':
                this.showNotification('Already on Home', 'info');
                break;
            case 'Rujukan':
                window.open('rujukan-form.html', '_blank');
                break;
            case 'Tracking':
                this.showNotification('Opening Tracking...', 'info');
                break;
            case 'Reports':
                this.showNotification('Opening Reports...', 'info');
                break;
            case 'Settings':
                this.showNotification('Opening Settings...', 'info');
                break;
        }
    }
    
    handleQuickAction(btn) {
        const actionLabel = btn.querySelector('.action-label').textContent;
        
        // Add touch feedback
        btn.classList.add('touch-feedback');
        setTimeout(() => {
            btn.classList.remove('touch-feedback');
        }, 150);
        
        switch (actionLabel) {
            case 'New Rujukan':
                window.open('rujukan-form.html', '_blank');
                break;
            case 'Search':
                this.showSearchModal();
                break;
            case 'Reports':
                this.showNotification('Opening Reports...', 'info');
                break;
            case 'Settings':
                this.showNotification('Opening Settings...', 'info');
                break;
        }
    }
    
    handleActivityClick(activityItem) {
        const title = activityItem.querySelector('.activity-title').textContent;
        const status = activityItem.querySelector('.activity-status').textContent;
        
        this.showNotification(`Opening ${title} - ${status}`, 'info');
        
        // Add touch feedback
        activityItem.classList.add('touch-feedback');
        setTimeout(() => {
            activityItem.classList.remove('touch-feedback');
        }, 150);
    }
    
    handleAmbulansClick(ambulansItem) {
        const name = ambulansItem.querySelector('.ambulans-name').textContent;
        const status = ambulansItem.querySelector('.ambulans-status-text').textContent;
        
        this.showNotification(`Opening ${name} - ${status}`, 'info');
        
        // Add touch feedback
        ambulansItem.classList.add('touch-feedback');
        setTimeout(() => {
            ambulansItem.classList.remove('touch-feedback');
        }, 150);
    }
    
    handleStatClick(statCard) {
        const label = statCard.querySelector('.stat-label').textContent;
        const value = statCard.querySelector('.stat-value').textContent;
        
        this.showNotification(`Viewing details for ${label}: ${value}`, 'info');
        
        // Add touch feedback
        statCard.classList.add('touch-feedback');
        setTimeout(() => {
            statCard.classList.remove('touch-feedback');
        }, 150);
    }
    
    handleEmergencyAlert() {
        this.showNotification('Opening Emergency Cases...', 'warning');
    }
    
    showNotifications() {
        this.showNotification('Opening Notifications...', 'info');
    }
    
    showUserMenu() {
        this.showNotification('Opening User Menu...', 'info');
    }
    
    showSearchModal() {
        this.showNotification('Opening Search...', 'info');
    }
    
    triggerRefresh() {
        if (this.isRefreshing) return;
        
        this.isRefreshing = true;
        const pullRefresh = document.getElementById('pull-refresh');
        
        // Show refresh indicator
        pullRefresh.classList.add('show');
        pullRefresh.querySelector('.refresh-text').textContent = 'Refreshing...';
        
        // Simulate refresh
        setTimeout(() => {
            this.refreshData();
            this.isRefreshing = false;
            
            // Hide refresh indicator
            pullRefresh.classList.remove('show');
            pullRefresh.querySelector('.refresh-text').textContent = 'Pull to refresh';
            pullRefresh.style.top = '-60px';
            
            this.showNotification('Data refreshed!', 'success');
        }, 2000);
    }
    
    refreshData() {
        // Update stats with new data
        this.updateStats();
        
        // Update activity feed
        this.updateActivityFeed();
        
        // Update ambulans status
        this.updateAmbulansStatus();
    }
    
    updateStats() {
        const stats = [
            { value: 152, change: '+2' },
            { value: 27, change: '+2' },
            { value: 6, change: '-2' },
            { value: 119, change: '+2' }
        ];
        
        document.querySelectorAll('.stat-value').forEach((el, index) => {
            if (stats[index]) {
                el.textContent = stats[index].value;
            }
        });
        
        document.querySelectorAll('.stat-change').forEach((el, index) => {
            if (stats[index]) {
                el.textContent = `↗️ ${stats[index].change}%`;
            }
        });
    }
    
    updateActivityFeed() {
        const activities = [
            {
                id: 1235,
                title: 'Rujukan #1235 - RS B',
                subtitle: 'Status: Dalam Perjalanan',
                time: '14:45',
                status: 'urgent'
            },
            {
                id: 1234,
                title: 'Rujukan #1234 - RS A',
                subtitle: 'Status: Dalam Perjalanan',
                time: '14:30',
                status: 'urgent'
            },
            {
                id: 1233,
                title: 'Rujukan #1233 - Puskesmas B',
                subtitle: 'Status: Selesai',
                time: '14:15',
                status: 'success'
            }
        ];
        
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = '';
            
            activities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <div class="activity-icon ${activity.status}">${this.getActivityIcon(activity.status)}</div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-subtitle">${activity.subtitle}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                    <div class="activity-status ${activity.status}">${this.getStatusText(activity.status)}</div>
                `;
                
                activityItem.addEventListener('click', () => {
                    this.handleActivityClick(activityItem);
                });
                
                activityList.appendChild(activityItem);
            });
        }
    }
    
    updateAmbulansStatus() {
        const ambulansData = [
            {
                id: '001',
                status: 'available',
                location: 'Jl. Merdeka No. 123',
                eta: '5 min'
            },
            {
                id: '002',
                status: 'on-route',
                location: 'Jl. Sudirman No. 456',
                eta: '12 min'
            },
            {
                id: '003',
                status: 'maintenance',
                location: 'Workshop',
                eta: 'N/A'
            }
        ];
        
        const ambulansList = document.querySelector('.ambulans-list');
        if (ambulansList) {
            ambulansList.innerHTML = '';
            
            ambulansData.forEach(ambulans => {
                const ambulansItem = document.createElement('div');
                ambulansItem.className = `ambulans-item ${ambulans.status}`;
                ambulansItem.innerHTML = `
                    <div class="ambulans-icon">${this.getAmbulansIcon(ambulans.status)}</div>
                    <div class="ambulans-info">
                        <div class="ambulans-name">Ambulans ${ambulans.id}</div>
                        <div class="ambulans-status-text">${this.getAmbulansStatusText(ambulans.status)}</div>
                        <div class="ambulans-location">${ambulans.location}</div>
                    </div>
                    <div class="ambulans-eta">${ambulans.eta}</div>
                `;
                
                ambulansItem.addEventListener('click', () => {
                    this.handleAmbulansClick(ambulansItem);
                });
                
                ambulansList.appendChild(ambulansItem);
            });
        }
    }
    
    getActivityIcon(status) {
        const icons = {
            'urgent': '🚑',
            'success': '✅',
            'pending': '⏳'
        };
        return icons[status] || '📋';
    }
    
    getStatusText(status) {
        const texts = {
            'urgent': 'Urgent',
            'success': 'Complete',
            'pending': 'Pending'
        };
        return texts[status] || status;
    }
    
    getAmbulansIcon(status) {
        const icons = {
            'available': '🟢',
            'on-route': '🟡',
            'maintenance': '🔴'
        };
        return icons[status] || '⚪';
    }
    
    getAmbulansStatusText(status) {
        const texts = {
            'available': 'Available',
            'on-route': 'On Route',
            'maintenance': 'Maintenance'
        };
        return texts[status] || status;
    }
    
    handleSwipeLeft() {
        this.showNotification('Swipe Left detected', 'info');
    }
    
    handleSwipeRight() {
        this.showNotification('Swipe Right detected', 'info');
    }
    
    handleSwipeUp() {
        this.showNotification('Swipe Up detected', 'info');
    }
    
    handleSwipeDown() {
        this.showNotification('Swipe Down detected', 'info');
    }
    
    simulateRealTimeUpdates() {
        // Update data every 30 seconds
        setInterval(() => {
            this.updateStats();
            this.updateActivityFeed();
            this.updateAmbulansStatus();
        }, 30000);
        
        // Simulate emergency alerts
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every 30 seconds
                this.showEmergencyAlert();
            }
        }, 30000);
    }
    
    showEmergencyAlert() {
        const emergencyAlert = document.querySelector('.emergency-alert');
        if (emergencyAlert) {
            emergencyAlert.style.animation = 'pulse 1s ease-in-out 3';
            
            setTimeout(() => {
                emergencyAlert.style.animation = 'pulse 2s infinite';
            }, 3000);
        }
        
        this.showNotification('New Emergency Alert!', 'warning');
    }
    
    initializeData() {
        // Load initial data
        this.updateStats();
        this.updateActivityFeed();
        this.updateAmbulansStatus();
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `mobile-notification notification-${type}`;
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
            left: 50%;
            transform: translateX(-50%);
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideInDown 0.3s ease-out;
            max-width: 90%;
            text-align: center;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease-in';
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
    if (confirm('Apakah Anda yakin ingin mereset mobile dashboard?')) {
        location.reload();
    }
}

// Initialize mobile dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mobileDashboard = new MobileDashboard();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
    
    .mobile-notification {
        font-size: 14px;
        font-weight: 500;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .notification-icon {
        font-size: 16px;
    }
    
    .notification-message {
        flex: 1;
    }
`;
document.head.appendChild(style);
