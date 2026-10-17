# Kiểm chứng commit `e45d773` (nhánh `backup-preview`) — Đợt A và B

> Ngày 17/10/2026 · Máy: Windows, Node v22.14.0 · Log: `D:\PROJECT_ALL\echo\baseline\preview\`
> Phạm vi: chạy test/lint/build/smoke, đọc code Đợt A và Đợt B. **Chưa review C–G.** Không sửa file nào trong repo.

## 1. Kết luận ngắn

- **Đợt A: port được gần như nguyên** (công nhỏ). Chỉ cần tách khỏi menu mới của Đợt D/G.
- **Đợt B: phần phân quyền viết chặt, nên giữ. Nhưng có 3 điểm khiến bản demo trên Vercel gần như ngừng hoạt động**, phải sửa trước khi port. Mình đoán đây là lý do nhánh preview bị revert sau 27 phút; điều này **chưa xác minh**, bạn xem log Vercel preview để chắc.
- Các con số trong báo cáo của commit **đúng**, kèm một điều kiện về phiên bản Node (mục 2).

## 2. Kết quả chạy

| Kiểm tra | `main` (baseline) | `backup-preview` | Ghi chú |
|---|---|---|---|
| `npm test` | 5/5 | **27/28**, rồi **42/42** khi dùng shim | `tests/p0-b.test.mjs` dùng `module.registerHooks`, API chỉ có từ **Node ≥ 22.15**. Máy bạn là 22.14 nên file test lỗi ngay lúc import. Chạy lại bằng loader `module.register` (logic resolve y hệt, không sửa repo) thì **15/15 đạt** |
| `npm run lint` | 0 lỗi / 9 cảnh báo | 0 lỗi / **11** cảnh báo | Thêm 2 cảnh báo ở `search` và `LogoutButton` |
| `npm run build` | Đạt, 40 trang | **Đạt, 50 trang** | 1 cảnh báo Turbopack: tracing toàn project do `store.js` dùng đường dẫn động |
| `scripts/http-smoke.mjs` | — | **203/203 đạt** | Chạy `next start` thật trên localhost với DB tạm, tự dọn sau khi chạy |
| `npm audit` | 12 lỗ hổng (10 high) | **Không đổi** | Commit không nâng dependency; Next 16.3.6 vẫn dính lỗi |

## 3. Đợt A: đánh giá

**Làm đúng yêu cầu PROMPT 1:**

- **A1:** chip trạng thái lấy từ `status` (`lib/bookingStatus.js`). Trạng thái lạ hiện "Chưa rõ trạng thái", không bao giờ hiện "Đã xác nhận". API lỗi có thông báo riêng (`role="alert"`), không đánh đồng với danh sách trống.
- **A2:** `lib/navigationTarget.js` tìm theo `slug` hoặc `id` và kiểm tra tọa độ hợp lệ. Không thấy thì báo `role="status"` và giữ bản đồ tổng quan. Có `to` thì **không vẽ tuyến giả**. `MapFocus` dùng `useMap().setView` nên bản đồ đổi tâm đúng khi URL đổi.
- **A3:** `components/SOSLink.jsx` có ở Header (cả desktop lẫn menu mobile), GuideNav, BusinessNav, AdminNav. Vẫn giữ SOS ở MobileNav và Footer.
- **A4:** `lib/sos.js` tách 3 mã lỗi GPS (từ chối / không lấy được / hết giờ), xử lý offline, và chỉ hiện nút `tel:` khi liên hệ đã lưu chứa **đúng một** số rõ ràng. Không xin quyền vị trí khi tải trang.
- Test: `tests/p0-a.test.mjs`, 5 test bằng hàm thuần và mock GPS.

**Cần lưu ý khi port:**

1. Header, GuideNav, BusinessNav, AdminNav, Footer **trộn lẫn thay đổi của Đợt D/G** (menu mới dẫn tới `/articles`, `/partners/...`). Lấy nguyên file thì sẽ có **link chết**, nên chỉ chèn `<SOSLink />` bằng tay.
2. `app/my-booking/page.jsx` khi lỗi có link tới `/login`, mà trang đó thuộc Đợt B. Nếu port A trước thì phải bỏ link này.
3. Test kiểm tra SOS trong header chỉ là regex trên mã nguồn (tìm chữ `<SOSLink`). Chấp nhận được, nhưng vẫn cần kiểm tra bằng trình duyệt.

**Danh sách port Đợt A:**

| Lấy nguyên | Lấy có chỉnh |
|---|---|
| `lib/bookingStatus.js`, `lib/navigationTarget.js`, `lib/sos.js`, `components/SOSLink.jsx`, `components/MapView.jsx`, `app/navigation/page.jsx`, `app/sos/page.jsx`, `tests/p0-a.test.mjs` | `app/my-booking/page.jsx` (bỏ link `/login`); chèn `<SOSLink />` vào `Header.jsx`, `GuideNav.jsx`, `BusinessNav.jsx`, `AdminNav.jsx` |

## 4. Đợt B: đánh giá

### 4.1 Điểm tốt, nên giữ

- **Mật khẩu:** scrypt + salt, so sánh bằng `timingSafeEqual`. Email không tồn tại vẫn tốn cùng thời gian băm, nên không dò được email nào có tài khoản.
- **Cookie:** `HttpOnly; SameSite=Strict`, thêm `Secure` ở production. Chống CSRF bằng kiểm tra `Origin` cho mọi request ghi.
- **`secured(handler, roles)`:** mọi API kiểm tra đăng nhập và vai trò **phía server**. `lib/permissions.js` kiểm tra chủ sở hữu, Business chỉ thấy `businessId` của mình, dữ liệu cũ không có chủ thì bị ẩn.
- **Bookings:** tên và giá lấy từ catalog phía server (không tin client). **Consent mặc định là từ chối**, chỉ chấp nhận `shareAccessibility === true`. Traveler chỉ được hủy booking của mình. Có `requestId` chống gửi trùng và kiểm tra luồng trạng thái.
- **Requests:** chỉ Business hoặc Admin, chỉ đơn ở trạng thái `pending`. **Notifications:** POST chỉ dành cho Admin, phải gửi tới một user cụ thể. **Saved/trip/reviews:** gắn `ownerId`, không xóa chéo được.
- **Ghi lỗi trả 503**, không còn trả "thành công" khi chưa lưu. Ghi file nguyên tử (file tạm + `fsync` + `rename`) có lock.
- `safeNext` chặn open redirect sau khi đăng nhập.

### 4.2 Ba điểm khiến Vercel demo ngừng hoạt động

| # | Vấn đề | Vị trí | Hệ quả trên Vercel |
|---|---|---|---|
| 1 | `dbPath()` ném lỗi 503 khi có biến `VERCEL` | `lib/store.js:12` | **Mọi lệnh đọc và ghi** đều 503: không đăng nhập được, không đọc được review, các trang `/my-booking`, `/my-trip`, `/notifications` và portal báo 503 |
| 2 | Session lưu trong store JSON | `lib/auth.js:30`, `:66-74` | Kể cả khi đổi store sang bộ nhớ, **bộ nhớ không chia sẻ giữa các instance serverless**, nên session tạo ở instance này có thể không tồn tại ở instance khác (trong đó có proxy) |
| 3 | Production bắt buộc có header nguồn ký HMAC từ ingress | `lib/loginLimiter.js:8-12` | Vercel không tự gắn header này, nên **đăng nhập luôn trả 503** |

Thêm vào đó, có hai điểm làm bản demo khó dùng:

- **Không có đăng ký cho Traveler**: mọi tài khoản phải tạo bằng CLI (`scripts/provision-user.mjs`), và CLI ghi vào `db.json`, việc không làm được trên Vercel. Khách xem demo **không đặt chỗ được**.
- Clone repo về là **không có tài khoản nào**, phải chạy CLI trước mới đăng nhập được.

### 4.3 Hướng sửa đề xuất (khớp với Q2/Q3 bạn đã duyệt)

| Vấn đề | Sửa thành |
|---|---|
| Session lưu trong store | **Cookie ký HMAC, không cần store** (phương án Q2). Proxy và API tự kiểm chữ ký, không phụ thuộc instance. Đánh đổi: không thu hồi phiên phía server được, nên giữ hạn ngắn (8 giờ) và logout xóa cookie |
| Store 503 trên Vercel | Trên Vercel dùng **store bộ nhớ** nhưng mọi response ghi trả `persisted: false`, và UI hiện "Đã lưu tạm — dữ liệu demo có thể mất" (phương án Q3). Chạy local vẫn dùng file có lock |
| Header nguồn đăng nhập | Trên Vercel lấy IP từ `x-real-ip` / `x-forwarded-for`, hai header do nền tảng Vercel tự đặt. Giữ cơ chế HMAC cho host tự quản |
| Traveler không đăng nhập được | **Session ẩn danh theo thiết bị** cho Traveler: lần đầu đặt chỗ thì cấp cookie ký với `travelerId` ngẫu nhiên. Business/Guide/Admin dùng tài khoản demo khai báo qua biến môi trường (chỉ lưu hash) |
| Test cần Node ≥ 22.15 | Đổi `registerHooks` sang `module.register` để chạy được từ Node 20.6, khớp với README ghi "Node ≥ 20.9" |
| 12 lỗ hổng npm | Chạy `npm audit fix` (không `--force`) ở đầu Đợt B, rồi chạy lại toàn bộ test/build |

Rủi ro vận hành nhỏ: nếu tiến trình chết khi đang giữ lock thì mọi thao tác ghi bị chặn cho tới khi xóa lock bằng tay. Đây là chủ ý thiết kế và đã có `scripts/inspect-store-lock.mjs`. Với demo chạy local thì chỉ cần ghi vào README.

### 4.4 Danh sách port Đợt B

| Lấy nguyên | Lấy rồi sửa | Viết mới hoặc thay |
|---|---|---|
| `lib/permissions.js`, `lib/redirect.js`, `lib/personalCollection.js`, `app/api/{bookings,requests,notifications,reviews,saved,trip}/route.js`, phần thêm vào `lib/validate.js`, sửa consent ở `app/booking/page.jsx` | `lib/auth.js` (giữ `secured`, `checkOrigin`, phần mật khẩu; thay phần session), `lib/store.js` (thêm chế độ Vercel), `lib/loginLimiter.js` (nhận IP từ Vercel), `proxy.js`, `tests/p0-b.test.mjs` (đổi hook) | Session ẩn danh cho Traveler; tài khoản demo qua biến môi trường; banner "lưu tạm" |

## 5. Đề xuất bước tiếp theo

1. **Port Đợt A** trên nhánh `fix/p0-batch-a` từ `main`. Phần lớn là `git checkout e45d773 -- <file>` rồi chỉnh 5 file, nên mình làm trực tiếp sẽ nhanh hơn giao OpenCode. Xong thì chạy test/lint/build và dừng lại để bạn review.
2. Sau đó **Đợt B** trên nhánh `fix/p0-batch-b`: `npm audit fix`, port phần lõi, sửa 3 điểm chặn Vercel như mục 4.3, rồi chạy test, smoke và build.
3. C–G: review riêng sau, cũng lấy từ `e45d773`.
