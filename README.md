# 🏥 VitaTrack — Health Tracker App

Ứng dụng theo dõi sức khỏe cá nhân xây dựng bằng **ReactJS**, không cần backend — toàn bộ dữ liệu lưu trữ tại `localStorage`.

---

## 👥 Phân công nhóm

| Chức năng | Thành viên |
| Dashboard (Tổng quan) | Phạm Công Vinh |
| Steps Tracker (Bước chân) | Nguyễn Khắc Thượng |
| Water Tracker (Nước uống) | Nguyễn Đức Gia Bảo |
| Weight Tracker | Phạm Đức Thành |
| Xác thực người dùng + Hồ sơ sức khỏe cơ bản | Đặng Xuân Toàn |

---

## 📁 Cấu trúc thư mục

```
health-app/
├── public/
│   └── index.html                   # HTML gốc
├── src/
│   ├── index.js                     # Entry point React
│   ├── App.jsx                      # Router chính
│   │
│   ├── styles/
│   │   └── global.css               # CSS variables, animations, utilities
│   │
│   ├── context/
│   │   └── AppContext.jsx           # Global state (useReducer + localStorage)
│   │
│   ├── utils/
│   │   └── helpers.js               # Hàm tính BMI, water goal, format date...
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Sidebar.jsx          # Navigation sidebar (desktop)
│   │   │   ├── BottomNav.jsx        # Navigation bottom bar (mobile)
│   │   │   ├── ProtectedRoute.jsx   # Route bảo vệ (yêu cầu đăng nhập)
│   │   │   ├── ProgressRing.jsx     # SVG progress ring component
│   │   │   └── StatCard.jsx         # Thẻ thống kê tái sử dụng
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx        # Trang tổng quan (Phạm Công Vinh)
│   │   │
│   │   ├── steps/
│   │   │   └── StepsTracker.jsx     # Theo dõi bước chân (Nguyễn Khắc Thượng)
│   │   │
│   │   ├── water/
│   │   │   └── WaterTracker.jsx     # Theo dõi nước uống (Nguyễn Đức Gia Bảo)
│   │   │
│   │   ├── weight/
│   │   │   └── WeightTracker.jsx    # Theo dõi cân nặng (Phạm Đức Thành)
│   │   │
│   │   ├── profile/
│   │   │   └── ProfilePage.jsx      # Hồ sơ sức khỏe cơ bản (Lại Văn Long)
│   │   │
│   │   └── auth/                    # Xác thực người dùng (Đặng Xuân Toàn)
│   │       ├── LoginPage.jsx        # Trang đăng nhập
│   │       └── RegisterPage.jsx     # Trang đăng ký (2 bước)
│   └── pages/
│       ├── LoginPage.jsx            # Trang đăng nhập
│       └── RegisterPage.jsx         # Trang đăng ký (2 bước)
│
├── package.json
└── README.md
```

---

## 🚀 Cài đặt & Chạy

```bash
# 1. Clone hoặc giải nén project
cd health-app

# 2. Cài dependencies
npm install

# 3. Chạy development server
npm start

# 4. Build production
npm run build
```

Mở trình duyệt: **http://localhost:3000**

---

## ✨ Tính năng

### 🔐 Xác thực người dùng
- Đăng ký 2 bước: tài khoản → hồ sơ sức khỏe
- Đăng nhập an toàn (lưu localStorage)
- Tạo demo data tự động khi đăng ký mới
- Route bảo vệ với `ProtectedRoute`

### 📊 Dashboard (Tổng quan)
- Hiển thị lời chào theo thời gian trong ngày
- 3 Progress Ring: Bước chân / Nước uống / BMI
- 4 StatCard: bước, nước, cân nặng, BMI
- Bar chart bước chân 7 ngày
- Bar chart nước uống 7 ngày
- Mẹo sức khỏe và mục tiêu còn lại

### 👟 Steps Tracker (Bước chân)
- Progress ring tiến độ hôm nay
- Nhập nhanh với preset (2k–15k)
- Nhập tùy chỉnh
- Tính km / kcal / phút di chuyển
- Bar chart 7 ngày / 30 ngày
- Reference line mục tiêu 10,000 bước
- Stats: trung bình, kỷ lục, ngày tích cực

### 💧 Water Tracker (Nước uống)
- Mục tiêu tự động theo cân nặng (35ml/kg)
- Hoạt hình bottle fill SVG
- 6 preset nhanh (100ml – 750ml)
- Nhập tùy chỉnh
- Nhật ký lần uống trong ngày
- Reset hàng ngày
- Bar chart 7 ngày

### ⚖️ Weight Tracker (Cân nặng)
- Line chart xu hướng 30 ngày
- Reference line vùng cân nặng lý tưởng
- Tính BMI tự động
- Phân loại BMI với màu sắc
- Lịch sử 5 lần cân gần nhất
- Stats: cân hiện tại, BMI, thay đổi, lý tưởng

### 👤 Profile Management (Hồ sơ)
- Avatar với chữ cái đầu tên
- Form chỉnh sửa inline (toggle edit mode)
- BMI meter trực quan với marker di chuyển
- Bảng phân loại BMI
- Mục tiêu: Giảm cân / Duy trì / Tăng cơ
- Lưu tự động vào localStorage

---

## 🎨 Design System

| Token | Giá trị |
|---|---|
| Font Display | Syne (Google Fonts) |
| Font Body | DM Sans (Google Fonts) |
| Background | `#0a0e1a` |
| Card | `#161d2e` |
| Accent Cyan | `#00d4ff` |
| Accent Green | `#00e5a0` |
| Accent Orange | `#ff7b35` |
| Accent Purple | `#a855f7` |

---

## 📦 Dependencies

| Package | Mục đích |
|---|---|
| `react` + `react-dom` | UI framework |
| `react-router-dom` v6 | Routing |
| `recharts` | Biểu đồ (Bar, Line, Reference) |
| `date-fns` | Xử lý ngày tháng |

---

## 🔧 Mở rộng có thể làm

- [ ] Kết nối Firebase / Supabase thay localStorage
- [ ] Push notification nhắc uống nước
- [ ] Xuất báo cáo PDF
- [ ] Pedometer API (bước chân từ thiết bị)
- [ ] Dark/Light mode toggle
- [ ] Đa ngôn ngữ (i18n)
