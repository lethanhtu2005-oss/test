# Đợt A

Đối chiếu trực tiếp 150 file của test-main(2).zip với baseline: khớp toàn bộ; ZIP không có .git. Tạo Git riêng, không tác động repository của người dùng.

Trước sửa: 5/5 test validation đạt. Đã xác minh chip confirmed cố định, navigation không đọc to và thiếu SOS desktop/portal.

Sửa: nhãn booking theo 5 trạng thái hiện có và fallback chưa rõ; lỗi API riêng; map đối chiếu slug/id và tọa độ, cập nhật viewport khi URL đổi; không vẽ tuyến minh họa khi chọn đích; SOS ở header và Business/Admin/Guide; giữ mobile/footer; GPS chỉ chạy khi bấm, phân biệt từ chối/GPS/timeout/không hỗ trợ; nhận online/offline.

Test sau A: 9/9 đạt. Bao gồm test hàm GPS với mock và kiểm tra tĩnh nơi gọi; chưa thao tác trên thiết bị thật hoặc cấp quyền GPS thật. Không tuyên bố SOS gửi đi.
