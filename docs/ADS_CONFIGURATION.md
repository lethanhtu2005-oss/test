# Quản lý quảng cáo WayEcho

## Cấu hình đang phát hành

`data/ads.js` là nguồn cấu hình được triển khai cùng website. Có hai mẫu nội dung giới thiệu WayEcho đang hoạt động theo danh mục. Mỗi vị trí chỉ lấy một mẫu phù hợp ngữ cảnh, không dựa trên hồ sơ người dùng.

Mẫu quảng cáo đối tác có `active: false`, `demo: true`, `verified: false`. Nó không hiển thị trong nội dung công khai. Có thể xem rõ nhãn demo ở `/admin/ads`.

Chỉ khi có đối tác thật mới bổ sung dữ liệu tên, mô tả, ảnh được phép sử dụng và trang đích có thật. Để phát hành, cần đủ `active: true`, `verified: true`, `demo: false` và `partner` hợp lệ. Bổ sung trang đích thực tế vào `adDestinations` sau khi kiểm tra; danh sách hiện tại chỉ chứa các trang nội bộ đã có. Giữ nhãn nhận diện quảng cáo.

## Trang quản lý hiện tại

`/admin/ads` tích hợp vào menu quản trị sẵn có. Có thể chỉnh tiêu đề, mô tả, nhãn, CTA, trang đích và trạng thái bản nháp; xem trước hai kiểu quảng cáo; lưu nháp vào localStorage; xuất JSON cho quản trị viên cập nhật source.

Lưu nháp không thay đổi website cho người khác. Đây là lựa chọn phù hợp với admin demo hiện tại, chưa có backend xác thực và phân quyền thực tế. Không thêm API ghi quảng cáo công khai chưa được bảo vệ.

## Theo dõi hiệu quả

Chưa gắn dịch vụ analytics, chưa có báo cáo lượt xem, lượt nhấp hoặc CTR thực tế.

Đã chuẩn bị sự kiện trình duyệt `wayecho:ad`, chỉ phát khi `we-analytics-consent` có giá trị `yes`. Payload chỉ gồm `type` (`impression` / `click`) và `adId`; không kèm thông tin thị lực, hồ sơ, vị trí hay thông tin cá nhân. Hiển thị được ghi nhận khi ít nhất 50% khối quảng cáo đi vào khung nhìn. Bản xem trước không phát sự kiện. Hiện chưa có hệ thống nhận/lưu các sự kiện này.

Khi bổ sung analytics thật, cần bổ sung giao diện lựa chọn đồng ý thích hợp và bộ nhận sự kiện, chống trùng/bot, lưu dữ liệu phù hợp trước khi tính CTR. Không tự bật consent trong source.
