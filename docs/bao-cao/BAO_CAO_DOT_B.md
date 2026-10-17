# Báo cáo Đợt B — Bảo mật P0

> Ngày 17/10/2026 · Nhánh `fix/p0-batch-b` (tạo từ `fix/p0-batch-a` @ `6ff537b`) · **Chưa commit, chưa push, chưa deploy**
> Nguồn: phần phân quyền port từ `e45d773`; phần session, store và IP viết lại cho chạy được trên Vercel (theo Q2/Q3).
> Log: `D:\PROJECT_ALL\echo\baseline\batch-b\`

## ⚠️ Việc bạn phải làm trước khi deploy Vercel

Vào Vercel → Settings → Environment Variables, thêm **`WAYECHO_SESSION_SECRET`**: một chuỗi ngẫu nhiên tối thiểu 32 ký tự. Tạo bằng lệnh sau:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Thiếu biến này thì mọi API của Traveler trên Vercel đều trả 503**, nghĩa là không đặt chỗ được. Đây là chủ ý (fail-closed): không có secret thì không ký được phiên an toàn. Muốn có tài khoản Business/Guide/Admin trên Vercel thì thêm `WAYECHO_USERS` (xem README).

## 1. Lỗi đã sửa

| Trước | Sau |
|---|---|
| Không API nào có xác thực | Mọi API kiểm tra phiên và vai trò **ở server** (`secured()`) |
| `GET /api/bookings` trả booking của **mọi người** | Traveler chỉ thấy của mình; Business chỉ thấy booking thuộc `businessId` của mình; Admin thấy tất cả |
| Ai cũng xác nhận/từ chối được booking và request | Chỉ Business sở hữu hoặc Admin; Traveler chỉ được **hủy** booking của mình; có kiểm tra luồng trạng thái |
| Ai cũng tạo được thông báo giả | `POST /api/notifications` chỉ dành cho Admin, phải gửi tới một user có thật |
| Saved/trip dùng chung cho mọi người | Gắn `ownerId`, không xóa chéo được |
| Tắt chia sẻ nhưng Business vẫn nhận "Có Accessibility Request" | Consent **mặc định tắt**, server chỉ nhận `shareAccessibility === true`; tắt thì không tạo request hay thông báo |
| Ghi lỗi vẫn trả 201 | Ghi file nguyên tử có lock; lỗi trả **503**. Trên Vercel: lưu bộ nhớ, **báo rõ "lưu tạm"** bằng banner và header |
| Login Guide là cờ `sessionStorage`; Business/Admin không có login | Đăng nhập thật (scrypt), cookie **HttpOnly, SameSite=Lax, Secure**; portal chặn ở server (`proxy.js`) |
| Không chống CSRF | Request ghi phải có `Origin` khớp website |
| Không giới hạn đăng nhập sai | Giới hạn theo nguồn và theo tài khoản (từ `e45d773`) |
| Next 16.3.6 dính 6 advisory | **Next 16.4.2**, `sharp` 0.35.5, `source-map-js` 1.2.2 (`npm audit fix`, không `--force`) |
| Service worker cache cả trang cá nhân | Không cache `/business`, `/admin`, `/guide`, `/my-booking`, `/profile`… |

## 2. Thiết kế khác `e45d773` (vì sao)

| `e45d773` | Bản này | Lý do |
|---|---|---|
| Session lưu trong file JSON | **Cookie ký HMAC**, không lưu ở server | Trên Vercel các instance không dùng chung file hay bộ nhớ, nên session lưu file sẽ mất |
| Vercel: mọi đọc/ghi trả 503 | Vercel: **lưu bộ nhớ tạm + banner cảnh báo** | Để demo trên Vercel vẫn chạy được mà không nói dối người dùng |
| Login production bắt buộc header ký từ ingress | Trên Vercel lấy IP từ `x-real-ip` do nền tảng đặt | Vercel không có ingress tự ký; giữ cơ chế ký cho host tự quản |
| Traveler phải có tài khoản cấp bằng CLI | **Phiên khách** tự cấp, gắn với trình duyệt | Khách xem demo vẫn đặt chỗ được, và vẫn bị cô lập dữ liệu |
| Tài khoản chỉ lưu trong store | Thêm biến `WAYECHO_USERS` | Vercel không ghi được file nên không chạy CLI ghi store được |
| SameSite=Strict | SameSite=Lax | Strict khiến người bấm link từ email hay chat vào portal bị đòi đăng nhập lại. CSRF đã chặn bằng kiểm tra `Origin` |
| Test cần Node ≥ 22.15 | Loader `module.register`, chạy từ Node 20.6 | Máy bạn là Node 22.14 |

### Sửa thêm do kiểm thử phát hiện

1. **Phiên khách mở portal bị trang 403 trơn.** Ví dụ Traveler bấm "Dành cho doanh nghiệp" thì gặp ngõ cụt. Đã sửa: phiên khách được chuyển tới trang đăng nhập.
2. **Trang 403 cho sai vai trò là chữ trơn**, "/sos" không bấm được. Đã đổi thành trang HTML có tiêu đề và 3 link: đăng nhập tài khoản khác, **SOS**, trang chủ.

## 3. File thay đổi

- **Mới:** `lib/auth.js`, `lib/permissions.js`, `lib/personalCollection.js`, `lib/redirect.js`, `lib/loginLimiter.js`, `proxy.js`, `app/api/auth/{login,logout,session}`, `app/login/page.jsx`, `components/{LoginForm,LogoutButton,StorageNotice}.jsx`, `scripts/provision-user.mjs` (có `--env`), `.env.example`, `tests/p0-b.test.mjs`, `tests/loginLimiter.test.mjs`, `tests/helpers/alias-loader.mjs`
- **Sửa:**
  - 6 route API.
  - `lib/store.js` (thêm chế độ bộ nhớ), `lib/validate.js`, `lib/api.js`, `lib/guideSession.js`.
  - `app/booking` (consent, chống gửi trùng, báo lỗi), `app/profile` (chia sẻ mặc định tắt), `app/guide/login`, `GuideNav` (đăng xuất), `GuideShell`, `app/my-booking` (ghi chú phiên khách), `app/layout.jsx` (banner).
  - `public/sw.js`, `.gitignore`, `README.md`, `package-lock.json`.

## 4. Kiểm thử đã chạy

| Kiểm tra | Kết quả |
|---|---|
| `npm test` | **33/33 đạt**: 16 test bảo mật Đợt B, 5 test giới hạn đăng nhập (1 mới cho Vercel), 5 test Đợt A, 7 test validate |
| Kiểm tra độ nhạy của test | Tắt kiểm tra chữ ký thì **2 test fail**, nghĩa là test thật sự bắt được lỗi |
| `npm run lint` | 0 lỗi, 10 cảnh báo. Thêm 2 cảnh báo `location.assign` sau đăng xuất (cố ý tải lại toàn trang để xóa trạng thái), bớt 1 ở `GuideShell` |
| `npm run build` | Đạt, 43 trang, có `Proxy (Middleware)`. 1 cảnh báo Turbopack: tracing toàn project, đã có từ `e45d773` |
| HTTP thật trên `next start` (chế độ bộ nhớ giả lập Vercel) | **26/26 đạt**: phiên khách, cô lập dữ liệu, CSRF, chuyển hướng 3 portal, login sai/đúng, Business chỉ thấy b1, khách không tự xác nhận được, Business xác nhận được, logout, consent tắt thì không tạo request |
| Trình duyệt (production) | Banner "lưu tạm" hiện; khách đặt chỗ qua form (consent mặc định tắt); "Đặt chỗ của tôi" hiện đúng; JavaScript không đọc được cookie; `/business` chuyển tới `/login` |
| Trình duyệt (dev) | Login Business sai mật khẩu thì báo lỗi, đúng thì vào `/business`. Business vào khu Guide thì gặp trang 403 có link SOS. Login Guide quay về đúng trang `next`. Đăng xuất làm phiên hết hiệu lực |
| Hồi quy SOS | SOS ở header và bottom nav, thông báo từ chối quyền vị trí đúng |

Tài khoản và secret dùng để thử là giá trị ngẫu nhiên, chỉ nằm trong `.env.local` tạm thời, **đã xóa** sau khi kiểm.

## 5. Bảo mật: đã có / còn thiếu

**Đã có:** xác thực và phân quyền ở server, cô lập dữ liệu theo chủ sở hữu, consent kiểm ở server, chống CSRF, cookie HttpOnly/Secure, mật khẩu băm scrypt, giới hạn đăng nhập sai, không trả "thành công" giả, vá lỗ hổng Next.

**Còn thiếu (chặn production):**

- **Chưa có database thật.** Trên Vercel dữ liệu mất khi instance khởi động lại.
- Phiên ký **không thu hồi được từng phiên** (đăng xuất chỉ xóa cookie). Đổi mật khẩu hoặc khóa tài khoản thì mọi phiên cũ hết hiệu lực.
- Giới hạn đăng nhập trên Vercel chỉ tính theo từng instance.
- Phiên khách có thể bị bỏ để lách giới hạn 20 đánh giá/giờ.
- Chưa có đăng ký, khôi phục mật khẩu, MFA.
- **9 lỗ hổng npm còn lại** (`braces`, `postcss-selector-parser`) nằm trong công cụ build (tailwind, eslint), chỉ sửa được bằng `--force` (nâng cấp có thể làm vỡ).
- Portal Business vẫn hard-code `DEMO_BUSINESS_ID = b1`, nên tài khoản Business khác b1 sẽ bị 403 khi xem trang (để Đợt G).

**Website chưa an toàn để chạy production.**

## 6. Giới hạn môi trường

- **Chưa deploy thử lên Vercel.** Ba điểm riêng của Vercel (`x-real-ip`, Origin khớp domain preview, lưu bộ nhớ nhiều instance) mới được kiểm bằng unit test và giả lập, chưa kiểm trên Vercel thật.
- Chưa thử screen reader thật, chưa thử điện thoại thật.

## 7. Tính năng vẫn ở chế độ demo

Booking (không có nhà cung cấp, tồn kho hay thanh toán), SOS, điều hướng, Camera AI, dữ liệu portal Guide. Dữ liệu trên Vercel chỉ lưu tạm.
