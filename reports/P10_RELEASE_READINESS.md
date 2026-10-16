# Prompt 10 — Kiểm toán điều kiện phát hành

Ngày 2026-10-16. Phạm vi: production WayEcho sau Prompt 8–9. Chỉ audit và tài liệu; không sửa code, không push/merge/deploy. Checkpoint nguồn đóng băng: `2612987`; SHA-256 từng file trong `P10_FROZEN_SOURCE.json`.

**Kết luận duy nhất: NO-GO cho production.** Chưa có database production được kiểm thử, ingress ký nguồn đăng nhập thực tế, bằng chứng browser/accessibility và quy trình vận hành được diễn tập. Test local đạt không thay thế các điều kiện này.

| Hạng mục | Bằng chứng | Trạng thái | Rủi ro | Điều kiện còn thiếu | Người/bộ phận xử lý |
|---|---|---|---|---|---|
| Database bền vững | `lib/store.js`, `P8_STORAGE.md`; JSON bị chặn trên Vercel, không có adapter DB production | Chặn phát hành | Nghiêm trọng | Chọn DB, adapter transaction, cấu hình thật, test đồng thời/rollback/độ bền | Chưa phân công; đề xuất Backend + vận hành |
| Migration, backup, restore | Chỉ có đề xuất repository/migration, seed giữ nguyên; test crash/lock/missing DB local | Chưa diễn tập | Cao | Dữ liệu legacy có owner được xác minh, backup mã hóa, restore đối chiếu checksum, thời gian phục hồi | Chưa phân công; đề xuất Backend + chủ dữ liệu |
| Cấu hình production | `.env.example` liệt kê STORAGE_MODE, DATA_PATH, ORIGIN, NEXT_PUBLIC_SITE_URL, INQUIRIES_ENABLED, PROXY_SECRET; không có cấu hình triển khai được xác minh | Chưa cấu hình | Nghiêm trọng | HTTPS, origin/domain thật, secret ngoài source, storage phù hợp; không dùng JSON tạm | Chưa phân công; đề xuất vận hành |
| Nguồn login đáng tin | `lib/loginLimiter.js`; HMAC kiểm IP/timestamp/signature, giả header và thiếu cấu hình trả lỗi | Code/test local đạt; hạ tầng thiếu | Cao | Ingress bỏ header client rồi ký timestamp:IP thật; đồng bộ giờ, giữ secret, chặn bypass ingress | Chưa phân công; đề xuất hạ tầng |
| Rate limit | Theo nguồn 40/phút và tài khoản+nguồn 8/15 phút; TTL/LRU tối đa 5.000, test không khóa toàn cục | Một phần | Cao khi scale | DB/shared limiter đa instance, kiểm tải và NAT; giới hạn tầng edge chống nguồn phân tán | Chưa phân công; đề xuất Backend + hạ tầng |
| Session/cookie | `lib/auth.js`: token ngẫu nhiên 32 byte, chỉ lưu hash, session 8 giờ, user active/role kiểm server; cookie HttpOnly, SameSite=Strict, Secure production; mật khẩu scrypt+salt | Có code và test | Trung bình | Xác minh HTTPS/cookie thực ở môi trường đích, quản lý cấp/thu hồi tài khoản; recovery/MFA chưa có | Chưa phân công; đề xuất Backend + QA |
| API nhạy cảm/portal | `secured`, owner/business scope, proxy; test Traveler/Business/Guide/Admin, IDOR, Origin, body limit và API lỗi | Test local đạt | Trung bình | Kiểm lại route/API qua ingress thực, thử session hết hạn/thu hồi trong browser | Chưa phân công; đề xuất QA bảo mật |
| Booking/review | Server kiểm catalog/name/rating; booking requestId/hash chống lặp khi có key, trạng thái/owner và transaction; lỗi ghi không trả thành công | Code/test local đạt trong phạm vi demo | Trung bình | Client cũ không gửi requestId vẫn có thể tạo trùng; chưa có inventory/provider thật; ngày còn optional, chưa chặn ngày quá khứ | Chưa phân công; đề xuất Backend + sản phẩm |
| Consent/yêu cầu hỗ trợ | Booking chia sẻ tiếp cận opt-in; requests chỉ lấy shareAccessibility=true; inquiries mặc định tắt, Admin nhận khi bật và lưu được | Code/test local đạt | Cao nếu vận hành sai | Chính sách đồng ý/lưu giữ/xóa, người tiếp nhận và quy trình xử lý thực; không tự bật inbox | Chưa phân công; đề xuất sản phẩm + vận hành |
| SOS/Camera/OCR | Nhãn demo; GPS chỉ khi kích hoạt; test deny/unavailable/timeout/offline bằng mock; tel do người dùng bấm khi số rõ; mô tả AI mẫu cả TTS | Demo minh bạch | Cao nếu hiểu là cứu hộ | Chưa có đầu nhận SOS/AI/OCR; kiểm quyền và dialer trên thiết bị; không truyền tọa độ đến người nhận thật | Chưa phân công; đề xuất sản phẩm + QA |
| Logging/PII | Lỗi chung chỉ log code; phản hồi no-store; runtime/secret không trong ZIP; profile và liên hệ khẩn cấp lưu cục bộ | Code review một phần | Cao | Chính sách lưu dữ liệu, kiểm log của ingress/host, quyền truy cập backup, retention/xóa; chưa có audit hệ thống triển khai | Chưa phân công; đề xuất vận hành + chủ dữ liệu |
| Test/build | P9-tests 42/42; P9-http 203/203 trên localhost với DB/tài khoản tạm; P9-build thành công | Đạt trong môi trường local | Trung bình | Không có test dịch vụ bên ngoài, browser, tải thực. Lỗi scope biến phone ở lần build trước đã sửa và chạy lại đạt | Chưa phân công; đề xuất QA |
| Lint/typecheck | 0 lỗi/11 cảnh báo: 8 setState-in-effect, 1 dependency biz.items, 2 location.assign; 1 cảnh báo build tracing đường dẫn store | Đã phân loại | Trung bình | Theo dõi render/effect/navigation; kiểm file trace ở gói deploy. Không có script typecheck độc lập; bước nội bộ Next build đạt | Chưa phân công; đề xuất Frontend |
| SEO | Unit/HTTP metadata/canonical/sitemap/robots; chưa có domain thật, fallback noindex/canonical off/sitemap rỗng | Chỉ local | Trung bình | Đặt domain HTTPS lúc build; kiểm canonical/robots/sitemap trên domain thật, xác minh index policy | Chưa phân công; đề xuất SEO + vận hành |
| Theme/responsive/accessibility | Bootstrap theme VM test; 6 cặp token tương phản >=4,5; HTTP/code review; Playwright thiếu Chromium executable | Thiếu browser, chặn nghiệm thu | Cao | Kiểm light/dark/system/reload/CSP/first paint, desktop/mobile, keyboard, screen reader, SOS/Leaflet. Không tuyên bố WCAG AA | Chưa phân công; đề xuất QA + người dùng trợ năng |
| Rollback/monitoring | Kế hoạch bên dưới, chưa có môi trường deploy hay giám sát thật | Chưa diễn tập | Cao | Người trực, alerts, bản phát hành bất biến, backup/restore/migration tương thích, kiểm rollback trên staging | Chưa phân công; đề xuất vận hành |

## Kế hoạch mở chặn — chưa thực hiện

1. Chọn DB/môi trường; xây adapter giữ API/ID/owner/consent, import trên staging và đối chiếu dữ liệu. Không vô hiệu hóa chặn Vercel để dùng JSON.
2. Cấp secret ngoài source, cấu hình ingress ký nguồn và HTTPS/origin. Test cả truy cập đúng, giả header, thiếu cấu hình và lỗi storage; thiếu cấu hình phải tiếp tục trả lỗi.
3. Diễn tập backup/restore và rollback; kiểm lại auth, scope, consent, idempotency trong môi trường thật. Inbox chỉ bật khi có Admin/quy trình nhận.
4. Chạy browser/device/accessibility test các trang chính và portal, cả hai theme; kiểm GPS từ chối/lỗi/offline, keyboard, TTS, menu và dialer. Sửa lỗi ở một đợt riêng nếu audit tìm được, không thay code trong Prompt 10.
5. Kiểm domain/SEO, log và alerts, phân công người nghiệm thu; đánh giá lại quyết định sau khi có bằng chứng.

## Kế hoạch rollback và theo dõi — chưa thực hiện

- Trước phát hành: giữ artifact/hash phiên bản trước, snapshot DB mã hóa và phiên bản schema; thử restore sang DB riêng. Định nghĩa người quyết định và thời gian phục hồi mục tiêu trước khi mở traffic.
- Theo dõi 5xx/503/429, độ trễ, lỗi transaction/session, dung lượng DB, backlog hỗ trợ; log ID tương quan và mã lỗi, không log mật khẩu/token/tọa độ hay nội dung nhạy cảm. Cảnh báo và người trực chưa cấu hình.
- Khi vượt ngưỡng đã thống nhất hoặc phát hiện lộ/sai dữ liệu: ngừng ghi hoặc bảo trì theo runbook, giữ bằng chứng, chuyển về artifact trước chỉ khi schema tương thích. Nếu cần restore phải sao lưu trạng thái mới trước và có người có thẩm quyền quyết định để tránh mất dữ liệu mới.
- Sau rollback: kiểm login/ownership/booking/consent và checksum, thông báo tình trạng theo quy trình đã phê duyệt. Không xóa lock hay reset database tự động.

Không có secret/PII được đưa vào báo cáo. Không chạy thử phá hoại trên hệ thống thật; không tích hợp dịch vụ ngoài và không phát hành.
