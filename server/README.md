# 🚀 English Master IELTS - MongoDB Backend & Cloud Controller

Hệ thống Backend Node.js / Express kết nối trực tiếp với cơ sở dữ liệu **MongoDB** (hỗ trợ cả MongoDB Atlas Cloud và Local MongoDB), kiểm soát 100% dữ liệu tiến trình học tập, tài khoản, kết quả thi IELTS, kho thẻ SRS và chấm điểm AI tự động.

## 🌟 Tính năng chính
- 🍃 **MongoDB Full Integration**: Quản lý các Collections: `user_progress`, `ielts_submissions`, `study_stats`.
- 🔄 **Cloud Sync 2 Chiều**: Tự động đồng bộ tiến trình học tập, XP, Streak, Level, Từ vựng đã học giữa Web App và MongoDB Cloud.
- 🤖 **AI IELTS Grading & Chat**: API tự động phân tích và chấm bài IELTS Writing theo chuẩn 4 tiêu chí của Hội đồng Anh / IDP.
- ⚡ **Graceful Standby**: Chạy mượt mà cả khi MongoDB đang kết nối lẫn chế độ In-Memory Standby.

## 🛠️ Cài đặt & Chạy cục bộ (Local)

1. Mở terminal và chuyển vào thư mục `server`:
   ```bash
   cd server
   npm install
   ```

2. Tạo file `.env` từ file mẫu:
   ```bash
   cp .env.example .env
   ```

3. Khởi chạy Server:
   ```bash
   npm start
   ```
   Server sẽ lắng nghe tại `http://localhost:5000`.

## 🌐 Triển khai lên Cloud Miễn Phí (Render / Railway / Vercel)

1. **MongoDB Atlas (Miễn phí vĩnh viễn):**
   - Đăng ký tài khoản tại [mongodb.com/atlas](https://www.mongodb.com/atlas).
   - Tạo Cluster M0 (Free Tier) tại vùng `ap-southeast-1` (Singapore).
   - Lấy chuỗi kết nối: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/english_master_db`.

2. **Deploy Backend lên Render.com:**
   - Tạo New Web Service trên Render, trỏ vào thư mục `server`.
   - Cài đặt Environment Variable: `MONGODB_URI = <Chuỗi MongoDB Atlas của bạn>`.
   - Build Command: `npm install`.
   - Start Command: `node index.js`.
