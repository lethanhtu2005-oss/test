# Kết quả mới nhất sau Prompt 8–9

Prompt 8: 36/36 test, 202/202 HTTP. Prompt 9: **42/42 test, 203/203 HTTP**, lint 0 lỗi/11 cảnh báo, build thành công (1 cảnh báo filesystem tracing). Log riêng trong `reports/evidence/P8-*` và `P9-*`. Không có typecheck độc lập; chưa chạy browser vì thiếu Chromium. Xem `P8.md`, `P9.md` và `P10_RELEASE_READINESS.md`.

Các kết quả A–G dưới đây là lịch sử checkpoint, không phải số lượng test của bản mới nhất.

# Kết quả kiểm thử thực tế

| Loại | Kết quả | Phạm vi và giới hạn |
|---|---|---|
| Baseline trước sửa | 5/5 test đạt | Chỉ validation của ZIP gốc. |
| Đợt A | 9/9 test đạt | Booking label, navigation target, mock GPS và vị trí gọi SOS. |
| Sau B | 16/16 test đạt, 28 HTTP đạt | Server auth, role, owner, consent, lỗi ghi và API/proxy trên localhost. |
| Sau C | 17/17 test đạt | Kiểm logic/code, giữ TTS và không giả voice search. |
| Sau D | 19/19 test đạt | Tìm kiếm không dấu và kiểm link/gallery/code. |
| Sau E | 21/21 test đạt | Bài liên quan/điểm đến có thật, thiếu ảnh/tọa độ xử lý rõ. |
| Sau F | 23/23 test đạt | Metadata, canonical, cấu hình domain và escape JSON-LD. |
| Cuối G và toàn bộ bản sửa | **27/27 test đạt** | API handlers thật, mock GPS, consent, owner/role, lỗi ghi rollback, inquiry validation/dedupe, 3 tiến trình ghi đồng thời, body 64 KiB. |
| HTTP cuối trên production build localhost | **202/202 kiểm tra đạt** | Route/title/H1, link/anchor, 404, proxy và 6 tài khoản kiểm thử tạm, login/logout, Business scope, IDOR, nhận inquiry, gửi trùng, session/booking còn sau restart. |
| Lint cuối | **0 lỗi, 11 cảnh báo** | Chủ yếu đồng bộ state trong effect, dependency hook và điều hướng location.assign. Không tắt rule để che lỗi. |
| Build cuối | **Thành công** | Next 16.3.6, React 19.3.0, Node 24.19.0; dependency sẵn có, không đổi package/lock. Còn 1 cảnh báo tracing filesystem động của JSON store. |
| Typecheck | Không có script typecheck/tsconfig riêng | Build chạy bước TypeScript nội bộ và hoàn tất; dự án là JavaScript/JSX, chưa có kiểm kiểu toàn dự án độc lập. |
| Browser/visual | **Chưa thực hiện** | Có Playwright nhưng không có executable Chromium. Không xác nhận layout tại viewport, keyboard thực hoặc screen reader. |
| GPS, mic, TTS trên thiết bị | **Chưa thực hiện** | GPS/online-offline dùng mock; chưa cấp quyền thiết bị thật. |
| Production/dịch vụ ngoài | **Chưa thực hiện** | Không deploy; không có provider AI/OCR/routing/SOS/payment/email hoặc DB production. |

Lệnh đã chạy: `npm test`, `npm run lint`, `npm run build`, `node scripts/http-smoke.mjs`.

Log được giữ trong `reports/evidence/`. Cảnh báo npm về biến môi trường http-proxy và Node về module type không làm test/build thất bại. Không thêm type:module chỉ để tắt cảnh báo vì tailwind/postcss hiện dùng CommonJS.

Các lỗi bắt được trong quá trình kiểm tra và đã xử lý:

- Hai link hero vẫn dùng item?slug: test D phát hiện, sửa về đúng destination, không bỏ assertion.
- Build F gặp lỗi cache nội bộ Turbopack range end index: tách cache build lỗi khỏi source và build lại sạch thành công. Không đổi dependency hoặc tự báo thành công cho lần lỗi.
- HTTP bắt /explore chỉ có loading shell: sửa layout render động cho Explore/Search/Navigation/Booking, giữ query và chạy lại toàn bộ HTTP đạt.
- Không dùng browser thiếu binary làm căn cứ khẳng định responsive hoặc WCAG AA.

Bản build có cảnh báo filesystem tracing vì đường dẫn JSON cấu hình động. Trước đóng gói/deploy theo môi trường thực cần kiểm phạm vi trace và giữ dữ liệu runtime/bản sao lưu ngoài source/public. Bản ZIP bàn giao không chứa file DB runtime, tài khoản thử, .next, node_modules hay .git.

Đã thử áp dụng tuần tự cả 7 patch lên một bản giải nén mới của ZIP gốc: A, B, C, D, E, F, G đều áp dụng sạch và test tại từng checkpoint đều đạt (9, 16, 17, 19, 21, 23, 27). Mã dựng lại khớp byte với bản bàn giao. Hai phần SOS-only của Header/GuideNav nằm trong patch A; phần auth của cùng file nằm ở patch B. Log `A-patch-tests.log` đến `G-patch-tests.log` lưu bằng chứng.
