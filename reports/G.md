# Đợt G

Hiện trạng đã xác minh: toàn bộ Business dùng hằng b1; các nút profile/reply/Guide schedule/Admin verification chỉ đổi client; chưa có đường tiếp nhận hợp tác thật. Giữ đăng nhập server, role/owner/consent của B, không đưa cơ chế cờ client trở lại.

BusinessShell lấy businessId từ phiên server trước khi render; các trang Business dùng phạm vi đó. API vẫn tự kiểm scope, không tin context client. Sửa lỗi API/empty và thông báo lỗi mutation trong Business, Trip, Notifications, Admin và Item. Không đổi state thành công khi request thất bại.

3 trang /partners/business, /partners/guide, /partners/cooperate giải thích mục đích, thông tin cần gửi và các bước có thật. Guide register giữ route cũ và dùng form đăng ký quan tâm; không tự tạo account. /api/inquiries POST công khai có mục đích rõ, kiểm Origin, giới hạn body, validation, consent bắt buộc, dedupe 24 giờ và giới hạn gửi; GET chỉ Admin. Form không nhận giấy tờ nhạy cảm. Khi chưa bật WAYECHO_INQUIRIES_ENABLED hoặc chưa có Admin, không lưu hoặc báo thành công. Quản trị đọc inbox; không giả gửi email/SMS, phê duyệt hay xác minh.

Khi được bật và có storage một host, yêu cầu quan tâm được lưu thực, có receipt. Schema thêm collection inquiries, status duy nhất received; giữ các collection/key cũ. Không triển khai DB production, CRM, xét duyệt danh tính, phân công Guide hoặc thanh toán. Profile/lịch Guide, profile/reply Business, ẩn review/xác minh đối tác vẫn DEMO và được ghi rõ chưa lưu server.

Consent booking luôn bắt đầu tắt, không lấy lựa chọn mặc định của hồ sơ cũ làm bằng chứng đồng ý cho booking mới. Privacy mô tả đúng dữ liệu cục bộ/server, đánh giá công khai và giới hạn xóa/retention. Không tự tạo kênh liên hệ.

Kiểm thử tổng: 27/27 test đạt; 202/202 HTTP (trước cập nhật văn bản privacy) đạt, gồm startup/restart, role/owner, links/anchor, đúng HTTP 404, nhận form/dedupe và revoke session. HTTP tìm thấy /explore chỉ trả fallback vì query client; đã đặt render động tại layout Explore/Search/Navigation/Booking để trả nội dung thực, giữ mọi query và URL. Test chạy lại đạt. Lint 0 lỗi 11 cảnh báo; build thành công. Xem TEST_RESULTS.md để biết kết quả sau lần kiểm tra cuối.

Giới hạn: không Chromium nên chưa test browser, screen reader, responsive hoặc nhập form trực tiếp. Online/offline/GPS dùng mock, không kết nối cứu hộ. Mọi API trên Vercel cần lưu vẫn fail closed 503 vì chưa có phương án DB bền vững. Không được coi hệ thống sẵn sàng production.
