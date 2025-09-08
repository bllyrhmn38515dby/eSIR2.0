# 🧪 UCD USABILITY TESTING SCRIPT - eSIR 2.0

## 📋 **OVERVIEW**
Script lengkap untuk melakukan usability testing pada sistem eSIR 2.0, dengan fokus pada task-based testing dan user experience evaluation.

## 🎯 **TUJUAN TESTING**
1. Mengidentifikasi usability issues dalam sistem
2. Mengukur task completion rate dan efficiency
3. Mengumpulkan user feedback dan suggestions
4. Validasi design decisions dan improvements

## 👥 **PARTICIPANT RECRUITMENT**

### **Target Participants:**
- **Admin Pusat:** 2-3 orang
- **Admin Faskes:** 4-5 orang
- **Sopir Ambulans:** 3-4 orang
- **Total:** 10-12 participants

### **Recruitment Criteria:**
- [ ] Pengalaman menggunakan sistem eSIR 2.0
- [ ] Beragam tingkat technical proficiency
- [ ] Representatif dari berbagai faskes
- [ ] Availability untuk 60-90 menit testing

## 📅 **TESTING SCHEDULE**

### **Session Duration:** 60-90 menit per participant
### **Testing Environment:** 
- [ ] Quiet room dengan good lighting
- [ ] Computer dengan internet connection
- [ ] Screen recording setup
- [ ] Note-taking materials

### **Testing Schedule:**
- **Week 1:** Admin Pusat (2-3 sessions)
- **Week 2:** Admin Faskes (4-5 sessions)
- **Week 3:** Sopir Ambulans (3-4 sessions)
- **Week 4:** Analysis dan reporting

## 🛠️ **TESTING SETUP**

### **Equipment Needed:**
- [ ] Laptop/Desktop dengan eSIR 2.0 access
- [ ] Screen recording software (OBS Studio)
- [ ] Audio recorder (smartphone/recorder)
- [ ] Backup recording device
- [ ] Note-taking template
- [ ] Consent form
- [ ] Task scenarios

### **Software Setup:**
- [ ] eSIR 2.0 system ready
- [ ] Test data prepared
- [ ] Screen recording configured
- [ ] Audio recording tested
- [ ] Backup systems ready

## 📝 **TESTING SCRIPT**

### **PRE-TESTING (10 menit)**

#### **Welcome & Introduction:**
"Selamat datang! Terima kasih telah meluangkan waktu untuk membantu kami meningkatkan sistem eSIR 2.0. Saya [Nama], dan saya akan memandu Anda melalui sesi testing ini.

**Tujuan Testing:**
- Kami ingin memahami bagaimana Anda menggunakan sistem eSIR 2.0
- Kami mencari feedback untuk meningkatkan user experience
- Ini bukan test untuk Anda, tapi untuk sistem kami

**Yang Akan Kami Lakukan:**
- Saya akan memberikan beberapa task untuk Anda lakukan
- Silakan berpikir keras dan beri tahu saya apa yang Anda pikirkan
- Jika ada yang tidak jelas, silakan tanyakan
- Jika ada masalah, itu normal dan membantu kami

**Recording:**
- Kami akan merekam screen dan audio untuk analisis
- Data akan dijaga kerahasiaannya
- Anda bisa berhenti kapan saja

Apakah ada pertanyaan sebelum kita mulai?"

#### **Consent Form:**
- [ ] Participant membaca dan menandatangani consent form
- [ ] Konfirmasi recording permission
- [ ] Konfirmasi data usage agreement

#### **Background Questions:**
1. "Bisa ceritakan tentang role Anda di sistem eSIR?"
2. "Berapa lama sudah menggunakan sistem ini?"
3. "Seberapa sering menggunakan sistem dalam sehari?"
4. "Apa yang paling sering Anda lakukan di sistem?"
5. "Apa yang paling sulit dalam menggunakan sistem?"

### **TASK-BASED TESTING (45-60 menit)**

#### **Task 1: Login dan Navigation (5 menit)**
**Scenario:** "Anda baru saja tiba di kantor dan perlu login ke sistem eSIR 2.0 untuk memulai pekerjaan hari ini."

**Tasks:**
1. Login ke sistem
2. Navigate ke dashboard
3. Check notifications
4. Access main menu

**Success Criteria:**
- [ ] Successfully login
- [ ] Reach dashboard
- [ ] View notifications
- [ ] Navigate menu

**Observations:**
- [ ] Time to complete
- [ ] Errors encountered
- [ ] User behavior
- [ ] Comments/feedback

#### **Task 2: Create New Rujukan (10 menit)**
**Scenario:** "Seorang pasien datang ke faskes Anda dan membutuhkan rujukan ke rumah sakit. Anda perlu membuat rujukan baru di sistem."

**Tasks:**
1. Navigate to rujukan creation
2. Fill patient information
3. Select destination faskes
4. Add medical information
5. Submit rujukan

**Success Criteria:**
- [ ] Access rujukan creation form
- [ ] Complete all required fields
- [ ] Select appropriate destination
- [ ] Successfully submit

**Observations:**
- [ ] Form completion time
- [ ] Field validation issues
- [ ] User confusion points
- [ ] Error handling

#### **Task 3: Update Rujukan Status (5 menit)**
**Scenario:** "Rujukan yang Anda buat tadi sudah diproses oleh rumah sakit tujuan. Anda perlu update status rujukan."

**Tasks:**
1. Find the rujukan
2. Update status
3. Add notes if needed
4. Save changes

**Success Criteria:**
- [ ] Locate rujukan
- [ ] Update status successfully
- [ ] Add relevant notes
- [ ] Save changes

**Observations:**
- [ ] Search efficiency
- [ ] Status update process
- [ ] User interface clarity
- [ ] Confirmation process

#### **Task 4: Search dan Filter (5 menit)**
**Scenario:** "Anda perlu mencari rujukan pasien yang dibuat minggu lalu untuk follow-up."

**Tasks:**
1. Access search function
2. Apply filters
3. Review results
4. Select specific rujukan

**Success Criteria:**
- [ ] Use search function
- [ ] Apply appropriate filters
- [ ] Review search results
- [ ] Select target rujukan

**Observations:**
- [ ] Search interface usability
- [ ] Filter options clarity
- [ ] Results presentation
- [ ] User satisfaction

#### **Task 5: Generate Report (10 menit)**
**Scenario:** "Atasan Anda meminta laporan rujukan bulan ini untuk meeting minggu depan."

**Tasks:**
1. Access reporting function
2. Select date range
3. Choose report type
4. Generate report
5. Export/save report

**Success Criteria:**
- [ ] Access reporting
- [ ] Select correct parameters
- [ ] Generate report
- [ ] Export successfully

**Observations:**
- [ ] Report interface usability
- [ ] Parameter selection
- [ ] Generation time
- [ ] Export functionality

#### **Task 6: GPS Tracking (Sopir Ambulans only) (10 menit)**
**Scenario:** "Anda adalah sopir ambulans yang baru saja mendapat tugas untuk menjemput pasien. Anda perlu start tracking dan update status."

**Tasks:**
1. Login to mobile system
2. Start GPS tracking
3. Update status to "dijemput"
4. Navigate to patient location
5. Update status to "dalam_perjalanan"

**Success Criteria:**
- [ ] Mobile login successful
- [ ] GPS tracking active
- [ ] Status updates working
- [ ] Navigation functional

**Observations:**
- [ ] Mobile interface usability
- [ ] GPS functionality
- [ ] Status update process
- [ ] Navigation ease

#### **Task 7: Emergency Scenario (5 menit)**
**Scenario:** "Ada emergency case yang membutuhkan rujukan segera. Anda perlu membuat rujukan dengan prioritas tinggi."

**Tasks:**
1. Create urgent rujukan
2. Set priority level
3. Add emergency notes
4. Submit immediately

**Success Criteria:**
- [ ] Create urgent rujukan
- [ ] Set priority correctly
- [ ] Add emergency information
- [ ] Submit successfully

**Observations:**
- [ ] Emergency workflow
- [ ] Priority setting
- [ ] Urgency indicators
- [ ] Process efficiency

### **POST-TESTING (15 menit)**

#### **System Usability Scale (SUS) Survey:**
"Silakan isi survey singkat tentang pengalaman Anda menggunakan sistem eSIR 2.0."

**SUS Questions (1-10):**
1. Saya akan menggunakan sistem ini secara teratur
2. Saya menemukan sistem ini tidak perlu rumit
3. Saya merasa sistem ini mudah digunakan
4. Saya membutuhkan bantuan teknis untuk menggunakan sistem
5. Saya menemukan berbagai fungsi dalam sistem terintegrasi dengan baik
6. Saya merasa ada terlalu banyak inkonsistensi dalam sistem
7. Saya akan membayangkan kebanyakan orang akan belajar menggunakan sistem ini dengan cepat
8. Saya merasa sistem ini sangat rumit untuk digunakan
9. Saya merasa sangat percaya diri menggunakan sistem ini
10. Saya perlu belajar banyak hal sebelum bisa menggunakan sistem ini

**Scale:** 1 (Strongly Disagree) - 5 (Strongly Agree)

#### **Open-ended Feedback:**
1. "Apa yang paling Anda sukai dari sistem ini?"
2. "Apa yang paling membuat Anda frustrasi?"
3. "Jika bisa mengubah satu hal, apa yang akan Anda ubah?"
4. "Bagaimana sistem ini membantu pekerjaan Anda?"
5. "Apa saran Anda untuk improvement?"

#### **Net Promoter Score:**
"Seberapa besar kemungkinan Anda merekomendasikan sistem eSIR 2.0 kepada rekan kerja?"
**Scale:** 0-10
**Follow-up:** "Mengapa Anda memberikan skor tersebut?"

#### **Closing:**
"Terima kasih banyak atas waktu dan feedback Anda. Informasi ini sangat berharga untuk membantu kami meningkatkan sistem eSIR 2.0. Apakah ada hal lain yang ingin Anda sampaikan?"

## 📊 **DATA COLLECTION**

### **Quantitative Data:**
- [ ] Task completion rate
- [ ] Time to complete each task
- [ ] Number of errors per task
- [ ] SUS scores
- [ ] NPS scores
- [ ] User satisfaction ratings

### **Qualitative Data:**
- [ ] User comments dan feedback
- [ ] Pain points identified
- [ ] Suggestions for improvement
- [ ] Positive experiences
- [ ] Navigation issues
- [ ] Interface problems

### **Behavioral Data:**
- [ ] Mouse clicks dan movements
- [ ] Navigation patterns
- [ ] Error recovery behavior
- [ ] Help-seeking behavior
- [ ] Task abandonment points

## 📈 **ANALYSIS FRAMEWORK**

### **Task Analysis:**
```
Task Success Rate:
├── Completed Successfully
├── Completed with Difficulty
├── Completed with Help
└── Failed to Complete

Time Analysis:
├── Fast (<50% of target time)
├── Normal (50-100% of target time)
├── Slow (100-150% of target time)
└── Very Slow (>150% of target time)

Error Analysis:
├── No Errors
├── Minor Errors (self-corrected)
├── Major Errors (required help)
└── Critical Errors (task failure)
```

### **Usability Issues Classification:**
```
Severity Levels:
├── Critical (Blocks task completion)
├── Major (Significant difficulty)
├── Minor (Minor inconvenience)
└── Cosmetic (Visual/esthetic issues)

Categories:
├── Navigation Issues
├── Form/Input Problems
├── Information Architecture
├── Visual Design
├── Performance Issues
└── Content/Text Issues
```

## 📋 **REPORTING TEMPLATE**

### **Executive Summary:**
- [ ] Overall usability score
- [ ] Key findings
- [ ] Critical issues
- [ ] Recommendations
- [ ] Next steps

### **Detailed Findings:**
- [ ] Task-by-task analysis
- [ ] User feedback summary
- [ ] Usability issues list
- [ ] Improvement recommendations
- [ ] Priority ranking

### **Appendices:**
- [ ] Raw data
- [ ] User quotes
- [ ] Screenshots
- [ ] Video clips
- [ ] Survey responses

## 🚨 **TESTING CONSIDERATIONS**

### **Ethical Considerations:**
- [ ] Informed consent
- [ ] Data privacy
- [ ] Participant comfort
- [ ] Right to withdraw
- [ ] Confidentiality

### **Technical Considerations:**
- [ ] Backup recording
- [ ] Test data preparation
- [ ] System stability
- [ ] Network connectivity
- [ ] Browser compatibility

### **Logistical Considerations:**
- [ ] Participant scheduling
- [ ] Room availability
- [ ] Equipment setup
- [ ] Time management
- [ ] Follow-up planning

---

*Script ini akan diupdate berdasarkan learnings dari testing sessions dan feedback dari participants.*
