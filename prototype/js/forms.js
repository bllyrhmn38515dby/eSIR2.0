// eSIR 2.0 UCD Prototype - Form JavaScript

class RujukanForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupAutoSave();
        this.updateProgress();
    }
    
    setupEventListeners() {
        // Navigation buttons
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitForm());
        }
        
        // Step navigation
        document.querySelectorAll('.step').forEach(step => {
            step.addEventListener('click', (e) => {
                const stepNumber = parseInt(e.currentTarget.dataset.step);
                if (stepNumber <= this.currentStep) {
                    this.goToStep(stepNumber);
                }
            });
        });
        
        // Form validation
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.saveFormData());
        });
        
        // Priority change handler
        const prioritySelect = document.getElementById('priority');
        if (prioritySelect) {
            prioritySelect.addEventListener('change', (e) => {
                this.updatePriorityIndicator(e.target.value);
            });
        }
    }
    
    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveFormData();
            this.showAutoSaveIndicator();
        }, 30000);
        
        // Auto-save on form change
        document.addEventListener('input', () => {
            this.saveFormData();
        });
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveFormData();
            this.currentStep++;
            this.updateStep();
            this.updateProgress();
            this.updateNavigation();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStep();
            this.updateProgress();
            this.updateNavigation();
        }
    }
    
    goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
            this.currentStep = stepNumber;
            this.updateStep();
            this.updateProgress();
            this.updateNavigation();
        }
    }
    
    updateStep() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Update review data if on step 3
        if (this.currentStep === 3) {
            this.updateReviewData();
        }
    }
    
    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progress = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }
    
    updateNavigation() {
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        // Show/hide buttons based on current step
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        if (nextBtn) {
            nextBtn.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
        }
        
        if (submitBtn) {
            submitBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
        }
        
        // Update button text
        if (nextBtn) {
            nextBtn.textContent = this.currentStep === this.totalSteps - 1 ? 'Review →' : 'Next Step →';
        }
    }
    
    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return false;
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields', 'error');
        }
        
        return isValid;
    }
    
    validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        // Remove existing error state
        formGroup.classList.remove('error');
        
        // Validate field
        let isValid = true;
        let errorText = '';
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorText = 'This field is required';
        } else if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
            isValid = false;
            errorText = 'Please enter a valid email address';
        } else if (field.type === 'tel' && field.value && !this.isValidPhone(field.value)) {
            isValid = false;
            errorText = 'Please enter a valid phone number';
        } else if (field.type === 'number' && field.value) {
            const min = field.getAttribute('min');
            const max = field.getAttribute('max');
            const value = parseInt(field.value);
            
            if (min && value < parseInt(min)) {
                isValid = false;
                errorText = `Value must be at least ${min}`;
            } else if (max && value > parseInt(max)) {
                isValid = false;
                errorText = `Value must be at most ${max}`;
            }
        }
        
        // Show error if invalid
        if (!isValid) {
            formGroup.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = errorText;
            }
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    saveFormData() {
        // Collect all form data
        const formData = {};
        
        document.querySelectorAll('input, select, textarea').forEach(field => {
            if (field.id) {
                formData[field.id] = field.value;
            }
        });
        
        // Save to localStorage
        localStorage.setItem('rujukanFormData', JSON.stringify(formData));
        this.formData = formData;
    }
    
    loadFormData() {
        const savedData = localStorage.getItem('rujukanFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            Object.keys(formData).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = formData[fieldId];
                }
            });
            
            this.formData = formData;
        }
    }
    
    updateReviewData() {
        const reviewFields = [
            'patient-name', 'patient-age', 'patient-gender', 'patient-id',
            'patient-address', 'patient-phone', 'diagnosis', 'symptoms',
            'priority', 'destination', 'allergies', 'medications'
        ];
        
        reviewFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const reviewElement = document.getElementById(`review-${fieldId.replace('patient-', '').replace('-', '-')}`);
            
            if (field && reviewElement) {
                let value = field.value || '-';
                
                // Format specific fields
                if (fieldId === 'priority') {
                    value = this.formatPriority(value);
                } else if (fieldId === 'destination') {
                    value = this.formatDestination(value);
                }
                
                reviewElement.textContent = value;
            }
        });
    }
    
    formatPriority(priority) {
        const priorities = {
            'normal': 'Normal',
            'urgent': 'Urgent',
            'critical': 'Critical'
        };
        return priorities[priority] || priority;
    }
    
    formatDestination(destination) {
        const destinations = {
            'rs-a': 'RS A - Jakarta',
            'rs-b': 'RS B - Bandung',
            'rs-c': 'RS C - Surabaya'
        };
        return destinations[destination] || destination;
    }
    
    updatePriorityIndicator(priority) {
        // Remove existing priority indicators
        document.querySelectorAll('.priority-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        if (priority) {
            const prioritySelect = document.getElementById('priority');
            if (prioritySelect) {
                const indicator = document.createElement('span');
                indicator.className = `priority-indicator priority-${priority}`;
                indicator.textContent = this.formatPriority(priority);
                
                prioritySelect.parentNode.appendChild(indicator);
            }
        }
    }
    
    submitForm() {
        if (this.validateCurrentStep()) {
            this.saveFormData();
            
            // Show loading state
            const formContainer = document.querySelector('.rujukan-form-container');
            formContainer.classList.add('form-loading');
            
            // Simulate form submission
            setTimeout(() => {
                formContainer.classList.remove('form-loading');
                this.showSuccessState();
            }, 2000);
        }
    }
    
    showSuccessState() {
        const formContainer = document.querySelector('.rujukan-form-container');
        formContainer.innerHTML = `
            <div class="form-success">
                <div class="form-success-icon">✅</div>
                <h2>Rujukan Berhasil Dikirim!</h2>
                <p>Rujukan pasien telah berhasil dikirim ke sistem. Tim medis akan segera memproses rujukan ini.</p>
                <div class="success-details">
                    <div class="detail-item">
                        <strong>Nomor Rujukan:</strong> #${this.generateRujukanNumber()}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span class="status-pending">Menunggu Konfirmasi</span>
                    </div>
                    <div class="detail-item">
                        <strong>Estimasi Waktu:</strong> 15-30 menit
                    </div>
                </div>
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="window.location.href='../index.html'">
                        Kembali ke Dashboard
                    </button>
                    <button class="btn btn-secondary" onclick="location.reload()">
                        Buat Rujukan Baru
                    </button>
                </div>
            </div>
        `;
        
        this.showNotification('Rujukan berhasil dikirim!', 'success');
    }
    
    generateRujukanNumber() {
        const timestamp = Date.now();
        return `RUJ${timestamp.toString().slice(-6)}`;
    }
    
    showAutoSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'auto-save-indicator';
        indicator.textContent = '💾 Auto-saved';
        
        document.body.appendChild(indicator);
        
        // Show indicator
        setTimeout(() => {
            indicator.classList.add('show');
        }, 100);
        
        // Hide indicator
        setTimeout(() => {
            indicator.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(indicator);
            }, 300);
        }, 2000);
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
                document.body.removeChild(notification);
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
    if (confirm('Apakah Anda yakin ingin mereset form?')) {
        localStorage.removeItem('rujukanFormData');
        location.reload();
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rujukanForm = new RujukanForm();
    window.rujukanForm.loadFormData();
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
    
    .success-details {
        background: var(--background);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        margin: var(--spacing-xl) 0;
        text-align: left;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) 0;
        border-bottom: 1px solid var(--light-gray);
    }
    
    .detail-item:last-child {
        border-bottom: none;
    }
    
    .status-pending {
        color: var(--warning-yellow);
        font-weight: 600;
    }
    
    .success-actions {
        display: flex;
        gap: var(--spacing-md);
        justify-content: center;
        margin-top: var(--spacing-xl);
    }
    
    @media (max-width: 768px) {
        .success-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);
