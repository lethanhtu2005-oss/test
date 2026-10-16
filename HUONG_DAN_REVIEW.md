> Prompt 10: **NO-GO production**. Xem `reports/P10_RELEASE_READINESS.md`: thiếu DB production, ingress xác thực nguồn, browser QA và diễn tập vận hành. Source Prompt 9 giữ nguyên trong audit.

> Cập nhật sau Prompt 8 và 9: đọc reports/P8.md, reports/P9.md và báo cáo release readiness P10. Các báo cáo A–G là lịch sử trước bản sửa này. Không chạy lại 7 prompt.

# Review bản nâng cấp WayEcho A đến G

Bản này sửa trực tiếp 150 file gốc của test-main(2).zip, giữ mọi đường dẫn gốc và bổ sung file cần thiết. Đã đọc cả PROMPT.docx và BẢNG TỔNG HỢP FUNCTION 2 SAU SỬA.docx. Làm lần lượt A/B, C, D, E, F, G trên cùng nhánh `fix/wayecho-sequential`; không lấy bản nâng cấp cũ thay source. Không push, merge hoặc deploy.

## Kiểm tra nhanh

1. Đọc `reports/TEST_RESULTS.md` và `reports/A.md` đến `G.md`.
2. Lọc `reports/WayEcho_Requirement_Tracker.xlsx`: 121 ID, 11 cột theo dõi. Trạng thái “Đã sửa” chỉ áp dụng phạm vi ghi ở từng dòng; không thay nghiệm thu production/UI.
3. Đọc `reports/CHANGED_FILES.md` và `patches/A.patch` đến `G.patch` để review từng đợt.
4. Chạy `npm ci` khi có quyền truy cập npm. Không thay package.json hoặc package-lock.json. Môi trường đã kiểm: Node 24.19.0, Next 16.3.6, dependency của ZIP.
5. Chạy `npm test`, `npm run lint`, `npm run build`. Sau build có thể chạy `node scripts/http-smoke.mjs`. Smoke test tự tạo DB tạm, không dùng hoặc reset DB của bạn.
6. Chạy `npm run dev`, mở website local và làm checklist UI bên dưới. ZIP không chứa node_modules, .next, tài khoản thử hoặc dữ liệu runtime.

## Cấp tài khoản local

Không có tài khoản/mật khẩu mặc định, không tự mở form đăng ký tài khoản.

CLI: `node scripts/provision-user.mjs EMAIL ROLE [SCOPE]`. ROLE là traveler, business, guide hoặc admin. Business cần scope là b1/b2/b3 có trong catalog demo; Guide cần guideId được quản trị xác định. Các dữ liệu Guide trong giao diện vẫn minh họa, không tự gán việc thật. Nếu email tồn tại CLI từ chối, không ghi đè.

Đọc mật khẩu từ stdin; không đặt mật khẩu trong argv, file source hoặc commit. Có thể dùng Bash:

```bash
read -r -p "Email cần cấp: " we_email
read -r -p "Vai trò: " we_role
read -r -p "Scope (để trống nếu Traveler/Admin): " we_scope
read -r -s -p "Mật khẩu từ 12 đến 256 ký tự: " we_password
printf '%s' "$we_password" | node scripts/provision-user.mjs "$we_email" "$we_role" "$we_scope"
unset we_password
```

Đăng nhập chung `/login`, Guide giữ `/guide/login`. Cờ sessionStorage không cấp quyền. Chỉ cookie được server đối chiếu với session và tài khoản đang active mới được chấp nhận.

## Cấu hình chưa có trong ZIP

`.env.example` là mẫu mới, không ghi đè cấu hình hoặc bí mật của người dùng.

| Biến | Cách dùng |
|---|---|
| WAYECHO_DATA_PATH | Đường dẫn tuyệt đối tới JSON trên volume bền vững, không đặt trong public. Dev để trống dùng data/db.json. |
| WAYECHO_STORAGE_MODE | Production JSON chỉ khi chủ hệ thống chọn local-single-host sau khi chuẩn bị volume/backup. Không dùng multi-host/NFS. |
| WAYECHO_ORIGIN | Origin chính xác của site, bắt buộc production để kiểm yêu cầu ghi. |
| NEXT_PUBLIC_SITE_URL | Domain https chính thức, đặt lúc build và build lại. Khi thiếu: noindex, không canonical, sitemap XML rỗng. |
| WAYECHO_INQUIRIES_ENABLED | Mặc định 0. Chỉ bật 1 khi có storage, Admin tiếp nhận và chính sách lưu dữ liệu. Đặt khi build để bật form; API còn kiểm flag ở runtime và Admin active. |

Vercel hiện trả 503 với thao tác cần lưu. Không đổi biến để ép JSON chạy trên filesystem tạm. Cần phương án database riêng trước production. Cần chốt môi trường, sao lưu/phục hồi, mapping owner và kế hoạch migration; chưa chọn nhà cung cấp hoặc chạy migration.

Dữ liệu cũ không có ownerId vẫn được giữ trong file; không tự gán hoặc công khai cho người đăng nhập mới. Nếu cần sử dụng lại phải có quy trình xác định chủ sở hữu và nhập thử trên staging. Không reset DB.

## Những luồng đã có xử lý server

- Auth, phiên, logout, role/owner/business scope, kiểm Origin và giới hạn body.
- Saved/trip, booking và request hỗ trợ; notifications cùng transaction. Đây là dữ liệu lưu thực khi storage được cấu hình, nhưng dịch vụ booking vẫn demo.
- Review công khai theo whitelist; gửi review cần Traveler.
- Form quan tâm doanh nghiệp/Guide/hợp tác nếu được bật: chỉ lưu rồi Admin đọc inbox. Chưa email, SMS, xét duyệt hoặc tạo tài khoản từ form.

## Những phần chưa thành dịch vụ thật

- Camera AI/mô tả ảnh viết sẵn, OCR, mô hình hội thoại, routing, cảnh báo chướng ngại, SOS tiếp nhận và gửi vị trí.
- Nhà cung cấp booking, inventory, thanh toán, Guide được phân công.
- Hồ sơ/lịch Guide, bản nháp profile/reply Business, xác minh đối tác và ẩn review ở Admin còn là thao tác DEMO trên client.
- Tự đăng ký tài khoản, khôi phục, MFA, quản lý tài khoản nội bộ qua UI, DB multi-host, backup/restore đã kiểm chứng và quy trình xóa/retention.
- Theme Sáng/Tối/Theo thiết bị và menu 5 nhóm đã triển khai trong Prompt 9, còn cần kiểm trên trình duyệt. Quảng cáo không được xây trong 7 prompt này.

## Checklist cần kiểm trên trình duyệt và thiết bị

- 360, 390, 768, 1280 và 1440 px; zoom 200%/400%; kiểm header, portal, form, bảng Business và toolbar không che nút.
- Tab/Shift+Tab/Enter/Space, skip link, focus rõ, Escape và focus trở lại khi đóng gallery/panel.
- Tương phản cao/chữ lớn/giảm chuyển động; NVDA/VoiceOver/TalkBack. Chưa coi là đạt WCAG AA.
- Từ chối/cấp quyền micro, vị trí; GPS lỗi/hết thời gian; offline; TTS tiếng Việt trên thiết bị.
- Chuyển giữa tài khoản, logout, cookie hết hạn, thử URL/ID người khác; không lộ dữ liệu.
- Form quan tâm bị tắt, API 503, gửi lặp, mất mạng; không hiện thành công nếu chưa lưu.
- Thiếu ảnh Hoàng thành; ảnh ngoài lỗi phải hiện fallback đúng, không lấy ảnh địa điểm khác.
- Sau khi có domain/staging: canonical, sitemap/robots, Open Graph và Rich Results; Search Console do chủ dự án xác minh và thao tác sau quyết định deploy.

Mọi kết quả browser/thiết bị ở danh sách này còn cần thực hiện; các test đã chạy được liệt kê riêng trong báo cáo.

## Thay đổi cấu hình từ Prompt 8

Production login cần ingress ký nguồn bằng WAYECHO_PROXY_SECRET ngoài source, không tin X-Forwarded-For tự do. Đọc reports/P8.md để biết hợp đồng header và cấu hình. Không có secret/proxy đáng tin thì API login trả 503. Secret và database production chưa được cấu hình trong bản bàn giao. Không bỏ kiểm tra này để ép chạy.

JSON có file .initialized đi kèm; sao lưu marker cùng dữ liệu. Lock chỉ được chẩn đoán bằng scripts/inspect-store-lock.mjs, không tự thu hồi. Sau khi tiến trình bị dừng đột ngột phải kiểm tra và bảo trì theo P8_STORAGE.md.

Mở bảng Hỗ trợ tiếp cận để chọn Sáng/Tối/Theo thiết bị. Chữ lớn, tương phản cao và giảm chuyển động vẫn độc lập. Bật tương phản cao sẽ ưu tiên nền đen/chữ trắng. Native map tiles và ảnh không bị invert.

Kiểm thử mới: 42/42 test, 203/203 HTTP, build thành công, lint 0 lỗi/11 cảnh báo. Chưa có Chromium nên chưa chạy UI, screen reader hoặc thiết bị thật.
