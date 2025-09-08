# 🚀 eSIR 2.0 UCD Prototype

## 📋 **OVERVIEW**
Prototype terpisah untuk eSIR 2.0 berdasarkan UCD Design Mockup, tanpa mengganggu sistem aplikasi yang sudah ada.

## 🎯 **TUJUAN PROTOTYPE**
- **Validation** - Test design concepts dengan users
- **Stakeholder Buy-in** - Showcase potential improvements
- **User Testing** - Gather feedback sebelum implementation
- **Development Guide** - Reference untuk development team

## 🚀 **CARA MENJALANKAN**

### **1. Buka di Browser**
```
Buka file: prototype/index.html
Atau drag & drop file index.html ke browser
```

### **2. Menggunakan Local Server (Recommended)**
```bash
# Menggunakan Python
python -m http.server 8000

# Menggunakan Node.js
npx http-server

# Menggunakan PHP
php -S localhost:8000
```

### **3. Akses Prototype**
```
URL: http://localhost:8000
```

## 📱 **FITUR PROTOTYPE**

### **Screens yang Tersedia:**
- [x] **Login Screen** - Medical-themed login dengan enhanced UX
- [x] **Dashboard** - Enhanced dashboard dengan real-time metrics
- [ ] **Rujukan Form** - Step-by-step form (Coming Soon)
- [ ] **Mobile Dashboard** - Mobile-optimized dashboard (Coming Soon)
- [ ] **Ambulans Tracking** - Real-time GPS tracking (Coming Soon)
- [ ] **Emergency Alert** - Emergency alert system (Coming Soon)
- [ ] **Report Dashboard** - Interactive reports (Coming Soon)

### **Interactive Features:**
- [x] **Navigation** - Click untuk switch antar screen
- [x] **Login Form** - Functional login form
- [x] **Real-time Updates** - Simulated data updates
- [x] **Notifications** - Toast notifications
- [x] **Responsive Design** - Mobile-friendly layout

## 🎨 **DESIGN FEATURES**

### **Color Scheme:**
- **Primary Blue:** #2563EB (Trust, Professionalism)
- **Secondary Green:** #059669 (Success, Health)
- **Accent Orange:** #EA580C (Warning, Attention)
- **Danger Red:** #DC2626 (Emergency, Critical)
- **Success Green:** #16A34A (Complete, Safe)

### **Typography:**
- **Font:** Inter (Clean, Modern, Highly Readable)
- **Sizes:** 12px - 30px responsive scale
- **Weights:** 300, 400, 500, 600, 700

### **Components:**
- **Cards** - Modern card-based layout
- **Buttons** - Interactive dengan hover effects
- **Forms** - Clean form styling dengan validation
- **Navigation** - Intuitive navigation system
- **Metrics** - Visual metrics dengan icons

## 📊 **MOCK DATA**

### **Users:**
- **Admin Pusat** - Full system access
- **Admin Faskes** - Rujukan dan pasien management
- **Sopir Ambulans** - Tracking dan status updates

### **Sample Data:**
- **Rujukan:** 3 sample rujukan dengan berbagai status
- **Ambulans:** 4 ambulans dengan status berbeda
- **Metrics:** Real-time metrics dengan trend indicators

## 🔄 **INTERACTIONS**

### **Navigation:**
- Click pada nav items untuk switch screen
- Active state menunjukkan screen yang sedang aktif
- Smooth transitions antar screen

### **Login:**
- Functional login form
- Validation untuk required fields
- Success notification setelah login
- Auto-redirect ke dashboard

### **Dashboard:**
- Real-time metrics updates
- Clickable metric cards
- Interactive quick actions
- Live activity feed
- Ambulans status monitoring

### **Notifications:**
- Toast notifications untuk user actions
- Different types: success, error, warning, info
- Auto-dismiss setelah 3 detik
- Smooth animations

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints:**
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### **Mobile Features:**
- Touch-optimized controls
- Responsive navigation
- Mobile-friendly layouts
- Optimized typography

## 🧪 **TESTING SCENARIOS**

### **Usability Testing:**
1. **Login Flow** - Can users login successfully?
2. **Navigation** - Is navigation intuitive?
3. **Dashboard** - Can users understand metrics?
4. **Mobile Experience** - Does mobile work well?
5. **Interactions** - Are interactions smooth?

### **User Journeys:**
1. **Admin Faskes:** Login → Dashboard → View Metrics → Quick Actions
2. **Sopir Ambulans:** Login → Dashboard → View Status → Update Location
3. **Admin Pusat:** Login → Dashboard → Monitor System → Generate Reports

## 📋 **FEEDBACK COLLECTION**

### **In-App Feedback:**
- Notification system untuk user actions
- Visual feedback untuk interactions
- Error handling dengan helpful messages

### **External Feedback:**
- User interviews
- Usability testing sessions
- Stakeholder reviews
- Survey integration

## 🛠️ **TECHNICAL DETAILS**

### **Technologies:**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling dengan variables
- **JavaScript ES6+** - Interactive functionality
- **Responsive Design** - Mobile-first approach

### **Browser Support:**
- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

### **Performance:**
- **Fast Loading** - Optimized assets
- **Smooth Animations** - CSS transitions
- **Responsive** - Mobile-optimized
- **Accessible** - WCAG compliant

## 📞 **SUPPORT & FEEDBACK**

### **Issues & Bugs:**
- Report issues via GitHub Issues
- Include browser version dan steps to reproduce
- Screenshots jika diperlukan

### **Feature Requests:**
- Submit feature requests via GitHub Issues
- Include use case dan expected behavior
- Priority level jika applicable

### **General Feedback:**
- Email: [your-email@domain.com]
- GitHub: [your-github-username]
- Documentation: [link-to-docs]

## 🔄 **UPDATES & VERSIONING**

### **Version History:**
- **v1.0** - Initial prototype dengan login dan dashboard
- **v1.1** - Planned: Rujukan form screen
- **v1.2** - Planned: Mobile dashboard
- **v1.3** - Planned: Tracking screen
- **v1.4** - Planned: Emergency alert
- **v1.5** - Planned: Reports dashboard

### **Update Schedule:**
- **Weekly** - Bug fixes dan minor improvements
- **Bi-weekly** - New screens dan features
- **Monthly** - Major updates dan new functionality

---

*Prototype ini akan diupdate berdasarkan feedback dari stakeholders dan hasil user testing.*
