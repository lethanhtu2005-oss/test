# Đợt D

Hiện trạng xác minh: homepage có bốn phần mô tả lợi ích/công cụ/quy trình gần nhau, thẻ điểm đến dùng dữ liệu riêng và nhãn tiếp cận quá chắc chắn; link slug/id sai; Guide cho Traveler trỏ login; search chỉ tìm 6 điểm đến và bỏ q; chưa có gallery.

Sửa trực tiếp homepage: chỉ gỡ khối “Vì sao WayEcho hữu ích” ba bước vì trùng quy trình bốn bước phía sau; giữ overview tính năng, các công cụ, quy trình bốn bước, toàn bộ CTA có giá trị; sửa mô tả AI/điều hướng/Guide đúng giới hạn demo. Dữ liệu thẻ từ destinations, testimonial mẫu ghi rõ tình huống minh họa, không coi là review thật.

Gallery tái sử dụng ảnh hiện có với nguồn, alt, fallback, lazy loading, native dialog (Escape/focus theo trình duyệt), ảnh trước/sau và CTA chi tiết. Không tạo ảnh bằng chứng tiếp cận. Giữ VoiceBar, Reveal, FeaturedCarousel.

Khám phá giữ bộ lọc có dữ liệu, thêm lối tới dịch vụ Guide DEMO/hồ sơ/SOS; danh mục sai về tổng quan có thông báo. Search tìm toàn catalog theo tên/khu vực/loại/không dấu và đọc q; giữ voice, thêm bộ lọc có dữ liệu. Item chấp nhận cả id và slug cũ. Anchor GuideSchedule có id.

Test D bắt 2 link slug còn sót ở collage hero, đã sửa đúng đích rồi chạy lại. Không sửa test để bỏ lỗi. Lint có 0 lỗi 11 cảnh báo; build đã chạy thành công trước sửa 2 href, chạy lại sau chỉnh. Chưa kiểm native dialog/focus/responsive bằng browser vì thiếu Chromium. Ảnh bên ngoài vẫn phụ thuộc mạng và quyền sử dụng kế thừa source; không tái xác minh toàn bộ license/địa điểm trong đợt này.
