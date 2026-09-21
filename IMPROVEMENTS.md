# WayEcho — Improvement & Requirement Mapping

## Traveler
| Requirement | Trạng thái prototype | Vị trí chính |
|---|---|---|
| FR01 Account & Accessibility Profile | Demo frontend | `/profile` |
| FR02 Accessibility Settings | Có: Blind/Low Vision, large text, contrast, TTS rate, preferences | `/profile`, `A11yProvider` |
| FR03 Search | Có | `/search`, `/explore` |
| FR04 Accessibility Information & Rating | Có dữ liệu trạng thái + source; review demo | `/destination`, `/review` |
| FR05 My Trip | Có demo | `/my-trip` |
| FR06 Accommodation Booking | Demo, không thanh toán thật | `/booking` |
| FR07 Transport Booking | Data/service demo | catalog + booking |
| FR08 Ticket Booking | Demo, có entry gắn địa điểm thật | catalog + booking |
| FR09 Guide / Assistant | Demo, không giả danh người thật | `/guide`, catalog |
| FR10 Accessible Map | UI demo, không tuyên bố route đã khảo sát | `/navigation` |
| FR11 Voice Navigation | TTS/UI demo, có safety disclaimer | `/navigation` |
| FR12 AI Camera | UI demo + confidence / uncertainty | `/assistant` |
| FR13 Human Support | Demo | `/assistant`, `/help` |
| FR14 SOS | Demo + geolocation permission flow | `/sos` |
| FR15 Review & Feedback | Demo API | `/review` |
| FR16 Notification | Demo API/UI | `/notifications` |

## Business / Guide / Admin
Business, Guide và Admin đã có cổng demo để thể hiện registration/profile/service/booking/request/review/verification/moderation. Các dữ liệu chưa có backend/provider thật được gắn rõ là demo hoặc chưa xác minh.

## Non-functional
- **NFR01 Accessibility:** semantic labels, keyboard focus, skip link, high contrast, large text, alt descriptions, screen reader live region, reduced motion.
- **NFR02 Performance:** ảnh lazy-load mặc định; PWA shell cache.
- **NFR03 Security:** prototype không giả lập việc chia sẻ location tự động; user-controlled sharing trong profile/request.
- **NFR04 Reliability:** ảnh có non-misleading fallback; SOS/geolocation và AI/navigation có trạng thái lỗi/không chắc chắn.
- **NFR05 Usability:** mobile bottom nav, SOS shortcut, installable PWA, tap targets lớn.

## Những phần cần backend / đối tác thật trước khi production
Payment, booking inventory realtime, guide availability thật, business verification thật, accessibility survey có kiểm chứng, route accessibility, hazard detection, emergency dispatch, native App Store / Google Play release và security/privacy production hardening.

## Guide Portal — update 22/09/2026
- Thêm `/guide/login`: trang đăng nhập Guide / Personal Assistant riêng.
- Sau đăng nhập, Guide dùng header portal riêng, không dùng header Traveler.
- Menu chính: Tổng quan, Booking, Lịch hỗ trợ, Hồ sơ. Đã bỏ mục **Thu nhập**.
- Avatar mở menu tài khoản: Hồ sơ của tôi, Cài đặt tài khoản, Bảo mật & mật khẩu, Thông báo, Trung tâm trợ giúp, Về WayEcho, Đăng xuất.
- Thêm `/guide/schedule`, `/guide/notifications`, `/guide/register` để hoàn chỉnh luồng prototype.
- Dashboard hiển thị trạng thái xác minh/hoạt động, thống kê, booking sắp tới và accessibility request.
- Ảnh lịch hỗ trợ có `alt` mô tả cụ thể.

## Update 2026-09-22 — Guide identity + footer

- Đổi tài khoản Guide demo chính từ Nguyễn Thu Hà thành **Lê Thanh Tú**; avatar đổi thành **T**; lời chào dashboard cập nhật đồng bộ.
- Giữ Guide Portal tách khỏi header Traveler; menu chính: Tổng quan, Booking, Lịch hỗ trợ, Hồ sơ; không có mục Thu nhập.
- Footer public được thiết kế lại: thương hiệu + cài app PWA, Khám phá, Hỗ trợ & Accessibility, Đối tác, khu SOS và legal bar dưới cùng.
- Link Staff được đặt nhỏ ở legal bar thay vì phơi Admin Dashboard trong navigation công khai.
- Thêm trang prototype `/privacy`, `/terms`, `/staff`; bổ sung anchor Accessibility, Contact và Credits ở `/help`.
- Footer không hiển thị trong các portal `/guide`, `/business`, `/admin` để dashboard vận hành gọn và tách khỏi website Traveler.
