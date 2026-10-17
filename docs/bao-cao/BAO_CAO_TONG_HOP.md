# WayEcho — Báo cáo tổng hợp

> Cập nhật 17/10/2026 · Nhánh **`upgrade/a-g`** trên GitHub (16 commit, 137 file; **chưa merge `main`**)
> Tạo PR: https://github.com/lethanhtu2005-oss/test/pull/new/upgrade/a-g

## ⚠️ Việc bạn cần làm

1. **Review nhánh `upgrade/a-g`**. Mỗi đợt và mỗi lần sửa là một commit riêng, nên review được từng bước.
2. **Thêm biến môi trường trên Vercel** rồi xem bản preview:
   - `WAYECHO_SESSION_SECRET`: **bắt buộc**. Thiếu biến này thì không đặt chỗ được.
   - `NEXT_PUBLIC_SITE_URL`: cần để Google index.
   - `WAYECHO_USERS`: cần để có tài khoản Business/Guide/Admin.
3. **Chọn database** (ví dụ Supabase hoặc Neon, đều có gói miễn phí). Đây là điều kiện bắt buộc trước khi chạy production; bạn tạo tài khoản rồi đưa chuỗi kết nối, phần code mình làm tiếp.
4. **Nhóm duyệt bài Cluster 8** (`BAI_CLUSTER8_NHAP.docx`), rồi mình đăng lên trang Cẩm nang.

## 1. Đã làm những gì

| Giai đoạn | Nội dung chính | Báo cáo chi tiết |
|---|---|---|
| Phân tích | Đối chiếu tài liệu với code; tìm lỗi P0 và lỗ hổng bảo mật | `KE_HOACH_TRIEN_KHAI.md` |
| Đợt 0 | Clone, tạo nhánh backup, chạy baseline (phát hiện 12 lỗ hổng npm) | `BASELINE_DOT0.md` |
| Kiểm chứng `e45d773` | Bản nâng cấp cũ chạy tốt nhưng có 3 điểm làm hỏng Vercel | `KIEM_CHUNG_E45D773.md` |
| **Đợt A** | Trạng thái booking thật, bản đồ đọc `?to=`, SOS ở mọi header, xử lý lỗi GPS và offline | `BAO_CAO_DOT_A.md` |
| **Đợt B** | Xác thực và phân quyền ở server, phiên khách cho Traveler, consent kiểm ở server, nâng Next 16.4.2, chạy được trên Vercel | `BAO_CAO_DOT_B.md` |
| **Đợt C–G** | Theme sáng/tối, menu 5 nhóm, gallery, tìm không dấu, cẩm nang, chó dẫn đường, SEO, luồng đối tác; sửa 5 lỗi tương phản (nặng nhất là trang SOS ở theme tối) | `BAO_CAO_DOT_C_G.md` |
| Sửa sau review | Menu mobile cuộn được, footer và portal không bị nút nổi che, Guide ở 320px, chữ ghi công bản đồ, service worker không chạy khi dev | (mục 2) |
| **Hoàn thiện thêm** | 5 requirement trước đó chưa làm hoặc làm dở (mục 3) | (mục 3) |
| Bài Cluster 8 | Bản nháp 1.528 chữ theo outline, kèm checklist QA và alt-text | `BAI_CLUSTER8_NHAP.md/.docx`, `BAI_CLUSTER8_GHI_CHU.md` |

## 2. Sửa sau khi bạn review

| Vấn đề | Kết quả |
|---|---|
| Menu mobile dài hơn màn hình, không cuộn tới được nút cuối | Menu cuộn được trong màn hình; nút cuối nằm trên cụm nút nổi |
| Cụm nút nổi (micro, loa, trợ năng) che dòng cuối footer và cuối trang portal | Đã chừa khoảng trống phía dưới |
| Portal Guide ở 320px: logo bị đè | Hết đè (còn cách 18px) |
| Chữ ghi công bản đồ 3,6:1 | 7,1:1 |
| Service worker chạy cả khi dev nên giao diện không cập nhật | Chỉ đăng ký ở production |
| "Bản sao nội dung bị ẩn" trên 6 trang | **Không phải lỗi**: do pane trình duyệt dùng để kiểm thử không chạy `requestAnimationFrame` |

## 3. Requirement vừa hoàn thiện thêm

| ID | Trước | Sau |
|---|---|---|
| **AI01** Mở camera | Chưa triển khai | Mở camera thật khi người dùng bấm; báo riêng từng lỗi (từ chối quyền, không có camera, camera bận, không có HTTPS) |
| **AI02** Chụp/chọn ảnh | Chưa triển khai | Chụp ảnh, xem trước, chụp lại, xóa; hoặc chọn ảnh có sẵn. Camera tự tắt sau khi chụp |
| **AI11** Quyền riêng tư camera | Một phần | Ảnh **không được gửi đi đâu**; ghi rõ nhận diện AI và OCR chưa có, không giả kết quả |
| **RV02** Báo thông tin sai | Chưa triển khai | Form ở trang điểm đến (không thu thông tin cá nhân); hộp thư chỉ Admin đọc, không lộ người gửi; giới hạn 10 lần/giờ |
| **BK02** Kiểm tra dữ liệu booking | Một phần | Chặn ngày đã qua (theo giờ Việt Nam) ở cả form và server |
| **SV09** Theo dõi yêu cầu | Một phần | Traveler thấy yêu cầu hỗ trợ đang chờ / được chấp nhận / bị từ chối, kèm ghi chú của doanh nghiệp |

Khi kiểm bằng trình duyệt còn phát hiện thêm: camera phụ thuộc `requestAnimationFrame` để gắn luồng video, nên sẽ hỏng nếu người dùng chuyển tab ngay sau khi cấp quyền. Đã sửa.

## 4. Kiểm chứng (bản cuối, môi trường sạch)

| Kiểm tra | Kết quả |
|---|---|
| `npm test` | **50/50 đạt** |
| `npm run lint` | 0 lỗi, 11 cảnh báo (đọc `localStorage` trong effect là chủ ý, để tránh lỗi hydration) |
| `npm run build` | Đạt, 50 trang |
| Smoke HTTP | **208/208 đạt** (link, phân quyền, 404, sitemap, khởi động lại server) |
| Trình duyệt | Audit 72 lượt (18 trang × 2 kích thước × 2 theme) + kiểm tay từng tính năng mới |
| Quét secret trước mỗi lần push | Không có mật khẩu thử hay secret nào trong repo |

## 5. Chưa làm và lý do

| Việc | Lý do | Cần gì để làm |
|---|---|---|
| Database thật, tài khoản Traveler | Cần tạo tài khoản dịch vụ; mình không được tạo thay bạn | Bạn tạo DB và đưa chuỗi kết nối |
| Thử trên Vercel thật | Cần biến môi trường trong tài khoản Vercel của bạn | Bạn thêm biến (mục ⚠️) |
| Nhận diện AI, OCR, lịch sử nhận diện (AI03–AI05, AI08) | Cần API có phí | Bạn quyết định dùng dịch vụ nào |
| Quảng cáo (AD01–AD07) | Chưa có đối tác hay dữ liệu thật; làm giả là vi phạm quy tắc dự án | Có đối tác thật |
| Tailwind 4 | Chỉ vá 4/9 cảnh báo (đều nằm trong công cụ build) và bỏ hỗ trợ điện thoại đời cũ | Xem lại khi Next.js sửa `eslint-config-next` |
| Đăng bài Cluster 8 | Là bài tập content của nhóm, cần duyệt | Nhóm duyệt bản nháp |
| Thử screen reader, điện thoại thật | Cần người và thiết bị thật | Nhờ người dùng khiếm thị thử |
| Search Console | Dùng tài khoản Google của bạn | Bạn tự làm sau khi có domain |

**Kết luận:** về chức năng và bảo mật, website đã sẵn sàng làm **bản demo trên Vercel** (sau khi thêm biến môi trường). **Chưa đủ điều kiện production** cho tới khi có database thật.
