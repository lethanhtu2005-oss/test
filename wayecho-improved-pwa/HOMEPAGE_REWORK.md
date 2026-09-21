# WayEcho — Homepage rework

Cập nhật theo bộ mockup trang chủ đã chốt trong hội thoại.

## Đã thay đổi
- Viết lại trang chủ theo đúng thứ tự nội dung của 4 mockup: Hero → tìm kiếm → chọn theo nhu cầu → gợi ý Hà Nội → giới thiệu tính năng → lý do hữu ích → trợ lý trong hành trình → 4 bước → trải nghiệm → tải app → hỗ trợ → footer.
- Thêm nút Camera cạnh Micro ở Hero và khu tìm kiếm.
- Bỏ các khối cũ: thư viện ảnh rời, logo “Đồng hành cùng”, dải số liệu không chắc chắn và tuyên bố hỗ trợ 24/7.
- Header thêm: Đặt chỗ, Tương phản, Chữ lớn, Đăng nhập theo mockup.
- Footer theo mockup mới; **đã bỏ “Đăng nhập đối tác”**. Người dùng đi qua “Dành cho doanh nghiệp” hoặc “Dành cho Guide & Assistant”.
- Không dùng ảnh generated cho trang chủ mới. Các ảnh nội dung dùng nguồn Wikimedia Commons có mô tả địa điểm/chủ thể rõ ràng.
- Mọi thẻ ảnh có `alt`; ảnh nguồn lỗi sẽ rơi về placeholder trung tính, không thay bằng ảnh địa điểm khác.
- Nguồn ảnh được bổ sung tại `public/assets/images/CREDITS.md` và mục `/help#credits`.

## Lưu ý dữ liệu
Một số câu chữ/rating trong mockup được giữ nguyên theo yêu cầu “y hệt 100% chữ”. Trước khi dùng như sản phẩm thật, nên đối chiếu/kiểm duyệt các nhãn accessibility và testimonial với dữ liệu thực tế.

## Chạy dự án
```bash
npm ci
npm run dev
```
Sau đó mở http://localhost:3000
