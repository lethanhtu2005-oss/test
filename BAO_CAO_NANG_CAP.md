# Báo cáo nâng cấp WayEcho

Ngày bàn giao: 16/10/2026. Cơ sở thực hiện: `test-main.zip` và hai file yêu cầu Hòa gửi trong cùng lượt.

Đã chỉnh trực tiếp codebase Next.js App Router / React / Tailwind hiện có. Giữ dependency chính, cấu trúc API và các cổng Traveler, Business, Guide, Admin. Chưa đẩy thay đổi lên GitHub hay triển khai lên Vercel.

## 1. Phần đã thực hiện

| Yêu cầu | Thực hiện trong source |
| --- | --- |
| Giao diện tổng thể | Tổ chức lại trang chủ thành hero, điểm đến, hỗ trợ, cẩm nang, gallery, giới thiệu và footer. Loại các section giải thích tính năng lặp lại. Giữ nhận diện vàng ấm, bổ sung nền kem / xanh đậm, khoảng trắng và thẻ nội dung theo ngữ cảnh. |
| Typography | Font hệ thống hỗ trợ tiếng Việt, phân cấp tiêu đề, độ rộng bài đọc 72ch, line-height bài viết 1.8, bố cục một cột trên màn hình nhỏ. Không cần tải Google Fonts trong quá trình build. |
| Sáng / tối | Palette CSS variables dùng chung Tailwind và CSS mới. Có nút chuyển sáng/tối ở header và bảng hỗ trợ; lưu lựa chọn; khởi tạo theme trước nội dung để hạn chế nháy sai theme. Chưa chọn theme thì theo hệ điều hành. |
| Tiếp cận | Giữ chữ lớn, tương phản cao, giảm chuyển động và giọng đọc. Nâng focus toàn cục, skip link, kích thước nút, thao tác Escape và trả focus cho menu/bảng hỗ trợ chính. Gallery dùng liên kết thông thường nên không tạo lightbox có focus trap. |
| Trang chủ / gallery | Card ảnh và ảnh gallery dẫn tới đúng nội dung. Không quảng bá địa điểm là ‘dễ tiếp cận’ khi dữ liệu chỉ đang cần khảo sát. Có liên kết nguồn giấy phép ảnh. |
| Trung tâm Khám phá | 8 lối vào theo nhu cầu, đồng thời giữ 6 danh mục catalog cũ gồm hoạt động và vé. Có tìm theo tên/khu vực không phân biệt dấu, bộ lọc tiêu chí tiếp cận, thông báo không có kết quả và nút xóa lọc. |
| Điểm đến | 7 URL chi tiết có nội dung server-rendered: giới thiệu, trạng thái tiếp cận, di chuyển, gợi ý hỗ trợ, lưu ý, nguồn, bài đọc tiếp và điểm đến liên quan. Bổ sung Hoàng thành Thăng Long. |
| Chó dẫn đường | Hướng dẫn vai trò, ứng xử, chuẩn bị và xác nhận với từng địa điểm. Có ảnh thật, credit và nguồn kiến thức quốc tế. Không tuyên bố WayEcho cung cấp, huấn luyện hoặc cho thuê chó. |
| Về WayEcho | Trang giới thiệu mục tiêu, nguyên tắc dữ liệu, giới hạn prototype và nguồn ảnh. Không bịa thành tích, số người dùng, chứng nhận hoặc đối tác. |
| Cẩm nang | Danh sách và 4 bài có nội dung khác nhau, mục lục, giọng đọc, ảnh có nguồn, liên kết điểm đến và hướng dẫn liên quan. Mỗi bài liên kết tới 2 bài khác, không tự liên kết chính nó ở mục đọc tiếp. |
| Liên kết cũ | `/destination?d=...` và `/item?slug=...` cho điểm đến chuyển hướng 308 sang URL chi tiết mới. ID không tồn tại trả 404. Liên kết mới dùng URL có slug. |
| SEO on-page | Title, description và canonical riêng trên các trang nội dung; Open Graph / Twitter cho nội dung mới; H1 chính. Trang Hồ Hoàn Kiếm dùng tên Hồ Hoàn Kiếm trong title/H1 dù giữ slug `ho-guom` để nhất quán dữ liệu cũ. |
| Technical SEO | `sitemap.xml` tạo từ dữ liệu công khai, `robots.txt`, noindex cho trang cá nhân/công cụ/cổng demo. Không đưa admin hay hồ sơ vào sitemap. Deployment Vercel Preview có noindex và disallow. |
| Hình ảnh | 8 ảnh Commons tải cục bộ, ghi tác giả/giấy phép. Bản WebP responsive có srcset 480/960 khi kích thước gốc cho phép; lazy load ngoài ảnh chính. Có width/height cho ảnh mới; lỗi ảnh dùng placeholder trung tính. |
| Quảng cáo | Hai mẫu giới thiệu WayEcho theo ngữ cảnh, một mẫu đối tác tắt mặc định. Nhãn phân biệt, CTA có trang đích hợp lệ, không dùng thông tin cá nhân để chọn quảng cáo. |
| Quản lý quảng cáo | Trang `/admin/ads` trong admin hiện có: chỉnh/xem trước/lưu nháp cục bộ/xuất JSON. Bản nháp không tự phát hành cho người khác. Cấu hình phát hành nằm trong `data/ads.js`. |
| Đo lường quảng cáo | Chuẩn bị hook `wayecho:ad` cho impression/click sau opt-in, không gửi request theo dõi ra ngoài. Chưa có hệ thống lưu số liệu hoặc báo cáo CTR thực tế. |
| Chức năng cũ | Giữ tìm kiếm giọng nói, đọc nội dung, lưu điểm, chuyến đi, đặt dịch vụ, đánh giá, các cổng vai trò và PWA. Trình duyệt không hỗ trợ nhận giọng nói được hướng dẫn nhập chữ, không giả lập lời nói chưa được người dùng cung cấp. |
| Chia sẻ yêu cầu hỗ trợ | Sửa luồng booking để khi tắt chia sẻ, cờ yêu cầu hỗ trợ cũng không được gửi như thể người dùng đã đồng ý. |

## 2. Trang và component chính mới

### Trang

- `/about`.
- `/articles` và `/articles/[slug]` với 4 bài.
- `/destination/[slug]` với 7 điểm đến.
- `/explore/support`, `/explore/guide-dogs`, `/explore/assistive-technology`.
- `/admin/ads`.
- `/sitemap.xml`, `/robots.txt`; cập nhật sơ đồ HTML `/sitemap`.

Giữ trang danh sách `/destination`, `/explore`, `/item`, các công cụ và API đang có. Component `app/destination/DestinationView.jsx` cũ không còn được dùng.

### Component / dữ liệu

- `ContentCards`, `Breadcrumbs`, `ReadButton`, `ImageCredit`, `ServiceTiles`, `ExploreResults`.
- `ThemeToggle`, `ContextAd`, `AdCard`.
- `data/articles.js`, `topics.js`, `visit-guides.js`, `ads.js`, `media.js`, `image-sizes.js`.
- Sửa `A11yProvider`, `Header`, `Footer`, `AccessibilityToolbar`, `VerifiedImage` và các link đến điểm đến.
- `lib/seo.js` tập trung cấu hình domain / metadata.
- `scripts/verify-production.mjs` chạy kiểm tra HTTP/API với store thử nghiệm tách biệt.

## 3. Dữ liệu thật, dữ liệu mẫu và điều chưa xác minh

**Có nguồn trong dự án:** tên địa danh, mô tả cơ bản và nguồn tham quan của 6 điểm cũ. Các ngày kiểm tra lịch sử 21/09/2026 được giữ nguyên; không giả vờ đã khảo sát lại toàn bộ. Giá, giờ và các chính sách cũ cần kiểm tra lại khi sử dụng thực tế. Riêng mô tả tổng quan và địa chỉ Hoàng thành Thăng Long tham chiếu website của Trung tâm Bảo tồn di sản Thăng Long – Hà Nội; ảnh Đoan Môn lấy từ Commons.

**Ảnh có nguồn:** metadata ảnh mới lưu tại `public/assets/images/media-sources.json`; credit và giấy phép được công khai ở `/about#image-credits`. Ảnh chó dẫn đường chỉ minh họa nội dung kiến thức, không hàm ý quan hệ đối tác.

**Nội dung biên soạn mẫu:** 4 bài cẩm nang, gợi ý chuẩn bị chuyến đi, câu hỏi cần trao đổi và hướng dẫn các công cụ. Có nhãn nội dung mẫu cho prototype, không gán tên tác giả báo chí hoặc ngày xuất bản giả.

**Chưa xác minh thực địa:** độ phù hợp với người mù / người nhìn kém, lối không bậc, Braille, hỗ trợ tại chỗ và chính sách chó dẫn đường ở từng địa điểm. Chưa đủ bằng chứng thì hiển thị rõ trạng thái cần xác minh.

**Vẫn là demo:** nhà cung cấp lưu trú/ăn uống/di chuyển/tour, booking/payment, business/guide/admin, bản đồ chỉ đường, trợ lý camera, SOS và phần quản lý quảng cáo cục bộ. Không có đối tác quảng cáo thật đang phát hành. Store prototype hiện dùng JSON hoặc bộ nhớ, có thể mất dữ liệu khi Vercel instance khởi động lại; các cổng chưa phải hệ thống xác thực/phân quyền production.

## 4. Kết quả kiểm tra

| Kiểm tra | Kết quả |
| --- | --- |
| Cài dependency bằng `npm ci` | Thành công với lockfile hiện có. |
| `npm run build` | Thành công trên Next.js 16.3.6; tạo 59 trang tĩnh trong báo cáo build. |
| `npm test` | 9/9 test đạt, gồm test nghiệp vụ cũ, quan hệ nội dung, ảnh, lọc quảng cáo và cặp màu. |
| `npm run lint` | 0 lỗi, 10 cảnh báo. Chủ yếu là đồng bộ state từ trình duyệt trong effect và một cảnh báo dependency effect ở trang business reviews. |
| `npm run test:routes` | PASS: 23 trang nội dung công khai, 52 URL nội bộ duy nhất; kiểm tra 1.152 lần xuất hiện link và 148 phần tử ảnh. |
| Metadata | 23/23 trang công khai trong bộ kiểm tra có title và description riêng, canonical phù hợp và 1 H1. |
| Đường dẫn cũ / sai | 3 redirect 308 và 5 trường hợp URL sai trả 404 đạt kiểm tra. |
| API cũ | Đã thử lưu/xóa điểm, thêm/xóa chuyến đi, tạo booking kèm request, chuyển trạng thái và tạo booking không chia sẻ request. Dữ liệu test tách biệt, không ghi vào file dữ liệu người dùng. |
| SEO kỹ thuật | Sitemap/robots tải được, không chứa trang cá nhân/admin trong sitemap; các trang công cụ kiểm tra có noindex. |
| Màu | Các cặp chữ chính/phụ/link với nền chính/nền phụ/thẻ của 2 theme đạt tối thiểu 4.5:1 trong kiểm tra số học. Màu focus đạt 3:1 với nền chính. Đây không phải kết quả audit toàn bộ giao diện. |

Log chạy nằm trong `docs/validation/`. Không có kiểm tra Google index thực tế hoặc đo thứ hạng.

## 5. Những phần cần kiểm tra trực tiếp hoặc dữ liệu của chủ website

1. Kiểm tra trực quan trên máy tính, máy tính bảng và điện thoại; thao tác toàn bộ luồng bằng bàn phím, NVDA/VoiceOver/TalkBack; giọng đọc/micro và việc giữ lựa chọn theme sau tải lại. Môi trường thực hiện không có trình duyệt QA được hỗ trợ nên chưa kiểm tra tương tác client, hydration/console, responsive và screen reader trên thiết bị thật. Không tuyên bố đã đạt chứng nhận WCAG hoặc không có lỗi console trình duyệt.
2. Chủ website xác nhận domain Production, cấu hình `NEXT_PUBLIC_SITE_URL`, tự xác minh Search Console và gửi sitemap. Chưa có quyền/tài khoản Search Console trong công việc này. Không khẳng định website đã được lập chỉ mục.
3. Cần khảo sát và nguồn cập nhật để công bố tiện ích tiếp cận thực tế, điều kiện nhận chó dẫn đường, giá/giờ và nhà cung cấp. Chưa có thì không mở quảng cáo dịch vụ như thể đã xác minh.
4. Muốn quản lý quảng cáo dùng chung nhiều người, đặt dịch vụ hoặc lưu dữ liệu production: cần backend có xác thực/phân quyền và lưu trữ bền vững. Bản hiện tại giữ kiến trúc prototype thay vì tự tạo backend chưa được kiểm chứng.
5. Cần tài khoản đo lường thật và cơ chế đồng ý của người dùng trước khi thu thập số liệu quảng cáo. Hiện hook đo lường chưa tự gửi dữ liệu ra ngoài.

## 6. Tài liệu đi kèm

- `HUONG_DAN_CAP_NHAT.md`: cập nhật GitHub / Vercel, cấu hình domain và Search Console.
- `docs/ADS_CONFIGURATION.md`: dữ liệu quảng cáo và giới hạn bản nháp.
- `docs/CHANGED_FILES.md`: danh sách file thêm, sửa, bỏ so với ZIP gốc.
- `docs/validation/`: log build, lint, test và kiểm tra HTTP.

Source sẵn sàng để chủ website kiểm tra và triển khai trên Vercel; không cần đổi framework hoặc tạo lại dự án.
