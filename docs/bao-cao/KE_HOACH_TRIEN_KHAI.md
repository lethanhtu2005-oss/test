# WayEcho — Báo cáo phân tích & Kế hoạch triển khai

> Ngày phân tích: 16/10/2026 · Repo: `lethanhtu2005-oss/test`, nhánh `main` @ `c83898c`
> Tài liệu đối chiếu: `BẢNG TỔNG HỢP FUNCTION 2 SAU SỬA.docx`, `PROMPT.docx` (7 prompt, Đợt A–G), `phân tích.md`, `Thực hành AI content N08.docx`, `WayEcho_Outline_Cluster8_1500.docx`
> Phạm vi: chỉ đọc source và tài liệu. **Chưa sửa code, chưa chạy `npm ci / test / lint / build`** (chạy ở Đợt 0).

---

## 0. VIỆC BẠN CẦN QUYẾT ĐỊNH TRƯỚC KHI BẮT ĐẦU

| # | Câu hỏi | Mình đề xuất | Vì sao |
|---|---|---|---|
| Q1 | Commit `c0e2092` "Update WayEcho website" (127 file, +7.649 dòng) đã bị **revert sau 15 phút**. Vì sao revert? | Tạo nhánh `backup-ban-moi` trỏ vào `c0e2092` để giữ lại, rồi **chỉ lấy lại từng phần** cho Đợt C–G | Bảng requirement (IMP08) nói phải giữ nhánh `backup-ban-moi`, nhưng trên GitHub **chưa có nhánh này**, nên bản nâng cấp đó hiện chỉ còn nằm trong lịch sử commit. Commit này làm C–G một lần (trái với quy tắc "mỗi đợt một diff"), đổi font thương hiệu sang font hệ thống (trái với UI09/IMP01) và **không đụng tới Đợt A/B** |
| Q2 | Đợt B (bảo mật) dùng cơ chế đăng nhập nào? | **Tự làm session cookie ký HMAC** (httpOnly) + tài khoản demo theo vai trò. Không cần dịch vụ ngoài, miễn phí | Prompt cấm tự chọn dịch vụ có phí. Cách này dùng `crypto` có sẵn của Node, sau này thay bằng Auth.js/Supabase cũng không phải viết lại API |
| Q3 | Lưu dữ liệu bền vững (DT01): giữ JSON/bộ nhớ hay chuyển sang DB? | **Tạm giữ JSON** trong A–F, nhưng API phải báo thật khi chỉ lưu tạm. Chọn DB (Supabase free / Neon / Vercel Postgres) thành một quyết định riêng trước Đợt G | Trên Vercel, dữ liệu đang **mất khi server khởi động lại** mà API vẫn trả "thành công". Đổi DB là quyết định có chi phí và cần tài khoản, nên bạn phải chốt |
| Q4 | Làm local ở đâu? `D:\PROJECT_ALL\echo` hiện **chưa phải git repo** | Clone repo vào `D:\PROJECT_ALL\echo\wayecho` | Các prompt yêu cầu kiểm tra branch/working tree trước khi sửa, nên cần một bản clone thật |
| Q5 | Ai viết code? | Đợt A và phần cơ khí của C/F → giao **OpenCode (skill `aisup`)**, mình review. Đợt B → mình làm hoặc giám sát sát | A là sửa nhỏ, kiểm chứng được bằng test, nên giao đi để tiết kiệm quota. B là thiết kế bảo mật, sai một chỗ là lộ dữ liệu |

---

## 1. Tóm tắt nhanh

1. **Source:** Next.js 16.3.6 + React 19 + Tailwind 3 + Leaflet, khoảng 5.200 dòng, 36 route có metadata riêng, API lưu file JSON. Có PWA, high-contrast, chữ lớn, TTS.
2. **Đợt A (P0) chưa làm gì:** chip "Đã xác nhận" vẫn bị gán cứng, `/navigation?to=` bị bỏ qua, desktop và portal không có SOS, chưa có test SOS.
3. **Đợt B (bảo mật) chưa làm gì:** **không API nào có xác thực**. Ai cũng xem được booking của mọi người, tự xác nhận booking, và giả mạo thông báo. Còn một lỗi **rò rỉ đồng ý**: tắt chia sẻ nhưng business vẫn biết khách cần hỗ trợ.
4. **Bản nâng cấp đã bị revert** chứa sẵn khá nhiều phần C–G (theme sáng/tối, bài viết, `/destination/[slug]`, chó dẫn đường, sitemap/robots, quảng cáo). Lấy lại từng phần sẽ đỡ việc.
5. **Thứ tự đề xuất:** Đợt 0 (chuẩn bị) → A → B → C → D → E → F → G. Mỗi đợt dùng một nhánh, một diff, một báo cáo, và **dừng lại để bạn duyệt**.

---

## 2. Hiện trạng repo

### 2.1 Lịch sử commit

| Commit | Ngày | Nội dung |
|---|---|---|
| `f196756` → `8b3edc8` | 22/09 | Khởi tạo, sửa cấu trúc cho Vercel |
| `c6de9f1`, `f54eb61` (PR #1) | 23/09 | Nâng Next 16/React 19 (vá RCE), ESLint, validate API, sửa service worker |
| `f6e0c03` | 16/10 | Thêm mục "Kiểm tra triển khai" vào README (mục này đang bỏ dở) |
| **`c0e2092`** | 16/10 02:48 | **"Update WayEcho website"**: làm C–G một lần, 127 file |
| **`c83898c`** | 16/10 03:03 | **Revert toàn bộ `c0e2092`**, nên `main` = trạng thái 23/09 |

Remote chỉ có `main` và `fix/audit-improvements`. **Chưa có `backup-ban-moi`.**

### 2.2 Bản bị revert (`c0e2092`) có gì và nên xử lý thế nào

| Phần | Có trong `c0e2092` | Nên dùng lại? |
|---|---|---|
| Theme sáng/tối (`ThemeToggle`, `A11yProvider`, CSS variables) | Có | **Lấy lại có chọn lọc** ở Đợt C, sau khi soát tương phản |
| Đổi font Google (Barlow/Lato/Lora) sang font hệ thống | Có | **Không lấy**, vì đổi nhận diện thương hiệu (UI09) |
| `globals.css` +824 dòng, trang chủ viết lại 569 dòng | Có | **Không lấy nguyên khối.** Chỉ tham khảo khi tinh gọn trang chủ ở Đợt D |
| `/destination/[slug]` (7 điểm, có Hoàng thành), redirect 308 từ `?d=` | Có | **Lấy lại** ở Đợt E. Phải giữ tương thích `/destination?d=` |
| `/articles`, `/articles/[slug]` (4 bài), `/explore/guide-dogs` | Có | **Lấy lại** ở Đợt E, đối chiếu với Outline Cluster 8 |
| `app/sitemap.js`, `app/robots.js`, `lib/seo.js`, canonical, OG | Có | **Lấy lại** ở Đợt F |
| Ảnh WebP có nguồn + `media-sources.json` | Có | **Lấy lại** ở Đợt D/E |
| Quảng cáo (`AdCard`, `/admin/ads`, `data/ads.js`) | Có | **Để sau cùng (P4).** Prompt 1 cấm làm quảng cáo trong đợt đầu |
| `scripts/verify-production.mjs` (kiểm tra route/link/API) | Có | **Lấy lại sớm** (Đợt 0), dùng làm test hồi quy |
| Đợt A (booking status, `to`, SOS header) | **Không** | Phải làm mới |
| Đợt B (auth/phân quyền API) | **Không** | Phải làm mới |
| Sửa rò rỉ đồng ý `assist: share && …` | Có (1 dòng) | Lấy lại, kèm kiểm tra phía server |

Báo cáo trong commit đó ghi build PASS, test 9/9 và lint 0 lỗi (10 cảnh báo). Mình **chưa tự chạy lại** để xác nhận.

---

## 3. Lỗi P0 đã xác nhận trong code (có dòng cụ thể)

### Đợt A

| ID | Vấn đề | Bằng chứng |
|---|---|---|
| A1 | Mọi booking đều hiện chip **"Đã xác nhận"** và icon tick xanh, kể cả booking `pending` hoặc `demo` | `app/my-booking/page.jsx:46`, `:36` |
| A1 | API lỗi bị nuốt, nên giao diện hiện "Bạn chưa có đặt chỗ nào", **đánh đồng lỗi với danh sách trống** | `app/my-booking/page.jsx:15` (`.catch(() => {})`) |
| A2 | Link `/navigation?to=${slug}` có tạo ra, nhưng trang `/navigation` **không đọc `to`**. Bản đồ luôn ở tâm cố định | Tạo link: `app/destination/DestinationView.jsx:139`; trang: `app/navigation/page.jsx` (không có `useSearchParams`) |
| A2 | `ROUTE` minh họa cố định từ Múa rối tới Hồ Gươm, bất kể đích đến | `app/navigation/page.jsx:14` |
| A3 | Header desktop **không có SOS** | `components/Header.jsx:10-17` |
| A3 | Portal Guide/Business/Admin ẩn Header và Footer. Portal Guide còn ẩn luôn MobileNav, nên **cả mobile lẫn desktop đều không có SOS** | `Header.jsx:23`, `MobileNav.jsx:17` |
| A4 | SOS không phân biệt lỗi *từ chối quyền*, *timeout*, *không lấy được vị trí*; không xử lý offline; không có nút gọi liên hệ khẩn cấp (`tel:`); chưa có test | `app/sos/page.jsx:21-25` |
| A4 | Điểm tốt cần giữ: chỉ xin quyền vị trí **khi bấm nút**, không xin lúc tải trang | `app/sos/page.jsx:16-26` |

### Đợt B — bảo mật (chặn production)

| Vấn đề | Bằng chứng | Hậu quả |
|---|---|---|
| **Không API nào có xác thực** | `app/api/*/route.js` | Ai biết URL cũng đọc và ghi được |
| `GET /api/bookings` trả **toàn bộ booking của mọi người**; booking không có trường chủ sở hữu | `app/api/bookings/route.js:8-13` | Lộ lịch trình và nhu cầu hỗ trợ (dữ liệu nhạy cảm) |
| `PATCH /api/bookings`: ai cũng **xác nhận hoặc từ chối** được booking | `bookings/route.js:68-86` | Traveler tự "xác nhận" hộ Business |
| `PATCH /api/requests`: ai cũng duyệt được, không kiểm tra luồng trạng thái | `app/api/requests/route.js:15-29` | Mở lại request đã từ chối |
| `POST /api/notifications`: **giả mạo được thông báo** cho bất kỳ vai trò nào | `app/api/notifications/route.js:17-31` | Lừa đảo hoặc spam |
| `saved` và `trip` là danh sách **dùng chung cho mọi người** | `app/api/saved`, `app/api/trip` | Người này thấy chuyến đi của người khác |
| **Rò rỉ đồng ý:** tắt "cho phép gửi cho Business" thì client vẫn gửi `assist: true`, và server tạo request với nội dung "Có Accessibility Request" | `app/booking/page.jsx:40` + `bookings/route.js:38-46` | Vi phạm FR06/SOS05/NFR09 |
| **Ghi thất bại vẫn trả 201**: `writeDB` nuốt lỗi | `lib/store.js:36-40` | Trên Vercel người dùng tưởng đã lưu |
| Đăng nhập Guide chỉ là **cờ `sessionStorage`**; Business/Admin **không có đăng nhập**; Business dùng `DEMO_BUSINESS_ID` cứng phía client | `lib/guideSession.js`, `app/business/*/page.jsx` | Không có phân quyền thật |

### Lỗi chất lượng khác (xử lý trong C/G)

- Có **10 chỗ `.catch(() => {})`** làm lỗi API hiện thành "không có dữ liệu" (DT03, UI08).
- `/profile` vẫn báo **"Đã lưu"** khi ghi `localStorage` thất bại (`app/profile/page.jsx:41-45`).
- Tìm kiếm **chưa hỗ trợ gõ không dấu** (`app/search/page.jsx:24-25`, EX02).
- **Chưa có theme sáng/tối**, mới chỉ có high-contrast (UI02/FR04).
- **Chưa có** `sitemap.xml`, `robots.txt`, canonical, Open Graph (SEO07–09, SEO12).
- Camera AI dùng **3 ảnh tĩnh**, không xin quyền camera, không có chụp hay upload (AI01–AI05).
- Chưa có "báo cáo thông tin sai" (RV02).

---

## 4. Đối chiếu Requirement theo nhóm

Phân loại theo đúng cách bảng requirement yêu cầu: **Keep** / **Improve** / **New** / **Demo → cần production**.

| Nhóm | Hiện trạng trong source | Phân loại | Đợt |
|---|---|---|---|
| FR01 Tài khoản | Không có. Nút "Đăng nhập" chỉ dẫn tới `/profile` (localStorage) | **New** (phụ thuộc Q2, Q3) | B (session), G (đăng ký thật) |
| FR02–03 Hồ sơ, hồ sơ tiếp cận | Có Blind/Low Vision, 16 preference, lưu localStorage | **Improve** | C |
| FR04 Cài đặt trợ năng | Có chữ lớn, tương phản, giảm chuyển động, tốc độ đọc. **Thiếu sáng/tối** | **Improve + New** | C |
| FR05 Liên hệ khẩn cấp | Một chuỗi trong localStorage; SOS không có nút gọi | **Improve** | A4 |
| FR06 Quyền riêng tư | Có toggle, nhưng **server không kiểm tra** | **Improve** | B |
| UI01 Typography, UI06 Responsive | Có nền tảng, cần soát | **Improve** | C |
| UI02 Sáng/tối | Không có | **New** | C |
| UI03 Trang chủ trùng ý | 10 section. 4 section trùng ý: "WayEcho giúp bạn", "Vì sao hữu ích", "Trợ lý", "Hành trình" (`app/page.jsx:293-361`) | **Improve** | D |
| UI04 Gallery | Không có | **New** | D |
| UI07 Menu phân nhóm | 6 mục phẳng, thiếu Cẩm nang/Đối tác | **Improve** | D/E |
| UI08 Trạng thái loading/lỗi | Có 10 chỗ nuốt lỗi | **Improve** | A1, C |
| UI10, SOS01–05, SOS08–09 | Trang SOS tốt nhưng thiếu điểm truy cập, offline, `tel:`, test | **Improve** | A3, A4 |
| SOS06–07 Trạng thái/lịch sử sự cố | Không có | **Demo → cần backend** | Ngoài phạm vi, chỉ ghi rõ |
| EX01–04 Khám phá, tìm kiếm, lọc | Có `/explore`, `/search`; thiếu không dấu | **Improve** | D |
| EX05–07 Chi tiết điểm đến | Có nguồn ảnh và ngày đối chiếu (tốt); đang là view phía client | **Keep + Improve** | E |
| EX10 Bản đồ | Có pin, nhưng `to` hỏng | **Improve** | A2 |
| SV01–06, SV08 Dịch vụ | Catalog demo có nhãn DEMO | **Keep** | — |
| SV07 Chó dẫn đường | Không có | **New** | E |
| SV09, BK03 Trạng thái | Hiển thị sai (gán cứng) | **Improve** | A1 |
| AI01–05, AI08 | Demo ảnh tĩnh | **Demo → cần tích hợp AI** (có phí, bạn quyết) | Ngoài phạm vi, đề xuất riêng |
| AI06–07, AI09, AI12 | Có TTS và độ chắc chắn | **Keep** | — |
| CT01–08 Bài viết | Không có | **New** (nội dung từ Outline Cluster 8 + N08) | E |
| SEO01 Title | 36 route có title riêng | **Keep** | — |
| SEO02–12 | Thiếu description riêng, canonical, sitemap, robots, OG, structured data | **New/Improve** | F (SEO11 bạn tự làm trên Search Console) |
| AD01–07 Quảng cáo | Không có | **New (P4)** | Sau G, chỉ khi bạn duyệt |
| PT01–10 Đối tác | Portal demo, không có phân quyền | **Improve** | B (quyền), G (luồng) |
| RV01 / RV02 | Có review / thiếu báo cáo thông tin sai | **Keep / New** | G |
| NT01 Thông báo | Không tách theo người dùng | **Improve** | B |
| DT01 Lưu trữ | JSON, mất dữ liệu trên Vercel | **Cần backend** (Q3) | Quyết định riêng |
| DT02 Phân quyền | Không có | **New** | B |
| DT03 Lỗi API | Nuốt lỗi | **Improve** | A/C |

---

## 5. Kế hoạch theo đợt

> Quy tắc chung cho mọi đợt, rút từ PROMPT.docx:
> - Mỗi đợt làm trên **nhánh riêng**, ra **diff riêng** và **báo cáo riêng**, rồi **dừng lại để bạn duyệt**.
> - Không push, không merge, không deploy.
> - Giữ logo, màu, font, route, slug, ID, API, nhãn DEMO, cùng VoiceBar/Reveal/FeaturedCarousel/SOS/Camera demo.
> - Không bịa dữ liệu. Không báo thành công khi chưa thành công.

### Đợt 0 — Chuẩn bị và baseline (nhỏ)

1. Clone repo vào `D:\PROJECT_ALL\echo\wayecho` (Q4).
2. Tạo nhánh `backup-ban-moi` từ `c0e2092`, chỉ ở local (push khi bạn cho phép). Mục đích là giữ bản nâng cấp đã revert.
3. Chạy `npm ci`, `npm test`, `npm run lint`, `npm run build` và **ghi lại baseline**: lỗi và cảnh báo hiện có. Node local là v22.14, đạt yêu cầu ≥ 20.9.
4. Lấy lại `scripts/verify-production.mjs` từ `c0e2092` làm bộ kiểm tra route/link/API hồi quy (dùng `git checkout c0e2092 -- scripts/...`).
5. Tạo `docs/TRACKING.md`: bảng theo dõi có đủ 11 cột như PROMPT 2 mục IV yêu cầu. Ghi rõ đây là bảng *tổng hợp từ tài liệu*; báo cáo "Đối chiếu Requirement với source" mà Prompt 1 nhắc tới **không có trong bộ tài liệu**.

### Đợt A — Sửa P0 nhỏ (nhỏ, giao OpenCode được)

| Việc | File | Hành vi cần đạt | Kiểm thử |
|---|---|---|---|
| A1 | `app/my-booking/page.jsx`, thêm `lib/bookingStatus.js` | Chip và icon theo `status` (`pending` = Đang chờ xác nhận, `demo` = Demo · chưa gửi nhà cung cấp, `confirmed`, `rejected`, `cancelled`). Có trạng thái lỗi riêng kèm nút "Thử lại". TTS đọc cả trạng thái | Unit test bảng ánh xạ status → nhãn; kiểm tra tay khi API lỗi |
| A2 | `app/navigation/page.jsx` (+ `Suspense`) | Đọc `to`, tìm theo `slug`. Có tọa độ thì đặt tâm và zoom vào điểm. Không tìm thấy thì báo bằng `role="alert"` và giữ bản đồ mặc định. Không vẽ `ROUTE` giả khi có `to`. Vẫn mở được khi không có tham số | Unit test hàm `resolveDestination(to)`; thử tay `?to=ho-guom`, `?to=abc`, không tham số |
| A3 | `components/Header.jsx`, `GuideNav.jsx`, `BusinessNav.jsx`, `AdminNav.jsx` | Có nút SOS màu đỏ, chữ "SOS" và `aria-label` rõ, dùng được bằng bàn phím, không che nội dung. Giữ nguyên SOS ở MobileNav và Footer | Kiểm tra Tab/Enter; soát ở 375px, 768px, 1280px |
| A4 | `app/sos/page.jsx`, thêm `lib/sos.js` | Tách 3 mã lỗi geolocation, xử lý `navigator.onLine` và sự kiện offline, có nút `tel:` khi đã lưu liên hệ. Vẫn ghi rõ "chưa kết nối đầu nhận thật". Không xin quyền khi tải trang | `node:test` cho `lib/sos.js` (từ chối quyền, timeout, unavailable, offline) |

Lưu ý kỹ thuật: `MapContainer` của react-leaflet **chỉ nhận `center` lúc mount**. Muốn đổi tâm khi đổi `to` phải dùng `useMap().setView()` hoặc đặt `key` theo slug.

### Đợt B — Bảo mật P0 (trung bình đến lớn, mình làm hoặc giám sát)

Thiết kế đề xuất theo Q2, không dùng dịch vụ ngoài:

1. **`lib/auth.js`**: session cookie `httpOnly; Secure; SameSite=Lax`, ký HMAC-SHA256 bằng `SESSION_SECRET` (biến môi trường, thêm vào `.env.example`). Payload gồm `{ userId, role, businessId?, exp }`.
2. **Traveler:** cấp **session ẩn danh theo thiết bị** (cookie mang `travelerId` ngẫu nhiên). Cách này cô lập dữ liệu từng người mà chưa cần hệ thống đăng ký. Tài khoản thật để sang Đợt G hoặc khi có DB.
3. **Business/Guide/Admin:** tài khoản demo trong `data/users.seed.json`, mật khẩu băm bằng `scrypt`. Trang login gọi `POST /api/auth/login`, server đặt cookie. Bỏ cờ `sessionStorage`.
4. **Chặn trang portal phía server:** dùng `proxy.js` (Next 16 đổi tên `middleware` thành `proxy`; cần xác minh trên bản 16.3.6) hoặc kiểm tra session trong layout server.
5. **API (`requireSession(req, roles)`)**:
   - `bookings`: thêm `travelerId`. Traveler chỉ xem và hủy booking **của mình**. Business chỉ xem và xác nhận/từ chối booking có `businessId` của mình. Admin xem tất cả.
   - `requests`: chỉ Business sở hữu mới được duyệt; thêm kiểm tra luồng trạng thái.
   - `notifications`: bỏ `POST` công khai (chỉ server tạo); `GET` lọc theo người đang đăng nhập.
   - `saved`, `trip`, `reviews`: gắn `travelerId`.
6. **Đồng ý chia sẻ ở phía server:** booking nhận `shareConsent`. Nếu `false` thì **không tạo request, không ghi `assist`**, kể cả khi client gửi sai. Sửa thêm `app/booking/page.jsx:40`.
7. **Ghi thất bại phải báo thật:** `writeDB` ném lỗi khi không ghi được file. Có `ALLOW_MEMORY_STORE=1` (cho Vercel demo) thì vẫn lưu tạm, nhưng API trả `persisted: false` và UI báo "đã lưu tạm, có thể mất".
8. **Test:** `node:test` cho ký/kiểm tra cookie, phân quyền từng API (traveler A không đọc được booking của B; traveler không xác nhận được booking; consent=false thì không có request).
9. Báo cáo cuối đợt phải ghi rõ: **chưa đủ điều kiện production** cho đến khi có DB thật, HTTPS, xoay vòng secret và rate-limit.

### Đợt C — Giao diện, typography, theme, accessibility (trung bình)

- **Typography (UI01):** soát `line-height`, khoảng cách đoạn, độ dài dòng tối đa khoảng 70ch, thứ bậc heading. **Giữ font Barlow/Lato/Lora.**
- **Theme sáng/tối (UI02/FR04):** hiện **chưa có**, nên theo Prompt 3 phải *đề xuất trước*. Hướng đề xuất là lấy lại cơ chế CSS variables và `ThemeToggle` từ `c0e2092`, gộp vào **AccessibilityToolbar sẵn có** để tránh công tắc trùng; chạy script ở `<head>` để không nháy sai theme; mặc định theo hệ điều hành.
- **Tương phản:** kiểm tra số học các cặp màu (≥ 4.5:1 cho chữ, ≥ 3:1 cho focus và viền) ở cả 3 chế độ: sáng, tối, high-contrast.
- **Bàn phím, screen reader:** thứ tự tab, focus ring, Escape đóng menu, `aria-expanded`, nhãn form, thông báo lỗi `aria-live`.
- **Sửa 10 chỗ `.catch(() => {})`:** thêm trạng thái lỗi riêng; sửa `/profile` báo lưu sai.
- **Responsive:** soát 4 cỡ màn hình (360, 414, 768, 1280px) trên header, portal, bản đồ, booking, SOS.
- **Kiểm thử:** lint, test, build, `verify-production`; xem tận mắt bằng trình duyệt ở 4 cỡ (dùng browser pane). Không thử được NVDA/VoiceOver thì ghi rõ là chưa kiểm.

### Đợt D — Trang chủ, gallery, Khám phá (trung bình)

- Gộp 4 section trùng ý (`app/page.jsx:293-361`) thành 1–2 section, **không xóa chức năng**: giữ VoiceBar, FeaturedCarousel, InstallAppCard, SOS.
- Thêm gallery: link thường, alt mô tả, ảnh trang trí để alt rỗng. Lightbox chỉ làm nếu có focus trap đúng chuẩn.
- Khám phá: phân loại theo EX01; **tìm không dấu** (normalize NFD); lọc theo tiêu chí tiếp cận *chỉ khi có dữ liệu*; có trạng thái không có kết quả và nút xóa lọc.
- Lấy lại ảnh WebP có nguồn và `media-sources.json` từ `c0e2092`.

### Đợt E — Bài viết, điểm đến, chó dẫn đường (lớn)

- `/destination/[slug]`: lấy lại từ `c0e2092`. **Giữ `/destination?d=`** bằng redirect 308; slug không tồn tại trả 404 thật.
- Ưu tiên Hồ Hoàn Kiếm, Văn Miếu, Hoàng thành Thăng Long. Mỗi trang có giới thiệu, cách đi, thông tin tiếp cận (*đã xác minh / chưa xác minh*), lưu ý, nguồn và ngày cập nhật.
- `/articles`: bài đầu tiên là **Cluster 8 "Trải nghiệm Hà Nội bằng âm thanh"**, viết theo outline 1.500 từ và QA checklist trong `phân tích.md`. Các bài khác theo Topic Cluster của N08. **Nội dung bài cần nhóm duyệt** vì đây là phần bài tập content.
- `/explore/guide-dogs`: chỉ là thông tin hướng dẫn, **không tuyên bố WayEcho cung cấp chó dẫn đường**.
- Liên kết chéo bài viết ↔ điểm đến ↔ dịch vụ, không để link chết.

### Đợt F — SEO kỹ thuật và nội dung (nhỏ đến trung bình)

- Title và description riêng cho từng trang, theo mẫu trong bảng requirement (ví dụ: *"Hồ Hoàn Kiếm – Thông tin tiếp cận cho người khiếm thị | WayEcho"*).
- `app/sitemap.js`, `app/robots.js`, canonical, Open Graph, `noindex` cho portal và trang cá nhân. Lấy lại `lib/seo.js` và cần `NEXT_PUBLIC_SITE_URL`.
- Structured data `Article` và `BreadcrumbList`.
- Từ khóa lấy từ N08: "du lịch Hà Nội cho người khiếm thị", "trải nghiệm Hà Nội bằng âm thanh"…, **không nhồi**.
- SEO11 (Search Console): **bạn tự làm** sau khi deploy; mình soạn sẵn hướng dẫn.

### Đợt G — Đối tác, Guide, Assistant (lớn, phụ thuộc Q3)

- Làm được ngay: trang giới thiệu hợp tác, form có validation và trạng thái, gắn API thật hoặc gắn nhãn DEMO rõ ràng.
- Cần backend: lưu hồ sơ bền vững, email thật, xác minh đối tác, phân công Guide. **Lập phương án riêng, không tự chọn dịch vụ có phí.**
- Thêm RV02 "Báo cáo thông tin sai".
- Quảng cáo (AD01–07) chỉ làm khi bạn duyệt riêng.

---

## 6. Rủi ro và phụ thuộc

| Rủi ro | Mức | Cách giảm |
|---|---|---|
| Lấy lại `c0e2092` nguyên khối, làm hỏng bố cục và font | Cao | Chỉ `git checkout <commit> -- <file>` từng file, review diff |
| Thêm auth làm hỏng các trang demo hiện có (Vercel) | Cao | Tài khoản demo, ghi rõ hướng dẫn đăng nhập, `verify-production` kiểm tra mọi API flow |
| `next build` làm hỏng dev server đang chạy | TB | Không chạy build khi dev server đang bật |
| JSON store trên Vercel mất dữ liệu | TB | Q3; trước mắt trả `persisted:false` để không nói dối |
| Camera AI và OCR thật cần API có phí | TB | Giữ demo, ghi rõ; đề xuất riêng khi bạn muốn |
| Không có thiết bị thật hay screen reader để kiểm thử | TB | Ghi rõ "chưa kiểm" trong mọi báo cáo; nhờ người dùng khiếm thị thử |
| Nội dung tiếp cận chưa khảo sát thực địa | Cao (đạo đức) | Luôn hiện "Chưa xác minh"; không dùng chữ "dễ tiếp cận" khi chưa có nguồn |

---

## 7. Bước tiếp theo đề xuất

1. Bạn trả lời **Q1–Q5** ở mục 0.
2. Mình làm **Đợt 0** (clone, nhánh backup, baseline) và báo kết quả baseline.
3. Bắt đầu **Đợt A** trên nhánh `fix/p0-batch-a`, xong thì dừng lại để bạn review.
