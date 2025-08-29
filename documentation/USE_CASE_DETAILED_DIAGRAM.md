# 🚑 USE CASE DIAGRAM DETAILED - eSIR 2.0

## 📊 **DIAGRAM VISUAL LENGKAP**

```
                                    SISTEM eSIR 2.0
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                                 │
│  ┌─────────────────┐                                                                                                             │
│  │                 │                                                                                                             │
│  │   Admin Pusat   │────┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                 │    │                                                                                                     │ │
│  └─────────────────┘    │  🔐 Authentication                                                                                   │ │
│                         │     ├── Login/Logout                                                                                 │ │
│  ┌─────────────────┐    │     ├── Reset Password                                                                               │ │
│  │                 │    │     └── Session Management                                                                            │ │
│  │   Admin Faskes  │────│                                                                                                     │ │
│  │                 │    │  👥 User Management                                                                                   │ │
│  └─────────────────┘    │     ├── Create User                                                                                  │ │
│                         │     ├── Read User Data                                                                               │ │
│  ┌─────────────────┐    │     ├── Update User                                                                                  │ │
│  │                 │    │     ├── Delete User                                                                                  │ │
│  │  Sopir Ambulans │────│     └── Assign Roles                                                                                 │ │
│  │                 │    │                                                                                                     │ │
│  └─────────────────┘    │  🏥 Faskes Management                                                                                 │ │
│                         │     ├── Create Faskes                                                                                │ │
│  ┌─────────────────┐    │     ├── Read Faskes Data                                                                             │ │
│  │                 │    │     ├── Update Faskes                                                                                │ │
│  │     Pasien      │────│     └── Delete Faskes                                                                                │ │
│  │                 │    │                                                                                                     │ │
│  └─────────────────┘    │  📋 Referral Management                                                                               │ │
│                         │     ├── Create Referral                                                                              │ │
│                         │     ├── Read Referral Data                                                                           │ │
│                         │     ├── Update Referral Status                                                                       │ │
│                         │     ├── Cancel Referral                                                                              │ │
│                         │     └── Add Referral Notes                                                                           │ │
│                         │                                                                                                     │ │
│                         │  🛏️ Bed Management                                                                                    │ │
│                         │     ├── View Bed Availability                                                                        │ │
│                         │     ├── Update Bed Status                                                                            │ │
│                         │     ├── Reserve Bed                                                                                  │ │
│                         │     └── Assign Patient to Bed                                                                        │ │
│                         │                                                                                                     │ │
│                         │  📄 Document Management                                                                               │ │
│                         │     ├── Upload Documents                                                                             │ │
│                         │     ├── Download Documents                                                                           │ │
│                         │     ├── Delete Documents                                                                             │ │
│                         │     └── View Document History                                                                        │ │
│                         │                                                                                                     │ │
│                         │  🚑 Ambulance Tracking                                                                                │ │
│                         │     ├── Real-time Location Tracking                                                                  │ │
│                         │     ├── Journey Status Monitoring                                                                    │ │
│                         │     ├── ETA Updates                                                                                  │ │
│                         │     └── Route Optimization                                                                           │ │
│                         │                                                                                                     │ │
│                         │  🔔 Notification System                                                                               │ │
│                         │     ├── Send Notifications                                                                           │ │
│                         │     ├── Receive Notifications                                                                        │ │
│                         │     ├── Push Notifications                                                                           │ │
│                         │     └── Emergency Alerts                                                                             │ │
│                         │                                                                                                     │ │
│                         │  📊 Reporting & Analytics                                                                             │ │
│                         │     ├── Generate Reports                                                                             │ │
│                         │     ├── View Statistics                                                                              │ │
│                         │     ├── Export Data                                                                                  │ │
│                         │     └── Dashboard Analytics                                                                          │ │
│                         │                                                                                                     │ │
│                         │  🔍 Search & Filter                                                                                   │ │
│                         │     ├── Search Patients                                                                              │ │
│                         │     ├── Search Referrals                                                                             │ │
│                         │     ├── Filter by Status                                                                             │ │
│                         │     └── Advanced Search                                                                              │ │
│                         │                                                                                                     │ │
│                         │  📱 Mobile Features                                                                                   │ │
│                         │     ├── GPS Tracking                                                                                 │ │
│                         │     ├── Background Tracking                                                                          │ │
│                         │     ├── Voice Commands                                                                               │ │
│                         │     ├── Offline Mode                                                                                 │ │
│                         │     ├── Battery Optimization                                                                        │ │
│                         │     └── Device Information                                                                           │ │
│                         └─────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                 │
│  ┌─────────────────┐    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                 │    │                                                                                                     │ │
│  │ Database System │◄───│  💾 Data Storage                                                                                     │ │
│  │                 │    │     ├── User Data                                                                                    │ │
│  └─────────────────┘    │     ├── Patient Data                                                                                 │ │
│                         │     ├── Referral Data                                                                                │ │
│  ┌─────────────────┐    │     ├── Tracking Data                                                                                │ │
│  │                 │    │     ├── Document Data                                                                                │ │
│  │ Email Service   │◄───│     ├── Bed Management Data                                                                          │ │
│  │                 │    │     └── Search Logs                                                                                  │ │
│  └─────────────────┘    │                                                                                                     │ │
│                         │  📧 Email Services                                                                                    │ │
│  ┌─────────────────┐    │     ├── Send Notifications                                                                           │ │
│  │                 │    │     ├── Password Reset                                                                               │ │
│  │ GPS System      │◄───│     ├── Emergency Alerts                                                                             │ │
│  │                 │    │     └── System Reports                                                                               │ │
│  └─────────────────┘    │                                                                                                     │ │
│                         │  📍 Location Services                                                                                 │ │
│  ┌─────────────────┐    │     ├── Provide Location Data                                                                        │ │
│  │                 │    │     ├── Calculate Distance & ETA                                                                     │ │
│  │ Push Notification│◄───│     ├── Route Optimization                                                                           │ │
│  │ Service         │    │     └── Geocoding Services                                                                           │ │
│  └─────────────────┘    │                                                                                                     │ │
│                         │  🔔 Push Notification Services                                                                        │ │
│                         │     ├── Real-time Notifications                                                                      │ │
│                         │     ├── Background Notifications                                                                     │ │
│                         │     ├── Emergency Alerts                                                                             │ │
│                         │     └── Status Updates                                                                               │ │
│                         └─────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔗 **RELATIONSHIP DIAGRAM**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    RELATIONSHIP DIAGRAM                                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                                                      │
│  │             │    │             │    │             │    │             │                                                      │
│  │ Admin Pusat │────│ Admin Faskes│────│Sopir Ambulans│────│   Pasien    │                                                      │
│  │             │    │             │    │             │    │             │                                                      │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘                                                      │
│         │                   │                   │                   │                                                          │
│         │                   │                   │                   │                                                          │
│         ▼                   ▼                   ▼                   ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                                                                             │ │
│  │  🔐 AUTHENTICATION SYSTEM                                                                                                   │ │
│  │     ├── Login/Logout                                                                                                        │ │
│  │     ├── Password Reset                                                                                                      │ │
│  │     ├── Session Management                                                                                                  │ │
│  │     └── Role-based Access Control                                                                                           │ │
│  │                                                                                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                                                                             │ │
│  │  📋 CORE BUSINESS PROCESSES                                                                                                 │ │
│  │     ├── Referral Management                                                                                                 │ │
│  │     ├── Bed Management                                                                                                       │ │
│  │     ├── Document Management                                                                                                  │ │
│  │     ├── Ambulance Tracking                                                                                                   │ │
│  │     └── Notification System                                                                                                  │ │
│  │                                                                                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                                                                             │ │
│  │  🔧 SUPPORTING SYSTEMS                                                                                                       │ │
│  │     ├── Database System                                                                                                     │ │
│  │     ├── Email Service                                                                                                        │ │
│  │     ├── GPS System                                                                                                           │ │
│  │     └── Push Notification Service                                                                                            │ │
│  │                                                                                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 📱 **MOBILE USE CASE FLOW**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    MOBILE USE CASE FLOW                                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                 │
│  📱 MOBILE APP STARTUP                                                                                                           │
│     ├── App Launch                                                                                                              │
│     ├── Check Authentication                                                                                                    │
│     ├── Load User Profile                                                                                                       │
│     └── Initialize Services                                                                                                     │
│                                                                                                                                 │
│  🔐 AUTHENTICATION FLOW                                                                                                          │
│     ├── Login Screen                                                                                                            │
│     ├── Validate Credentials                                                                                                    │
│     ├── Generate JWT Token                                                                                                      │
│     ├── Store Token Securely                                                                                                    │
│     └── Navigate to Dashboard                                                                                                   │
│                                                                                                                                 │
│  🚑 AMBULANCE TRACKING FLOW                                                                                                      │
│     ├── Start Tracking Session                                                                                                  │
│     ├── Enable GPS Services                                                                                                     │
│     ├── Begin Background Tracking                                                                                               │
│     ├── Send Location Updates                                                                                                   │
│     ├── Receive Route Instructions                                                                                              │
│     └── End Tracking Session                                                                                                    │
│                                                                                                                                 │
│  🔔 NOTIFICATION FLOW                                                                                                            │
│     ├── Receive Push Notification                                                                                               │
│     ├── Process Notification Data                                                                                               │
│     ├── Display Notification                                                                                                    │
│     ├── Handle User Interaction                                                                                                 │
│     └── Update App State                                                                                                        │
│                                                                                                                                 │
│  📄 DOCUMENT MANAGEMENT FLOW                                                                                                     │
│     ├── Select Document                                                                                                         │
│     ├── Upload to Server                                                                                                        │
│     ├── Track Upload Progress                                                                                                   │
│     ├── Verify Upload Success                                                                                                   │
│     └── Update Document List                                                                                                    │
│                                                                                                                                 │
│  🔍 SEARCH & FILTER FLOW                                                                                                         │
│     ├── Enter Search Query                                                                                                      │
│     ├── Apply Filters                                                                                                           │
│     ├── Execute Search                                                                                                          │
│     ├── Display Results                                                                                                         │
│     └── Handle Result Selection                                                                                                 │
│                                                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 **USE CASE PRIORITY MATRIX**

| Use Case | Priority | Complexity | Business Value | Technical Feasibility |
|----------|----------|------------|----------------|----------------------|
| Login/Logout | High | Low | High | High |
| Create Referral | High | Medium | High | High |
| Track Ambulance | High | High | High | Medium |
| Upload Document | Medium | Medium | Medium | High |
| Push Notifications | Medium | High | Medium | Medium |
| Voice Commands | Low | High | Low | Low |
| Offline Mode | Low | High | Medium | Low |
| Battery Optimization | Low | Medium | Low | Medium |

## 📊 **ACTOR RESPONSIBILITY MATRIX**

| Actor | Primary Responsibilities | Secondary Responsibilities | Access Level |
|-------|-------------------------|----------------------------|--------------|
| Admin Pusat | User Management, Faskes Management, Reporting | System Configuration, Analytics | Full Access |
| Admin Faskes | Referral Management, Bed Management | Document Management, Notifications | Faskes Level |
| Sopir Ambulans | Ambulance Tracking, Route Management | Referral Status Updates, Notifications | Tracking Level |
| Pasien | View Referral Status, Receive Notifications | Mobile App Access | Read Only |

## 🔄 **SYSTEM INTERACTION FLOW**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    SYSTEM INTERACTION FLOW                                                                      │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                 │
│  1. USER AUTHENTICATION                                                                                                          │
│     User → Login → Authentication Service → Database → JWT Token → User Session                                                │
│                                                                                                                                 │
│  2. REFERRAL CREATION                                                                                                            │
│     Admin Faskes → Create Referral → Validation → Database → Notification → Email Service                                       │
│                                                                                                                                 │
│  3. AMBULANCE TRACKING                                                                                                           │
│     Sopir → Start Tracking → GPS Service → Location Data → Database → Real-time Updates → Admin                                │
│                                                                                                                                 │
│  4. DOCUMENT UPLOAD                                                                                                              │
│     User → Select File → Upload Service → File Storage → Database → Notification → Recipients                                  │
│                                                                                                                                 │
│  5. NOTIFICATION SYSTEM                                                                                                          │
│     System Event → Notification Service → Push Service → Mobile App → User Display → User Action                               │
│                                                                                                                                 │
│  6. REPORTING & ANALYTICS                                                                                                        │
│     Admin → Request Report → Analytics Service → Database → Data Processing → Report Generation → Export                        │
│                                                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 📝 **IMPLEMENTATION NOTES**

### **Technical Considerations:**
- **Authentication:** JWT-based with role-based access control
- **Real-time:** Socket.IO for live updates
- **Mobile:** React Native with native modules
- **Database:** MySQL with connection pooling
- **File Storage:** Local storage with backup
- **Security:** HTTPS, input validation, SQL injection prevention

### **Scalability Considerations:**
- **Load Balancing:** Multiple server instances
- **Database:** Read replicas for reporting
- **Caching:** Redis for session management
- **CDN:** For static assets and documents
- **Monitoring:** Application performance monitoring

### **Security Considerations:**
- **Data Encryption:** At rest and in transit
- **Access Control:** Role-based permissions
- **Audit Trail:** All actions logged
- **Input Validation:** Server-side validation
- **Session Management:** Secure token handling
