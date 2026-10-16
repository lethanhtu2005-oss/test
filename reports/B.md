# Đợt B

Đã thêm tài khoản được cấp bằng CLI, mật khẩu scrypt có salt, token ngẫu nhiên lưu hash, cookie HttpOnly/SameSite Strict/Secure khi production, hạn 8 giờ, thu hồi khi logout và giới hạn thử đăng nhập. Không có mật khẩu mặc định; không tự mở đăng ký tài khoản hoặc chọn dịch vụ có phí.

Bảo vệ proxy cho Business/Admin/Guide và dữ liệu Traveler; API kiểm server role và owner. Mỗi Business chỉ đọc/phản hồi dữ liệu businessId được cấp, Traveler chỉ được hủy booking của mình; Guide chưa có cơ chế phân công nên không được tự nhận booking thật. Review GET là nội dung công khai, được lọc trường trả về; POST cần Traveler. Notifications POST chỉ Admin gửi tới user hợp lệ.

Consent mặc định false; server chỉ nhận shareAccessibility === true, nếu tắt thì bỏ assist/nội dung/ghi chú hỗ trợ, không tạo request hoặc thông báo request. Profile vẫn lưu cục bộ; không tải toàn bộ profile lên server.

JSON: bỏ fallback bộ nhớ, khóa ghi liên tiến trình cùng host, đọc lại từ đĩa, ghi file tạm + fsync + atomic rename, booking/request/notifications cùng transaction. Lỗi ghi trả 503 và không đổi bản gốc. JSON lỗi không bị thay bằng seed. Giữ key cũ; dữ liệu thiếu owner không tự gán hoặc hiển thị cho tài khoản mới. Service worker không cache trang riêng tư; xóa cache phiên bản cũ khi activate.

Kiểm tra: 16/16 unit/API-handler test đạt; lint 0 lỗi 10 cảnh báo; build Next.js 16.3.6 thành công (dependencies đã có). HTTP thực trên localhost: 28/28 check proxy/login/logout/role/API đạt. Chưa có binary Chromium nên chưa kiểm trình duyệt, layout hoặc screen reader. Dự án JavaScript không có script typecheck/tsconfig; build không thay thế một cuộc kiểm toán type riêng.

Giới hạn production: Vercel bị chặn thao tác lưu bằng 503. Chỉ bật JSON production với WAYECHO_STORAGE_MODE=local-single-host, WAYECHO_ORIGIN chính xác và WAYECHO_DATA_PATH trên volume bền vững; không dùng multi-host/NFS. Chưa có backup/restore đã kiểm chứng, email/khôi phục tài khoản, MFA hoặc DB production. Không tự nhận hoàn thành migration. Lock còn lại do tiến trình chết phải được kiểm tra thủ công khi dừng toàn bộ writer, không tự xóa lock đang chạy.
