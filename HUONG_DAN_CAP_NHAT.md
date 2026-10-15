# Cập nhật WayEcho lên GitHub và Vercel

Bản này chỉnh sửa trực tiếp dự án Next.js hiện tại. Không cần tạo website hoặc dự án Vercel mới. Chưa có thao tác cập nhật GitHub hay triển khai Vercel từ gói ZIP này.

## 1. Đưa source lên GitHub bằng trình duyệt

1. Tải và giải nén `test-main.zip`.
2. Mở thư mục `test-main`. Bên trong phải thấy `app`, `components`, `data`, `public`, `package.json` và các file cấu hình.
3. Đăng nhập GitHub bằng **lethanhtu2005-oss**, tài khoản đã triển khai thành công trong phiên làm việc này.
4. Mở repo `lethanhtu2005-oss/test`, chọn nhánh `main`.
5. Chọn **Add file → Upload files**.
6. Kéo **nội dung bên trong** thư mục `test-main` lên GitHub; không kéo nguyên thư mục cha để tránh tạo `test-main/app` bên trong repo. Giữ nguyên cấu trúc `app`, `components`, `data`, `public` ở cấp gốc. Nếu trình duyệt không nhận cả thư mục, chia thành từng đợt upload.
7. Chọn ghi đè các file cùng đường dẫn. Ghi thông điệp commit: `Upgrade WayEcho design, content and SEO`.
8. Chọn **Commit directly to the main branch** rồi lưu. Commit cần do chính tài khoản GitHub đã liên kết với chủ dự án Vercel tạo.
9. File cũ `app/destination/DestinationView.jsx` đã được thay bằng trang danh sách server và trang `/destination/[slug]`. Nếu upload bằng web không xóa file này, xóa nó trong repo. Không còn component nào cần import file đó.

Không upload `node_modules`, `.next`, dữ liệu `data/db.json`, file `.env.local`, token hoặc thông tin đăng nhập. Gói ZIP bàn giao không chứa các mục này.

## 2. Cấu hình và kiểm tra trên Vercel

Dùng dự án `test` đang có. Cấu hình build vẫn là Next.js, lệnh `npm run build`, thư mục gốc là cấp có `package.json`.

Trong **Settings → Environment Variables**, nên đặt:

| Tên | Giá trị |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL Production chính thức, bắt đầu bằng `https://`, không thêm đường dẫn. Nếu chưa đổi domain, source hiện mặc định `https://test-qhoodmhu3-ltt17.vercel.app`. Hãy đối chiếu URL này với Domains của dự án. |
| `GOOGLE_SITE_VERIFICATION` | Chỉ phần mã `content` do Google Search Console cấp, nếu dùng cách xác minh HTML tag. Có thể để trống khi chưa xác minh. |

Sau khi đổi biến môi trường, cần triển khai lại để metadata và sitemap nhận giá trị mới.

Mở **Deployments**, chờ lần triển khai mới nhất thành **Ready** rồi bấm **Visit**. Nếu báo **Blocked**, kiểm tra tác giả commit và liên kết tài khoản như lần xử lý trước; đây là kiểm tra quyền triển khai. Nếu báo **Error**, mở Build Logs để xem lỗi cụ thể.

Không cần thay đổi gói dịch vụ chỉ để dùng gói source này. Việc dùng repo Private trên Hobby vẫn chịu điều kiện về chủ tài khoản/tác giả commit của Vercel.

## 3. Kiểm tra nhanh sau triển khai

- Trang chủ mới, menu Khám phá, Cẩm nang và Về WayEcho mở được.
- `/destination/ho-guom`, `/destination/van-mieu`, `/destination/hoang-thanh-thang-long` có nội dung riêng.
- `/explore/guide-dogs` hiển thị hướng dẫn và giới hạn thông tin, không có lời mời thuê chó dẫn đường.
- Đổi Sáng / Tối, bật Chữ lớn, Tương phản cao, Giảm chuyển động. Tải lại trang để kiểm tra lưu lựa chọn.
- Dùng Tab / Shift+Tab; mở menu và bảng hỗ trợ bằng Enter; dùng Escape để đóng.
- Mở ảnh trên điện thoại, kiểm tra không tràn ngang và các liên kết trong gallery.
- Nghe bài viết, dừng đọc; thử tìm kiếm giọng nói trên trình duyệt được hỗ trợ. Luôn có phương án nhập chữ.
- Mỗi bài cẩm nang có mục đọc tiếp dẫn sang bài khác.
- `/sitemap.xml` và `/robots.txt` tải được. Canonical cần dùng đúng domain Production.
- Thử lưu điểm, thêm chuyến đi và đặt dịch vụ demo. Không nhập dữ liệu nhạy cảm vào prototype.

Nếu trình duyệt vẫn hiện giao diện cũ, tải lại bằng Ctrl+Shift+R. Service worker đã tăng phiên bản cache để thay tài nguyên cũ; có thể cần đóng và mở lại tab.

## 4. Google Search Console

1. Chủ website tự mở `https://search.google.com/search-console` và thêm website.
2. Nếu dùng domain riêng và quản lý DNS, có thể xác minh Domain property bằng bản ghi DNS do Google cấp. Nếu dùng tên miền Vercel, chọn URL prefix đúng `https://...`.
3. Với URL prefix / HTML tag: lấy mã trong `content="..."`, đặt vào `GOOGLE_SITE_VERIFICATION`, triển khai lại rồi bấm Verify trên Search Console.
4. Trong mục Sitemaps, gửi `sitemap.xml`.
5. Trong URL Inspection, kiểm tra trang chủ và ba trang điểm đến chính. Dùng kiểm tra URL trực tiếp để xem trang có thể được thu thập hay không; chỉ yêu cầu lập chỉ mục khi nội dung và URL đã đúng.
6. Theo dõi Page indexing và hiệu suất tìm kiếm sau khi Google xử lý. Có sitemap hoặc metadata không đồng nghĩa đã được index hay có thứ hạng.

Các deployment Preview trên Vercel được đặt noindex và robots disallow. Các khu vực admin, hồ sơ, đặt chỗ và công cụ demo không có trong sitemap công khai.

## 5. Chạy trên máy để kiểm tra

Cài Node.js tương thích Next.js đang dùng, sau đó mở terminal trong thư mục `test-main`:

```sh
npm ci
npm run dev
```

Kiểm tra trước khi triển khai:

```sh
npm test
npm run lint
npm run build
npm run test:routes
```

`test:routes` chạy production server tạm trên cổng 3487, kiểm tra HTTP/API bằng dữ liệu tách biệt rồi tự đóng. Nếu cổng đang được dùng, đổi cổng trong `scripts/verify-production.mjs`. Cần chạy build trước lệnh này. Công cụ này không thay thế kiểm tra bằng trình duyệt hoặc trình đọc màn hình.
