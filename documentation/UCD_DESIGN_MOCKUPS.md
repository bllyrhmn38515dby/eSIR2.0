# 🎨 DESIGN MOCKUPS - eSIR 2.0

## 📋 **OVERVIEW**
Design mockups untuk peningkatan UI/UX eSIR 2.0 berdasarkan UCD requirements, tanpa mengubah design existing yang sudah ada. Mockups ini menunjukkan potential improvements yang bisa diimplementasikan secara bertahap.

## 🎯 **DESIGN PRINCIPLES**
- **Non-Disruptive** - Tidak mengubah design existing
- **Progressive Enhancement** - Peningkatan bertahap
- **Backward Compatible** - Tetap kompatibel dengan sistem lama
- **User-Centric** - Berdasarkan feedback dari kuisioner UCD

## 📱 **MOCKUP 1: LOGIN PAGE ENHANCEMENT**

### **Current State (Existing):**
```
[Logo eSIR]                    [User Icon]
┌─────────────────────────────────────────┐
│                                         │
│  Username: [________________]           │
│  Password: [________________]           │
│                                         │
│  [Login Button]                         │
│                                         │
└─────────────────────────────────────────┘
```

### **Enhanced Design (Proposed):**
```
┌─────────────────────────────────────────────────────────┐
│  🏥 eSIR 2.0 - Sistem Informasi Rujukan                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  👤 Username                                    │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ admin@faskes.com                        │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │  🔒 Password                                    │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ •••••••••••••••••••••••••••••••••••••• │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │  [ ] Remember Me                                │   │
│  │                                                 │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │           🔐 LOGIN                       │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │  Forgot Password? | Need Help?                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  © 2024 eSIR 2.0 - All Rights Reserved                 │
└─────────────────────────────────────────────────────────┘
```

**Enhancement Features:**
- Medical-themed branding dengan hospital icon
- Clear visual hierarchy
- Better form styling dengan icons
- Helpful links untuk support
- Professional footer

## 📊 **MOCKUP 2: DASHBOARD IMPROVEMENT**

### **Current State (Existing):**
```
┌─────────────────────────────────────────────────────────┐
│  Dashboard | Rujukan | Pasien | Laporan | Settings     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Total Rujukan: 150                                     │
│  Rujukan Hari Ini: 25                                   │
│  Rujukan Pending: 8                                      │
│                                                         │
│  [Recent Rujukan List]                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### **Enhanced Design (Proposed):**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🏥 eSIR 2.0                    🔔 3    👤 Admin Pusat    ⚙️ Logout    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📊 Dashboard Overview                                                  │
│                                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 📋 Total    │ │ 🚑 Today    │ │ ⏳ Pending  │ │ ✅ Complete │      │
│  │ Rujukan     │ │ Rujukan     │ │ Rujukan     │ │ Rujukan     │      │
│  │             │ │             │ │             │ │             │      │
│  │     150     │ │      25     │ │       8     │ │     117     │      │
│  │             │ │             │ │             │ │             │      │
│  │ ↗️ +12%     │ │ ↗️ +5%      │ │ ↘️ -3%     │ │ ↗️ +8%     │      │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                                         │
│  📈 Recent Activity                    🚨 Urgent Alerts                │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ • Rujukan #1234 - RS A          │  │ ⚠️ 2 Emergency Cases        │  │
│  │   Status: Dalam Perjalanan      │  │ 🚑 1 Ambulans Delay         │  │
│  │   Time: 14:30                   │  │ 📋 3 Pending Approval       │  │
│  │                                 │  │                             │  │
│  │ • Rujukan #1233 - Puskesmas B   │  │ [View All Alerts]           │  │
│  │   Status: Selesai               │  │                             │  │
│  │   Time: 14:15                   │  │                             │  │
│  │                                 │  │                             │  │
│  │ • Rujukan #1232 - Klinik C      │  │                             │  │
│  │   Status: Menunggu              │  │                             │  │
│  │   Time: 14:00                   │  │                             │  │
│  └─────────────────────────────────┘  └─────────────────────────────┘  │
│                                                                         │
│  🚑 Ambulans Status                    📊 Quick Actions                │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ 🟢 Ambulans 001 - Available     │  │ [📋 New Rujukan]            │  │
│  │ 🟡 Ambulans 002 - On Route      │  │ [🔍 Search Pasien]          │  │
│  │ 🔴 Ambulans 003 - Maintenance   │  │ [📊 Generate Report]        │  │
│  │ 🟢 Ambulans 004 - Available     │  │ [⚙️ System Settings]        │  │
│  └─────────────────────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Enhancement Features:**
- Visual cards dengan icons dan colors
- Status indicators dengan color coding
- Urgent alerts section
- Quick actions panel
- Better data visualization
- Real-time updates indicators

## 📝 **MOCKUP 3: RUJUKAN FORM ENHANCEMENT**

### **Current State (Existing):**
```
┌─────────────────────────────────────────────────────────┐
│  Form Rujukan                                           │
├─────────────────────────────────────────────────────────┤
│  Nama Pasien: [________________]                        │
│  Umur: [____] Jenis Kelamin: [Dropdown]                │
│  Alamat: [________________]                             │
│  Diagnosa: [________________]                           │
│  Faskes Tujuan: [Dropdown]                              │
│  Prioritas: [Dropdown]                                  │
│                                                         │
│  [Submit] [Cancel]                                      │
└─────────────────────────────────────────────────────────┘
```

### **Enhanced Design (Proposed):**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  📋 Create New Rujukan                    Step 1 of 3    ●○○           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  👤 Patient Information                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  Nama Lengkap Pasien *                                          │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ Ahmad Suryadi                                           │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  Umur *                    Jenis Kelamin *                     │   │
│  │  ┌─────────────────┐      ┌─────────────────────────────────┐   │   │
│  │  │ 45              │      │ Laki-laki ▼                     │   │   │
│  │  └─────────────────┘      └─────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  No. KTP/Identitas *                                            │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ 3201234567890123                                       │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  Alamat Lengkap *                                               │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ Jl. Merdeka No. 123, Kelurahan Sejahtera, Kecamatan    │   │   │
│  │  │ Bahagia, Kota Jakarta Selatan 12345                     │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  No. Telepon *                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ +62 812 3456 7890                                      │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  💡 Tips: Pastikan data pasien lengkap dan akurat              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [← Back]                    [Next Step →]                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Enhancement Features:**
- Step-by-step form dengan progress indicator
- Clear visual hierarchy dengan icons
- Better form styling dengan proper spacing
- Helpful tips dan guidance
- Required field indicators
- Better button placement

## 📱 **MOCKUP 4: MOBILE DASHBOARD**

### **Current State (Existing):**
```
┌─────────────────┐
│ eSIR 2.0        │
├─────────────────┤
│ Dashboard       │
│ Rujukan         │
│ Pasien          │
│ Laporan         │
│ Settings        │
├─────────────────┤
│ Total: 150      │
│ Today: 25       │
│ Pending: 8      │
└─────────────────┘
```

### **Enhanced Design (Proposed):**
```
┌─────────────────────────────────┐
│ 🏥 eSIR 2.0        🔔3  👤     │
├─────────────────────────────────┤
│                                 │
│ 📊 Dashboard                    │
│                                 │
│ ┌─────────┐ ┌─────────┐        │
│ │ 📋 150  │ │ 🚑 25   │        │
│ │ Total   │ │ Today   │        │
│ └─────────┘ └─────────┘        │
│                                 │
│ ┌─────────┐ ┌─────────┐        │
│ │ ⏳ 8    │ │ ✅ 117  │        │
│ │ Pending │ │ Complete│        │
│ └─────────┘ └─────────┘        │
│                                 │
│ 🚨 Urgent Alerts                │
│ ┌─────────────────────────────┐ │
│ │ ⚠️ 2 Emergency Cases        │ │
│ │ 🚑 1 Ambulans Delay         │ │
│ │ [View All]                  │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📋 Recent Activity              │
│ ┌─────────────────────────────┐ │
│ │ • Rujukan #1234 - RS A      │ │
│ │   Status: Dalam Perjalanan  │ │
│ │   Time: 14:30               │ │
│ │                             │ │
│ │ • Rujukan #1233 - Puskesmas │ │
│ │   Status: Selesai           │ │
│ │   Time: 14:15               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │        📋 New Rujukan       │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ 🏠 📋 🚑 📊 ⚙️                  │
└─────────────────────────────────┘
```

**Enhancement Features:**
- Mobile-optimized layout
- Large touch targets (48px minimum)
- Bottom navigation bar
- Card-based design
- Clear visual hierarchy
- Emergency alerts prominently displayed

## 🚑 **MOCKUP 5: AMBULANS TRACKING ENHANCEMENT**

### **Current State (Existing):**
```
┌─────────────────────────────────────────────────────────┐
│  Tracking Ambulans                                       │
├─────────────────────────────────────────────────────────┤
│  Ambulans ID: [Dropdown]                                │
│  Status: [Dropdown]                                     │
│  Location: [Text Field]                                 │
│                                                         │
│  [Start Tracking] [Update Status]                       │
└─────────────────────────────────────────────────────────┘
```

### **Enhanced Design (Proposed):**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🚑 Ambulans Tracking                    🟢 Online    📍 GPS Active     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🚑 Ambulans 001 - Dr. Ahmad Suryadi                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  📍 Current Location                                            │   │
│  │  Jl. Merdeka No. 123, Kelurahan Sejahtera                      │   │
│  │  📊 Accuracy: ±5 meters                                         │   │
│  │                                                                 │   │
│  │  🕐 Last Update: 14:30:25                                       │   │
│  │                                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │                    🗺️ MAP VIEW                         │   │   │
│  │  │                                                         │   │   │
│  │  │  [Interactive Map with GPS Location]                    │   │   │
│  │  │                                                         │   │   │
│  │  │  🚑 Current Position                                    │   │   │
│  │  │  🏥 Destination                                         │   │   │
│  │  │  📍 Waypoints                                           │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  📊 Status Information                                         │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ Status: 🟡 Dalam Perjalanan                             │   │   │
│  │  │ ETA: 15 menit                                           │   │   │
│  │  │ Speed: 45 km/h                                          │   │   │
│  │  │ Distance: 2.3 km                                        │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  🎛️ Quick Actions                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [🟢 Available] [🟡 On Route] [🔴 Emergency] [⏸️ Break]        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  📱 Mobile Controls (for Driver)                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [📍 Update Location] [📞 Call Patient] [🚨 Emergency]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Enhancement Features:**
- Real-time GPS tracking dengan map view
- Status indicators dengan color coding
- ETA dan distance information
- Quick action buttons
- Mobile-optimized controls
- Emergency features prominently displayed

## 🚨 **MOCKUP 6: EMERGENCY ALERT SYSTEM**

### **Current State (Existing):**
```
┌─────────────────────────────────────────────────────────┐
│  Alert: Emergency Case                                  │
├─────────────────────────────────────────────────────────┤
│  Patient: John Doe                                      │
│  Condition: Critical                                    │
│  Location: RS A                                         │
│                                                         │
│  [Acknowledge] [Assign Ambulans]                        │
└─────────────────────────────────────────────────────────┘
```

### **Enhanced Design (Proposed):**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🚨 EMERGENCY ALERT - CRITICAL CASE                    🔴 URGENT        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ⚠️  HIGH PRIORITY - IMMEDIATE ACTION REQUIRED                          │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  👤 Patient Information                                         │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ Name: John Doe                                          │   │   │
│  │  │ Age: 45 years                                           │   │   │
│  │  │ ID: 3201234567890123                                    │   │   │
│  │  │ Phone: +62 812 3456 7890                                │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  🏥 Medical Information                                        │   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ Condition: Cardiac Arrest                                │   │   │
│  │  │ Severity: CRITICAL                                       │   │   │
│  │  │ Symptoms: Unconscious, No pulse                          │   │   │
│  │  │ Allergies: Penicillin                                    │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  📍 Location Information                                       │   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ Hospital: RS A - Emergency Room                          │   │   │
│  │  │ Address: Jl. Merdeka No. 123, Jakarta                   │   │   │
│  │  │ Contact: +62 21 1234 5678                               │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  🚑 Ambulans Assignment                                       │   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ Available Ambulans:                                     │   │   │
│  │  │ 🟢 Ambulans 001 - 5 min ETA                            │   │   │
│  │  │ 🟢 Ambulans 004 - 8 min ETA                            │   │   │
│  │  │                                                         │   │   │
│  │  │ [Assign Ambulans 001] [Assign Ambulans 004]            │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ⏰ Time Critical: 00:05:30 (Auto-assign in 5 minutes)                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [✅ Acknowledge] [🚑 Assign Ambulans] [📞 Call Hospital]       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Enhancement Features:**
- High-contrast emergency design
- Pulsing animation untuk urgency
- Complete patient information
- Medical details prominently displayed
- Ambulans assignment dengan ETA
- Auto-assign countdown timer
- Quick action buttons

## 📊 **MOCKUP 7: REPORT DASHBOARD**

### **Current State (Existing):**
```
┌─────────────────────────────────────────────────────────┐
│  Laporan                                                │
├─────────────────────────────────────────────────────────┤
│  Periode: [Date Range]                                  │
│  Faskes: [Dropdown]                                     │
│                                                         │
│  [Generate Report]                                      │
│                                                         │
│  [Report Data Table]                                    │
└─────────────────────────────────────────────────────────┘
```

### **Enhanced Design (Proposed):**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  📊 Report Dashboard                    📅 Last 30 Days    📈 Live     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🎛️ Report Controls                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  📅 Date Range: [Last 30 Days ▼]                               │   │
│  │  🏥 Facility: [All Facilities ▼]                               │   │
│  │  📋 Report Type: [Summary Report ▼]                            │   │
│  │                                                                 │   │
│  │  [📊 Generate Report] [📥 Export Excel] [📧 Email Report]      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  📈 Key Metrics                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 📋 Total    │ │ ⏱️ Avg      │ │ 🚑 Response │ │ ✅ Success  │      │
│  │ Rujukan     │ │ Processing  │ │ Time        │ │ Rate        │      │
│  │             │ │ Time        │ │             │ │             │      │
│  │     450     │ │   12 min    │ │    8 min    │ │    94%      │      │
│  │             │ │             │ │             │ │             │      │
│  │ ↗️ +15%     │ │ ↘️ -2 min   │ │ ↘️ -1 min   │ │ ↗️ +3%     │      │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                                         │
│  📊 Visual Analytics                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  📈 Rujukan Trends (Last 30 Days)                               │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │                                                         │   │   │
│  │  │  [Line Chart showing daily rujukan counts]              │   │   │
│  │  │                                                         │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │  🏥 Facility Performance                                       │   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │                                                         │   │   │
│  │  │  [Bar Chart showing performance by facility]            │   │   │
│  │  │                                                         │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  📋 Detailed Data                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  [Sortable table with detailed rujukan data]                   │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Enhancement Features:**
- Visual analytics dengan charts
- Key metrics dengan trend indicators
- Interactive date range selection
- Multiple export options
- Real-time data updates
- Facility performance comparison

## 🔄 **IMPLEMENTATION STRATEGY**

### **Phase 1: Non-Disruptive Enhancements (Week 1-2)**
- [ ] Add icons dan visual indicators
- [ ] Improve color coding untuk status
- [ ] Add loading states dan feedback
- [ ] Enhance form styling

### **Phase 2: Progressive Enhancement (Week 3-4)**
- [ ] Implement card-based layouts
- [ ] Add progress indicators
- [ ] Improve mobile responsiveness
- [ ] Add quick action buttons

### **Phase 3: Advanced Features (Week 5-8)**
- [ ] Real-time updates
- [ ] Interactive charts
- [ ] Advanced filtering
- [ ] Emergency alert system

### **Phase 4: Mobile Optimization (Week 9-12)**
- [ ] Mobile-first design
- [ ] Touch-optimized controls
- [ ] Offline capability
- [ ] Push notifications

## 📋 **DESIGN SYSTEM COMPONENTS**

### **Reusable Components:**
```
Cards:
├── Status Card
├── Metric Card
├── Alert Card
└── Action Card

Forms:
├── Input Field
├── Select Dropdown
├── Date Picker
└── File Upload

Buttons:
├── Primary Button
├── Secondary Button
├── Danger Button
└── Icon Button

Navigation:
├── Top Navigation
├── Sidebar Menu
├── Breadcrumbs
└── Pagination
```

### **Color Palette:**
```
Primary: #2563EB (Blue)
Secondary: #059669 (Green)
Accent: #EA580C (Orange)
Danger: #DC2626 (Red)
Warning: #D97706 (Yellow)
Info: #0EA5E9 (Light Blue)
Success: #16A34A (Green)
```

## 🎯 **SUCCESS METRICS**

### **Design Metrics:**
- [ ] Visual consistency score >90%
- [ ] Color contrast compliance >95%
- [ ] Mobile usability score >4.5/5.0
- [ ] User satisfaction >4.0/5.0

### **Usability Metrics:**
- [ ] Task completion rate >90%
- [ ] Error rate <5%
- [ ] Time to complete task <5 minutes
- [ ] User confusion incidents <10%

---

*Mockups ini akan diupdate berdasarkan feedback dari stakeholders dan hasil user testing.*
