# Đợt F

Kiểm tra hiện trạng: root có metadata chung, chưa có canonical/sitemap XML/robots; item và destination sai slug chỉ hiển thị giao diện lỗi HTTP 200. Search và navigation là chức năng query, không nên mất tham số vì SEO.

Thêm lib/seo.js, metadata riêng cho trang công khai, canonical query chính xác theo dữ liệu, Open Graph, WebSite và Article JSON-LD tối thiểu. Không tạo author/date/rating/address/schema nhà cung cấp giả. Giữ URL query của destination và id/slug alias item. Item trỏ điểm đến redirect tới đúng destination; slug/item không có trả 404 bằng notFound. Bài viết sai slug cũng 404.

NEXT_PUBLIC_SITE_URL phải là domain https chính thức, không nhận localhost/example/IP/test/invalid; khi chưa có thì không tạo canonical, sitemap rỗng và public metadata noindex để tránh coi preview là production. Cần đặt biến lúc build, build lại rồi kiểm tra HTML thật. robots chỉ khai báo sitemap nếu có domain; không chặn tài nguyên CSS/JS, không coi robots là bảo mật. Private/portal/search/navigation/SOS/camera/review/booking/demo có noindex. Proxy và API vẫn chịu trách nhiệm bảo mật.

Sitemap XML gồm trang công khai nội dung có thật, 7 destination query (mỗi query là nội dung khác nhau), 3 bài và trang chó dẫn đường; không đưa API, tài khoản, portal hay dịch vụ demo. Không đặt lastModified giả.

23/23 test đạt; lint 0 lỗi 11 cảnh báo. Build đầu F lỗi cache nội bộ Turbopack static_sorted_file (range end index out of range); di chuyển cache build sang thư mục tạm rồi build lại từ đầu. Kết quả build lại được lưu trong báo cáo kiểm thử tổng.

Chưa có domain chính thức, tài khoản Search Console hoặc dữ liệu index. Không tạo tài khoản, không gửi sitemap, không hứa Google index. Các việc này cần cấu hình và kiểm tra sau deploy được chủ dự án phê duyệt. Chưa kiểm browser/social scraper/Rich Results thực tế.
