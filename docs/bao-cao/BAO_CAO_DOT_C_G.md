# Báo cáo Đợt C → G

> Ngày 17/10/2026 · Nhánh **`upgrade/a-g`**, đã push lên GitHub (chưa merge `main`, chưa deploy production)
> Tạo PR khi sẵn sàng: https://github.com/lethanhtu2005-oss/test/pull/new/upgrade/a-g
> Log: `D:\PROJECT_ALL\echo\baseline\batch-cg\`

## ⚠️ Việc bạn cần làm trên Vercel

| Biến | Bắt buộc? | Thiếu thì sao |
|---|---|---|
| `WAYECHO_SESSION_SECRET` (≥ 32 ký tự ngẫu nhiên) | **Bắt buộc** | Mọi API của Traveler trả 503: không đặt chỗ, không lưu được |
| `NEXT_PUBLIC_SITE_URL` (domain https chính thức) | Cần cho SEO | Toàn site gắn `noindex`, không có canonical, sitemap rỗng (an toàn cho bản preview) |
| `WAYECHO_USERS` (tạo bằng `node scripts/provision-user.mjs --env …`) | Cần nếu muốn vào portal | Không ai đăng nhập được Business/Guide/Admin |

Nếu repo đã nối với Vercel, nhánh vừa push sẽ có **bản preview**. Thêm biến trước rồi redeploy, sau đó mới thử. Gửi sitemap lên Search Console bạn phải tự làm (SEO11).

## 1. Lịch sử commit trên nhánh

| Commit | Nội dung |
|---|---|
| `6ff537b` | Đợt A |
| `b41a628` | Đợt B |
| `23a8a98` | **Đợt C–G**: ghép từ `e45d773`, chỉnh cho khớp auth Đợt B |
| `8ab3fb7` | Smoke HTTP khớp thiết kế phiên khách |
| `b1917a0` | Sửa 5 lỗi tương phản tìm được khi kiểm trình duyệt |
| `5f47629` | Rút gọn banner "lưu tạm" trên mobile |

**Vì sao C–G là 1 commit:** `e45d773` chỉ lưu trạng thái cuối, và các file bị sửa chồng qua nhiều đợt (ví dụ trang chủ bị sửa ở D, E và F). Tách thành 5 commit thì các commit giữa sẽ không build được. Bù lại, mỗi lỗi tìm được khi kiểm trình duyệt là một commit riêng.

## 2. Đã làm theo từng đợt

| Đợt | Nội dung | Requirement |
|---|---|---|
| **C** | Typography, line-height, focus, placeholder; **theme Sáng/Tối/Theo thiết bị** (một provider duy nhất, chọn trong bảng Trợ năng, lưu lựa chọn, áp dụng trước khi vẽ trang để không nháy); tìm kiếm giọng nói không còn trả kết quả giả khi trình duyệt không hỗ trợ; bảng trợ năng đóng bằng Escape | UI01, UI02, UI06, FR04, NFR01 |
| **D** | Trang chủ bỏ khối trùng ý; **gallery** dùng `<dialog>` gốc (ảnh trước/sau, nguồn ảnh, link chi tiết); Khám phá có lối vào theo nhu cầu; tìm kiếm toàn catalog, **gõ không dấu được** | UI03, UI04, UI05, EX01–EX04 |
| **E** | 3 bài **cẩm nang** (có mục lục, bài liên quan); thêm **Hoàng thành Thăng Long** (có nguồn; thiếu tọa độ/ảnh thì ghi là thiếu); trang **chó dẫn đường** `/services/guide-dogs` chỉ cung cấp thông tin, kèm nguồn IGDF và Guide Dogs for the Blind, không tuyên bố có dịch vụ | CT01–CT08, EX05–EX07, SV07 |
| **F** | Title/description riêng từng trang, canonical, Open Graph, JSON-LD; `sitemap.xml`, `robots.txt`; `noindex` cho portal và trang cá nhân; trang 404 thật | SEO01–SEO10, SEO12 |
| **G** | 3 trang đối tác `/partners/*` + form "quan tâm hợp tác" (bắt buộc đồng ý, chống gửi lặp); inbox chỉ Admin `/admin/inquiries`; **portal Business lấy `businessId` từ phiên server** (bỏ hằng `b1`); menu 5 nhóm Khám phá / Dịch vụ / Cẩm nang / Hỗ trợ / Đối tác | PT01–PT10, UI07, UI08 |

## 3. Chỉnh khi ghép (khác `e45d773`)

- **Giữ toàn bộ auth Đợt B**: cookie ký, phiên khách, lưu bộ nhớ trên Vercel. Không lấy cơ chế session lưu file của `e45d773`.
- API thông báo và inquiries đọc tài khoản từ cả `WAYECHO_USERS`, không chỉ từ file.
- **Form đối tác không nhận hồ sơ khi đang lưu bộ nhớ** (Vercel). Đây là thông tin liên hệ thật; nhận rồi để mất mà vẫn báo "đã nhận" là báo thành công giả.
- **Không ghép** thư mục `reports/`, file Excel và log của `e45d773`: chúng mô tả thiết kế auth cũ, sẽ gây hiểu nhầm.
- Dọn các lỗi do auto-merge: `requestRef` khai báo 2 lần (lỗi biên dịch), import `SOSLink` trùng ở 4 file, `router.refresh()` gọi 2 lần.
- Thêm lại test bảo mật cho inquiries, có cả ca chặn ở chế độ lưu bộ nhớ.

## 4. Kiểm thử

### Tự động (bản cuối, môi trường sạch)

| Kiểm tra | Kết quả |
|---|---|
| `npm test` | **45/45 đạt** |
| `npm run lint` | 0 lỗi, 11 cảnh báo |
| `npm run build` | Đạt, 50 trang |
| `node scripts/http-smoke.mjs` | **208/208 đạt**: mọi link nội bộ và anchor, 404 thật, sitemap/robots, phân quyền 4 vai trò, IDOR, inquiries, khởi động lại server |

### Trình duyệt thật (phần `e45d773` chưa từng làm)

**Audit tự động** 18 trang × 2 kích thước (1280 và 375px) × 2 theme = 72 lượt:
- Không trang nào tràn ngang, không ảnh thiếu alt, không nút/link thiếu tên.
- Tìm được 5 lỗi tương phản, đã sửa (commit `b1917a0`). Chạy lại thì **24/24 lượt đạt** (trừ chữ "Echo" trong logo, được WCAG miễn).

| Lỗi tương phản | Trước | Sau |
|---|---|---|
| Chữ đỏ trang **SOS** ở theme tối | 1,83:1 (gần như vô hình) | ~9:1 |
| Chữ "SOS" ở thanh dưới mobile theme tối | 2,47:1 | đạt |
| Nút "Mở SOS demo" ở trang Hỗ trợ, theme tối | 1,47:1 | đạt |
| Nút SOS ở footer | 3,09:1 | ~5,2:1 |
| Link "Staff", nút "Đăng nhập" | 3,97 / 4,40 | đạt |

**Kiểm tay**, tất cả đều đạt:
- Menu dropdown bằng bàn phím (Escape đóng, trả focus).
- Đổi theme (lưu lại, giữ khi tải lại trang).
- Gallery (mở, chuyển ảnh, đóng, trả focus).
- Tìm "van mieu" ra Văn Miếu.
- Form đối tác báo lỗi trung thực khi chưa bật.
- Menu mobile 5 nhóm.
- Chữ lớn (16 → 19px), tương phản cao được ưu tiên hơn theme.
- Mục lục bài viết.
- **Luồng Business đầy đủ**: khách đặt chỗ, Business thấy yêu cầu, bấm Chấp nhận, trạng thái cập nhật.
- Admin mở inbox.

## 5. Vấn đề còn tồn tại

| Vấn đề | Mức | Ghi chú |
|---|---|---|
| Chưa có database thật | **Chặn production** | Trên Vercel dữ liệu chỉ lưu tạm |
| Chưa thử trên Vercel thật | Cao | Cần bạn thêm biến môi trường rồi xem bản preview |
| 6 trang động còn **bản sao ẩn** của nội dung (`div hidden id="S:0"`) | Thấp | Không hiện ra màn hình, screen reader không đọc, console không báo lỗi hydration. Cần điều tra thêm |
| Cụm nút nổi (micro, loa, trợ năng) đè phần cuối nội dung trên mobile | Trung bình | Có từ trước; phải giữ VoiceBar theo quy tắc nên chưa đổi |
| Portal Guide ở 320px (logo bị đè) | Thấp | Chưa kiểm lại sau C–G |
| Chữ ghi công bản đồ Leaflet 3,6:1 | Thấp | Thành phần của bên thứ ba |
| 9 lỗ hổng npm trong công cụ build (tailwind, eslint) | Thấp | Chỉ sửa được bằng `--force` |
| Chưa thử screen reader thật, chưa thử điện thoại thật | Trung bình | Cần người dùng khiếm thị thử |

## 6. Chưa làm (cần dữ liệu, dịch vụ hoặc quyết định của bạn)

- **Quảng cáo (AD01–AD07):** chưa có dữ liệu hay đối tác thật, nên không tạo quảng cáo giả.
- **Camera AI / OCR thật (AI03–AI05):** cần API có phí.
- **Tài khoản Traveler, khôi phục mật khẩu (FR01):** hiện dùng phiên khách. Cần database trước.
- **Bài Cluster 8 "Trải nghiệm Hà Nội bằng âm thanh":** theo outline của nhóm, là phần việc nội dung. Khung `/articles` đã sẵn để thêm bài.
- Gửi sitemap lên Search Console, cấp tài khoản Business/Guide/Admin thật.

## 7. Tính năng vẫn ở chế độ demo

Booking (không có nhà cung cấp, tồn kho hay thanh toán), SOS (không gửi đi đâu), điều hướng (tuyến minh họa), Camera AI (ảnh mẫu), hồ sơ và lịch Guide, dịch vụ trong catalog. Các nhãn DEMO được giữ nguyên.
