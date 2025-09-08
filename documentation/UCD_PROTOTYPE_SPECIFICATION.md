# 🚀 UCD PROTOTYPE SPECIFICATION - eSIR 2.0

## 📋 **OVERVIEW**
Spesifikasi prototype terpisah untuk semua screen berdasarkan UCD Design Mockup, tanpa mengganggu sistem aplikasi eSIR2.0 yang sudah ada.

## 🎯 **PROTOTYPE OBJECTIVES**
- **Validation** - Test design concepts dengan users
- **Stakeholder Buy-in** - Showcase potential improvements
- **User Testing** - Gather feedback sebelum implementation
- **Development Guide** - Reference untuk development team

## 📁 **PROTOTYPE STRUCTURE**

### **File Organization:**
```
prototype/
├── index.html                 # Main prototype entry point
├── css/
│   ├── prototype.css         # Prototype-specific styles
│   ├── components.css        # Component styles
│   └── responsive.css        # Mobile responsive styles
├── js/
│   ├── prototype.js          # Prototype functionality
│   ├── navigation.js         # Navigation logic
│   └── interactions.js       # User interactions
├── assets/
│   ├── icons/               # Icon assets
│   ├── images/              # Image assets
│   └── fonts/               # Font files
└── screens/
    ├── login.html           # Login screen
    ├── dashboard.html       # Dashboard screen
    ├── rujukan-form.html    # Rujukan form screen
    ├── mobile-dashboard.html # Mobile dashboard
    ├── tracking.html        # Ambulans tracking
    ├── emergency.html       # Emergency alert
    └── reports.html         # Report dashboard
```

## 🎨 **PROTOTYPE FEATURES**

### **Interactive Elements:**
- [ ] Clickable navigation
- [ ] Form interactions
- [ ] Status updates
- [ ] Modal dialogs
- [ ] Responsive behavior
- [ ] Animation effects

### **Data Simulation:**
- [ ] Mock data untuk all screens
- [ ] Realistic user scenarios
- [ ] Dynamic content updates
- [ ] Status changes
- [ ] Time-based updates

## 📱 **SCREEN SPECIFICATIONS**

### **1. Login Screen (login.html)**
**Features:**
- Medical-themed branding
- Form validation
- Remember me functionality
- Help links
- Responsive design

**Interactive Elements:**
- Login form submission
- Password visibility toggle
- Forgot password modal
- Help modal

### **2. Dashboard (dashboard.html)**
**Features:**
- Real-time metrics cards
- Activity feed
- Urgent alerts
- Quick actions
- Ambulans status

**Interactive Elements:**
- Metric card hover effects
- Alert dismissal
- Quick action buttons
- Navigation menu
- Real-time updates simulation

### **3. Rujukan Form (rujukan-form.html)**
**Features:**
- Step-by-step form
- Progress indicator
- Form validation
- Auto-save
- Help tips

**Interactive Elements:**
- Step navigation
- Form field interactions
- Validation feedback
- Save progress
- Submit form

### **4. Mobile Dashboard (mobile-dashboard.html)**
**Features:**
- Mobile-optimized layout
- Touch-friendly controls
- Bottom navigation
- Swipe gestures
- Emergency alerts

**Interactive Elements:**
- Touch interactions
- Swipe navigation
- Bottom tab switching
- Pull-to-refresh
- Emergency button

### **5. Ambulans Tracking (tracking.html)**
**Features:**
- GPS map integration
- Real-time location
- Status updates
- ETA calculation
- Emergency controls

**Interactive Elements:**
- Map interactions
- Status change buttons
- Location updates
- Emergency alerts
- Contact buttons

### **6. Emergency Alert (emergency.html)**
**Features:**
- High-contrast design
- Pulsing animations
- Complete patient info
- Ambulans assignment
- Countdown timer

**Interactive Elements:**
- Alert acknowledgment
- Ambulans assignment
- Emergency actions
- Timer interactions
- Status updates

### **7. Report Dashboard (reports.html)**
**Features:**
- Interactive charts
- Date range selection
- Export options
- Real-time data
- Facility comparison

**Interactive Elements:**
- Chart interactions
- Date picker
- Export buttons
- Filter controls
- Data drill-down

## 🛠️ **TECHNICAL IMPLEMENTATION**

### **HTML Structure:**
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>eSIR 2.0 - UCD Prototype</title>
    <link rel="stylesheet" href="css/prototype.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
    <!-- Screen content -->
    <script src="js/prototype.js"></script>
    <script src="js/navigation.js"></script>
    <script src="js/interactions.js"></script>
</body>
</html>
```

### **CSS Framework:**
```css
/* Prototype-specific styles */
:root {
    --primary-blue: #2563EB;
    --secondary-green: #059669;
    --accent-orange: #EA580C;
    --danger-red: #DC2626;
    --warning-yellow: #D97706;
    --success-green: #16A34A;
    --neutral-gray: #6B7280;
    --background: #F8FAFC;
}

/* Component styles */
.card { /* Card component */ }
.button { /* Button component */ }
.form-field { /* Form field component */ }
.navigation { /* Navigation component */ }
```

### **JavaScript Functionality:**
```javascript
// Prototype functionality
class PrototypeApp {
    constructor() {
        this.currentScreen = 'login';
        this.mockData = this.loadMockData();
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupInteractions();
        this.simulateRealTimeUpdates();
    }
    
    // Navigation methods
    navigateTo(screen) { /* Navigation logic */ }
    
    // Interaction methods
    setupInteractions() { /* User interactions */ }
    
    // Data simulation
    simulateRealTimeUpdates() { /* Mock data updates */ }
}
```

## 📊 **MOCK DATA STRUCTURE**

### **User Data:**
```javascript
const mockUsers = {
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
};
```

### **Rujukan Data:**
```javascript
const mockRujukan = [
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
    }
];
```

### **Ambulans Data:**
```javascript
const mockAmbulans = [
    {
        id: "001",
        driver: "Dr. Ahmad Suryadi",
        status: "available",
        location: "Jl. Merdeka No. 123",
        eta: "5 menit",
        speed: "45 km/h"
    }
];
```

## 🎯 **PROTOTYPE WORKFLOWS**

### **User Journey 1: Admin Faskes**
1. **Login** → Dashboard → Create Rujukan → Submit
2. **View Status** → Update Status → Generate Report
3. **Emergency Case** → Alert → Assign Ambulans

### **User Journey 2: Sopir Ambulans**
1. **Mobile Login** → Dashboard → Start Tracking
2. **Update Location** → Change Status → Complete Rujukan
3. **Emergency** → Emergency Mode → Contact Hospital

### **User Journey 3: Admin Pusat**
1. **Login** → Dashboard → Monitor System
2. **View Reports** → Analyze Data → Export
3. **Manage Users** → System Settings → Notifications

## 📱 **RESPONSIVE BEHAVIOR**

### **Breakpoints:**
```css
/* Mobile */
@media (max-width: 768px) {
    .desktop-only { display: none; }
    .mobile-only { display: block; }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
    .tablet-layout { /* Tablet specific styles */ }
}

/* Desktop */
@media (min-width: 1025px) {
    .desktop-layout { /* Desktop specific styles */ }
}
```

### **Mobile Features:**
- Touch-optimized controls
- Swipe navigation
- Bottom tab bar
- Pull-to-refresh
- Voice input simulation

## 🔄 **INTERACTION PATTERNS**

### **Navigation:**
- Click/tap untuk navigation
- Breadcrumb navigation
- Back button functionality
- Menu toggle (mobile)

### **Forms:**
- Real-time validation
- Auto-save functionality
- Progress indicators
- Error handling

### **Data Display:**
- Hover effects
- Click interactions
- Sort functionality
- Filter controls

## 📋 **TESTING SCENARIOS**

### **Usability Testing:**
1. **Task Completion** - Can users complete critical tasks?
2. **Navigation** - Is navigation intuitive?
3. **Mobile Experience** - Does mobile work well?
4. **Emergency Flow** - Is emergency process clear?
5. **Form Usability** - Are forms easy to use?

### **A/B Testing:**
1. **Color Schemes** - Test different color combinations
2. **Layout Options** - Test different layouts
3. **Button Styles** - Test different button designs
4. **Navigation Patterns** - Test different navigation

## 🚀 **DEPLOYMENT STRATEGY**

### **Hosting Options:**
- **GitHub Pages** - Free hosting untuk prototype
- **Netlify** - Easy deployment dengan drag & drop
- **Vercel** - Fast deployment untuk testing
- **Local Server** - Development testing

### **Access Control:**
- **Password Protection** - Protect prototype access
- **IP Whitelisting** - Restrict access to specific IPs
- **Time-based Access** - Limit access duration
- **User Authentication** - Login required untuk access

## 📊 **ANALYTICS & TRACKING**

### **User Behavior:**
- Page views dan navigation
- Click tracking
- Form interactions
- Time spent on screens
- User journey analysis

### **Performance Metrics:**
- Page load times
- Interaction response times
- Mobile performance
- Error rates
- User satisfaction scores

## 📞 **STAKEHOLDER FEEDBACK**

### **Feedback Collection:**
- **In-app Feedback** - Feedback form dalam prototype
- **User Interviews** - Structured interviews
- **Usability Testing** - Task-based testing
- **Survey Integration** - Post-interaction surveys

### **Feedback Analysis:**
- **Quantitative Data** - Metrics dan statistics
- **Qualitative Data** - User comments dan suggestions
- **Priority Ranking** - Impact vs. effort analysis
- **Implementation Planning** - Roadmap berdasarkan feedback

---

*Prototype ini akan diupdate berdasarkan feedback dari stakeholders dan hasil user testing.*
