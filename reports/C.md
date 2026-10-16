# Đợt C

Kế hoạch và hiện trạng: chưa có data-theme/dark theme; đã có data-contrast high và chữ lớn. Chỉ hoàn thiện cơ chế hiện có, không tạo công tắc theme thứ hai. Vấn đề xác minh: voice search tự trả Văn Miếu khi không có SpeechRecognition; panel 300px cố định; nút đóng nhỏ; chữ lớn chỉ tăng body nên phần dùng rem không đổi; placeholder và vùng form chưa đồng bộ tương phản.

Sửa globals.css về line-height/reflow/focus/input/placeholder/chữ lớn/tương phản cao; panel co theo màn hình, có Escape và focus trở lại; voice search không giả dữ liệu, báo thiếu hỗ trợ/lỗi micro và cho nhập bàn phím. Giữ font, logo, bảng màu thương hiệu, route và toàn bộ nghiệp vụ A/B.

17/17 test đạt; lint 0 lỗi 10 cảnh báo; build thành công. Sau bổ sung thông báo lỗi micro chạy lại các check trong checkpoint. Kiểm responsive/bàn phím hiện là kiểm code, chưa browser: thư viện Playwright có nhưng thiếu executable Chromium. Chưa kiểm NVDA/VoiceOver/TalkBack, thiết bị GPS/micro và CSS ở từng viewport thực tế. Không tuyên bố đạt WCAG AA hoặc theme tối hoàn chỉnh. Theme sáng/tối còn cần quyết định thiết kế riêng nếu muốn bổ sung.
