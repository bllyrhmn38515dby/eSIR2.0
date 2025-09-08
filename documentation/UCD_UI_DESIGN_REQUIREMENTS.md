# 🎨 UI DESIGN REQUIREMENTS - eSIR 2.0

## 📋 **OVERVIEW**
Catatan keinginan pengguna terkait design UI untuk aplikasi eSIR 2.0 yang sesuai dengan konsep IGD (Instalasi Gawat Darurat) rumah sakit, dengan fokus pada usability, accessibility, dan medical context.

## 🏥 **KONSEP DESIGN IGD RUMAH SAKIT**

### **Prinsip Utama:**
- **Clarity & Readability** - Informasi harus mudah dibaca dalam kondisi stress
- **Quick Access** - Fitur kritis harus mudah diakses dalam emergency
- **Visual Hierarchy** - Prioritas informasi berdasarkan urgency
- **Consistency** - Interface yang konsisten untuk mengurangi cognitive load
- **Accessibility** - Dapat digunakan oleh semua level technical proficiency

## 🎨 **COLOR SCHEME & PALETTE**

### **Primary Colors (Medical Theme):**
```
Primary Blue:     #2563EB (Trust, Professionalism, Medical)
Secondary Green:  #059669 (Success, Health, Go/Proceed)
Accent Orange:    #EA580C (Warning, Attention, Urgent)
Neutral Gray:     #6B7280 (Text, Secondary Information)
Background:       #F8FAFC (Clean, Sterile, Medical)
```

### **Status Colors (Emergency Context):**
```
Critical Red:     #DC2626 (Emergency, Critical, Stop)
Warning Yellow:   #D97706 (Caution, Pending, Wait)
Success Green:    #16A34A (Complete, Safe, Go)
Info Blue:        #2563EB (Information, Neutral, Process)
```

### **User Feedback dari Kuisioner:**
> **Admin Pusat:** "Warna biru memberikan kesan profesional dan dapat dipercaya untuk sistem medis"
> 
> **Admin Faskes:** "Hijau untuk status 'selesai' sangat membantu karena memberikan rasa aman"
> 
> **Sopir Ambulans:** "Merah untuk emergency sangat jelas dan mudah dikenali bahkan dalam kondisi terburu-buru"

## 🖼️ **VISUAL DESIGN ELEMENTS**

### **Typography:**
```
Primary Font:     Inter (Clean, Modern, Highly Readable)
Secondary Font:   Roboto (Fallback, Medical Context)
Code Font:        JetBrains Mono (Technical Information)

Font Sizes:
├── Headers:      24px, 20px, 18px
├── Body Text:    16px (Minimum untuk readability)
├── Labels:       14px
├── Captions:     12px
└── Mobile:       +2px dari desktop (18px minimum)
```

### **Spacing & Layout:**
```
Grid System:      12-column responsive grid
Spacing Scale:    4px, 8px, 16px, 24px, 32px, 48px
Container Max:    1200px
Sidebar Width:    280px (Desktop), 100% (Mobile)
```

### **Icons & Imagery:**
```
Icon Style:       Outline style dengan 2px stroke
Icon Library:     Heroicons, Medical Icons
Image Style:      Rounded corners (8px radius)
Avatar Style:     Circular dengan border
```

## 🏗️ **COMPONENT DESIGN SPECIFICATIONS**

### **1. Navigation Components**

#### **Top Navigation Bar:**
```
Background:       #FFFFFF dengan shadow
Height:           64px
Logo:             Left side, 40px height
User Menu:        Right side dengan avatar
Notifications:    Bell icon dengan red dot untuk urgent
```

#### **Sidebar Navigation:**
```
Background:       #F8FAFC
Width:            280px (Desktop), 100% (Mobile)
Active State:     #2563EB background dengan white text
Hover State:      #E5E7EB background
Icon Size:        20px
Text Size:        16px
```

#### **Breadcrumbs:**
```
Separator:        ">" dengan #6B7280 color
Active Page:      #2563EB color, bold
Inactive Pages:   #6B7280 color
```

### **2. Form Components**

#### **Input Fields:**
```
Border:           1px solid #D1D5DB
Border Radius:    8px
Padding:          12px 16px
Focus State:      #2563EB border dengan shadow
Error State:      #DC2626 border dengan error message
Success State:    #16A34A border
```

#### **Buttons:**
```
Primary Button:   #2563EB background, white text
Secondary Button: White background, #2563EB border
Danger Button:    #DC2626 background, white text
Size:             44px minimum height (touch target)
Border Radius:    8px
```

#### **Form Validation:**
```
Error Message:    #DC2626 color, 14px
Success Message:  #16A34A color, 14px
Warning Message:  #D97706 color, 14px
```

### **3. Data Display Components**

#### **Tables:**
```
Header:           #F3F4F6 background
Row Hover:        #F9FAFB background
Border:           #E5E7EB
Alternating Rows: #FAFAFA background
```

#### **Cards:**
```
Background:       #FFFFFF
Border:           1px solid #E5E7EB
Border Radius:    12px
Shadow:           0 1px 3px rgba(0, 0, 0, 0.1)
Padding:          24px
```

#### **Status Badges:**
```
Critical:         #FEE2E2 background, #DC2626 text
Warning:          #FEF3C7 background, #D97706 text
Success:          #D1FAE5 background, #16A34A text
Info:             #DBEAFE background, #2563EB text
```

### **4. Emergency-Specific Components**

#### **Alert Banners:**
```
Critical Alert:   #FEE2E2 background, #DC2626 border
Warning Alert:    #FEF3C7 background, #D97706 border
Info Alert:       #DBEAFE background, #2563EB border
Success Alert:    #D1FAE5 background, #16A34A border
```

#### **Progress Indicators:**
```
Progress Bar:     #E5E7EB background, #2563EB fill
Step Indicator:   Circular dengan number
Loading Spinner:  #2563EB color
```

## 📱 **MOBILE-SPECIFIC DESIGN**

### **Touch Targets:**
```
Minimum Size:     44px x 44px
Recommended:      48px x 48px
Spacing:          Minimum 8px between targets
```

### **Mobile Navigation:**
```
Bottom Tab Bar:   Fixed bottom dengan 5 tabs max
Tab Icons:        24px size
Tab Labels:       12px size
Active State:     #2563EB color
```

### **Mobile Forms:**
```
Input Height:     48px minimum
Button Height:    48px minimum
Form Spacing:     16px between fields
```

## 🚨 **EMERGENCY & CRITICAL STATES**

### **Emergency Mode Design:**
```
Background:       #FEF2F2 (Light red)
Border:           #FCA5A5 (Medium red)
Text:             #DC2626 (Dark red)
Icons:            Red dengan pulsing animation
```

### **Critical Information Display:**
```
Font Size:        +2px dari normal
Font Weight:      Bold
Color:            #DC2626
Background:       #FEF2F2
Border:           2px solid #FCA5A5
```

### **Status Indicators:**
```
Emergency:        Red dengan pulsing animation
Urgent:           Orange dengan blinking
Normal:           Blue dengan steady state
Complete:         Green dengan checkmark
```

## ♿ **ACCESSIBILITY REQUIREMENTS**

### **Color Contrast:**
```
Normal Text:      Minimum 4.5:1 ratio
Large Text:       Minimum 3:1 ratio
UI Components:    Minimum 3:1 ratio
```

### **Focus States:**
```
Focus Ring:       2px solid #2563EB
Focus Offset:     2px
Keyboard Navigation: Full support
```

### **Screen Reader Support:**
```
Alt Text:         All images
ARIA Labels:      All interactive elements
Semantic HTML:    Proper heading structure
```

## 🎯 **USER-SPECIFIC DESIGN PREFERENCES**

### **Admin Pusat Preferences:**
```
Dashboard Style:  Data-dense dengan charts
Color Preference: Professional blue theme
Layout:          Multi-column dengan widgets
Information:     Comprehensive dengan drill-down
```

### **Admin Faskes Preferences:**
```
Form Style:       Step-by-step dengan progress
Color Preference: Clean white dengan blue accents
Layout:          Single-column dengan clear hierarchy
Information:     Contextual dengan help text
```

### **Sopir Ambulans Preferences:**
```
Mobile-First:     Large buttons dengan clear labels
Color Preference: High contrast untuk outdoor use
Layout:          Simple dengan minimal distractions
Information:     Essential only dengan quick access
```

## 📊 **DESIGN SYSTEM COMPONENTS**

### **Component Library:**
```
Atoms:
├── Buttons
├── Inputs
├── Labels
├── Icons
└── Typography

Molecules:
├── Form Groups
├── Search Bars
├── Navigation Items
├── Status Badges
└── Alert Messages

Organisms:
├── Headers
├── Sidebars
├── Forms
├── Tables
└── Cards

Templates:
├── Dashboard
├── Form Pages
├── List Pages
├── Detail Pages
└── Mobile Views
```

### **Design Tokens:**
```json
{
  "colors": {
    "primary": "#2563EB",
    "secondary": "#059669",
    "accent": "#EA580C",
    "neutral": "#6B7280",
    "background": "#F8FAFC"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSizes": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px"
    }
  }
}
```

## 🔄 **INTERACTION PATTERNS**

### **Hover States:**
```
Buttons:          Slight color darkening
Links:            Underline dengan color change
Cards:            Subtle shadow increase
Icons:            Color change dengan scale
```

### **Loading States:**
```
Skeleton Screens: Gray placeholders
Progress Bars:    Animated progress
Spinners:         Rotating indicators
Pulse Animation:  For urgent items
```

### **Transitions:**
```
Duration:         200ms untuk micro-interactions
Easing:           ease-in-out
Properties:       opacity, transform, color
```

## 📋 **IMPLEMENTATION GUIDELINES**

### **Development Standards:**
```
CSS Framework:    Tailwind CSS
Component Library: Headless UI
Icons:           Heroicons
Charts:          Chart.js atau D3.js
```

### **Quality Assurance:**
```
Design Review:    Weekly design reviews
User Testing:     Bi-weekly usability testing
Accessibility:    Monthly accessibility audit
Performance:      Continuous performance monitoring
```

## 🎨 **DESIGN MOCKUPS & WIREFRAMES**

### **Key Screens:**
1. **Login Page** - Clean dengan medical branding
2. **Dashboard** - Data-dense dengan clear hierarchy
3. **Rujukan Form** - Step-by-step dengan progress
4. **Mobile Tracking** - Large buttons dengan GPS integration
5. **Emergency Alert** - High contrast dengan clear messaging

### **Responsive Breakpoints:**
```
Mobile:          320px - 768px
Tablet:          768px - 1024px
Desktop:         1024px - 1440px
Large Desktop:   1440px+
```

## 📞 **STAKEHOLDER FEEDBACK**

### **Design Approval Process:**
1. **Initial Concepts** - Present 3 design directions
2. **User Testing** - Test dengan 5-8 users per role
3. **Iteration** - Refine berdasarkan feedback
4. **Final Approval** - Stakeholder sign-off
5. **Implementation** - Development dengan design system

### **Feedback Collection:**
```
Design Reviews:   Weekly dengan stakeholders
User Testing:     Bi-weekly dengan end users
A/B Testing:      For critical design decisions
Analytics:        Track user behavior patterns
```

---

*Dokumen ini akan diupdate berdasarkan feedback dari stakeholders dan hasil user testing.*
