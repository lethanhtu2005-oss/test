# WayEcho — Accessible Travel Prototype (Improved PWA)

WayEcho là prototype nền tảng du lịch tiếp cận dành cho **người mù (Blind)** và **người nhìn kém (Low Vision)**. Bản này được cải thiện từ web demo ban đầu và đối chiếu với tài liệu **BẢNG TỔNG HỢP FUNCTION & REQUIREMENT**.

## Những thay đổi chính

### 1. Dữ liệu địa điểm và hình ảnh chính xác hơn
- Các địa điểm thật được tách khỏi dữ liệu dịch vụ demo.
- Ảnh địa điểm thật ưu tiên nguồn có thể truy vết (Wikimedia Commons / kênh chính thức).
- Mỗi ảnh có `alt` mô tả nội dung nhìn thấy, không dùng kiểu `alt="image"` hoặc chỉ ghi tên file.
- Trang chi tiết hiển thị **nguồn ảnh, nguồn thông tin và ngày đối chiếu**.
- Nếu ảnh nguồn đúng địa điểm không tải được, hệ thống hiển thị placeholder trung tính thay vì lấy ảnh địa điểm khác làm fallback.
- Accessibility chưa có nguồn xác nhận được ghi là **Chưa công bố / Cần xác minh / Cần khảo sát**, không tự suy diễn thành “Có” hoặc “Không”.

### 2. Luồng accessibility bám requirement
WayEcho phân biệt rõ:
1. **Accessibility Profile** — Traveler cần gì.
2. **Accessibility Data** — Business / địa điểm có gì.
3. **Accessibility Request** — trong booking cụ thể Traveler muốn được hỗ trợ gì.

Đã bổ sung / làm rõ các luồng: Blind vs Low Vision, chữ lớn, tương phản cao, tốc độ đọc, screen-reader-friendly labels, preferences nhiều lựa chọn, emergency contact, quyền chia sẻ profile, search, My Trip, Accessibility Request, Business confirm/reject, Voice Navigation demo, AI Camera demo, Human Support, SOS và review.

### 3. Mobile-first + cài lên điện thoại
Bản này là **Progressive Web App (PWA)**:
- `public/manifest.webmanifest`
- icon 192x192, 512x512, Apple touch icon
- service worker `public/sw.js`
- đăng ký service worker qua `components/PWARegister.jsx`
- bottom navigation riêng cho mobile
- trang `/app` với mục **“Tải app của chúng tôi”**
- nút cài PWA khi trình duyệt hỗ trợ; có hướng dẫn thủ công cho iOS

> PWA cài được lên màn hình chính khi deploy qua HTTPS, nhưng bản bàn giao này **chưa phải APK/IPA native** và chưa được phát hành trên Google Play / App Store.

## Một số route chính
- `/` — Trang chủ
- `/search` — Tìm địa điểm / dịch vụ
- `/destination` — Danh sách và chi tiết địa điểm có nguồn
- `/profile` — Accessibility Profile
- `/my-trip` — Hành trình
- `/booking` — Booking + Accessibility Request (demo)
- `/navigation` — Voice Navigation UI demo
- `/assistant` — Camera / Vision Assistant demo
- `/sos` — SOS flow demo
- `/app` — Tải/cài PWA lên điện thoại
- `/business` — Business demo portal
- `/guide` — Guide/Assistant demo portal
- `/admin` — Admin demo portal

## Chạy project
```bash
npm ci
npm run dev
```
Mở `http://localhost:3000`.

Build production:
```bash
npm run build
npm start
```

## Lưu ý kiểm thử
- Toàn bộ file JS/JSX đã qua kiểm tra cú pháp bằng TypeScript parser.
- `manifest.webmanifest` đã được kiểm tra JSON hợp lệ và service worker đã qua `node --check`.
- Trong môi trường tạo bản bàn giao, `npm ci` không hoàn tất do kết nối tải dependency bị timeout, vì vậy chưa thể chạy `next build` end-to-end trong sandbox. Khi chạy trên máy có kết nối npm bình thường, hãy chạy `npm ci && npm run build` trước khi deploy.

## Nguyên tắc dữ liệu
- Không dùng rating, hotline, availability, “real-time hazard”, accessibility facilities hoặc đối tác thật nếu chưa có nguồn/verification.
- Dịch vụ mô phỏng phải mang nhãn **DEMO**.
- Business không được tự sửa Traveler rating.
- Dữ liệu Business Insight chỉ nên là aggregated/anonymized.
- AI Camera và Navigation chỉ là công cụ hỗ trợ; không được xem là bảo đảm an toàn tuyệt đối.
- Location, emergency contact, itinerary và accessibility profile phải tuân theo quyền chia sẻ của Traveler.

## Nguồn ảnh
Xem `public/assets/images/CREDITS.md` và nguồn cụ thể trên từng trang chi tiết địa điểm.
