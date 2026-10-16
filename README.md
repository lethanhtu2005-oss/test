> Prompt 10: **NO-GO production**. Xem `reports/P10_RELEASE_READINESS.md`: thiếu DB production, ingress xác thực nguồn, browser QA và diễn tập vận hành. Source Prompt 9 giữ nguyên trong audit.

> **Bản cập nhật Prompt 8–9.** Xem `reports/P8.md`, `reports/P9.md`, `reports/P10_RELEASE_READINESS.md` và hướng dẫn review. Báo cáo A–G được giữ làm lịch sử.

> **Bản nâng cấp A–G theo PROMPT.docx, ngày 16/10/2026.** Bắt đầu với [HUONG_DAN_REVIEW.md](HUONG_DAN_REVIEW.md), báo cáo từng đợt trong `reports/` và diff trong `patches/`. Chưa push hoặc deploy. Xem giới hạn production trước khi dùng dữ liệu thật.

# WayEcho — Accessible Travel Prototype 

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

## Kiểm thử
Yêu cầu Node.js 20.9 trở lên (Next.js 16, React 19).
```bash
npm run lint   # ESLint (eslint-config-next)
npm test       # Unit test cho phần kiểm tra dữ liệu API (node:test)
npm run build  # Build production
```

## Dữ liệu demo
- `data/db.seed.json` là dữ liệu mẫu được commit. Khi chạy, API ghi vào `data/db.json` (đã có trong `.gitignore`), nên dữ liệu test không bị commit nhầm. Xóa `data/db.json` để reset về dữ liệu mẫu.
- Bản A–G đã bỏ fallback bộ nhớ. Trên Vercel, thao tác cần lưu trả 503; chưa tích hợp database production. JSON chỉ dùng cho một host có filesystem bền vững và cấu hình phù hợp. Xem HUONG_DAN_REVIEW.md.
- Đăng nhập kiểm tài khoản được cấp và phiên cookie ở server; các portal Business/Admin/Guide được kiểm vai trò. Hồ sơ/lịch và các tác vụ quản trị còn demo được ghi rõ trong giao diện.

## Nguyên tắc dữ liệu
- Không dùng rating, hotline, availability, “real-time hazard”, accessibility facilities hoặc đối tác thật nếu chưa có nguồn/verification.
- Dịch vụ mô phỏng phải mang nhãn **DEMO**.
- Business không được tự sửa Traveler rating.
- Dữ liệu Business Insight chỉ nên là aggregated/anonymized.
- AI Camera và Navigation chỉ là công cụ hỗ trợ; không được xem là bảo đảm an toàn tuyệt đối.
- Location, emergency contact, itinerary và accessibility profile phải tuân theo quyền chia sẻ của Traveler.

## Nguồn ảnh
Xem `public/assets/images/CREDITS.md` và nguồn cụ thể trên từng trang chi tiết địa điểm.

Kiểm tra triển khai
