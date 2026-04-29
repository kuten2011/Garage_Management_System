# 🔧 Garage Management System

Hệ thống quản lý dịch vụ bảo dưỡng và sửa chữa xe — Dự án môn Kỹ thuật Phần mềm, Đại học Tôn Đức Thắng.

> **Thành viên:** Võ Nguyễn Anh Khoa (52100049) · Vũ Xuân Cảnh (52200135)

---

## 📋 Giới thiệu

Hệ thống hỗ trợ số hóa toàn bộ quy trình vận hành của garage ô tô vừa và nhỏ, bao gồm:

- Quản lý khách hàng và phương tiện
- Đặt lịch hẹn và tiếp nhận xe
- Quản lý quy trình bảo dưỡng, sửa chữa và báo giá
- Quản lý phụ tùng và dịch vụ (cảnh báo tồn kho thấp)
- Gợi ý và nhắc lịch bảo dưỡng định kỳ tự động
- Quản lý khiếu nại và phản hồi khách hàng
- Thống kê và báo cáo doanh thu

---

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| **Backend** | Java 17, Spring Boot 3.3.6, Spring Security, Spring Data JPA |
| **Frontend** | React, Vite, Tailwind CSS, Axios |
| **Database** | PostgreSQL |
| **Auth** | JWT (JSON Web Token) |
| **AI/Chatbot** | Google Gemini API |
| **Storage** | Cloudinary (hình ảnh) |
| **Mail** | Spring Mail |
| **Deploy Backend** | Railway |
| **Deploy Frontend** | Vercel |

---

## 🏗️ Kiến trúc hệ thống

```
[React + Vite] (Vercel)
       ↓ REST API (Axios + JWT)
[Spring Boot JAR] (Railway)
       ↓
[PostgreSQL] (Railway)
```

---

## 🚀 Hướng dẫn chạy local

### Yêu cầu
- Java 17+
- Node.js v20+
- PostgreSQL

### Backend

```bash
# Clone repo
git clone https://github.com/your-username/Web_garage.git

cd Web_garage/Backend

# Tạo file .env ở thư mục Backend (xem mục Biến môi trường bên dưới)

# Chạy backend
./mvnw spring-boot:run
# Server chạy tại: http://localhost:8080
```

### Frontend

```bash
cd Web_garage/Frontend

# Cài dependencies
npm install

# Tạo file .env.local
echo "VITE_API_URL=http://localhost:8080" > .env.local

# Chạy dev server
npm run dev
# App chạy tại: http://localhost:5173
```

---

## ⚙️ Biến môi trường

### Backend (`.env` hoặc Railway Variables)

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/garage
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update

JWT_SECRET=your_jwt_secret_key

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

SPRING_MAIL_USERNAME=your_email@gmail.com
SPRING_MAIL_PASSWORD=your_app_password
```

### Frontend (`.env.local` hoặc Vercel Variables)

```env
VITE_API_URL=https://webgarage-production.up.railway.app
```

---

## 👥 Phân quyền người dùng

| Role | Quyền hạn |
|---|---|
| `ROLE_CUSTOMER` | Đặt lịch, xem lịch sử, gửi phản hồi |
| `ROLE_EMPLOYEE` | Tạo phiếu sửa chữa, cập nhật trạng thái |
| `ROLE_MANAGER` | Quản lý nhân viên, duyệt báo giá, xem báo cáo |
| `ROLE_ADMIN` | Toàn quyền hệ thống |

---

## 📁 Cấu trúc project

```
Web_garage/
├── Backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/DACNTT/garage/
│   │       │   ├── config/         # Security, CORS config
│   │       │   ├── controller/     # REST API endpoints
│   │       │   ├── service/        # Business logic
│   │       │   ├── repository/     # Database access
│   │       │   ├── model/          # Entity classes
│   │       │   ├── dto/            # Data Transfer Objects
│   │       │   └── security/       # JWT filter, UserDetails
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
└── Frontend/
    ├── src/
    │   ├── api/               # Axios instance
    │   ├── components/        # Reusable components
    │   ├── pages/             # Page components
    │   └── security/          # Auth pages
    ├── vercel.json
    └── package.json
```

---

## 🌐 Deploy

### Backend → Railway
1. Push code lên GitHub
2. Vào Railway → New Project → Deploy from GitHub → chọn repo `Backend`
3. Railway tự động detect `pom.xml` và build Maven
4. Thêm biến môi trường trong Railway → **Variables**

### Frontend → Vercel
1. Push code lên GitHub
2. Vào Vercel → Import repo `Frontend`
3. Thêm `VITE_API_URL` trong Vercel → **Environment Variables**
4. Tạo file `vercel.json` để fix React Router:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📊 Tính năng nổi bật

- **Gợi ý bảo dưỡng thông minh:** Sau 3 lần thay nhớt → gợi ý thay nhớt lap; sau 6.000 km → gợi ý súc rửa hệ thống nhớt
- **Chatbot AI:** Tích hợp Google Gemini để hỗ trợ trả lời nhanh
- **Thông báo email:** Nhắc lịch bảo dưỡng, xác nhận lịch hẹn tự động
- **QR Code:** Tích hợp ZXing để tạo mã QR

---

## 📄 License

Dự án được thực hiện cho mục đích học thuật tại Trường Đại học Tôn Đức Thắng.
