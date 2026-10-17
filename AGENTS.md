# AGENTS.md — Hướng dẫn cho AI agent làm việc với WayEcho

> Đọc file này trước khi sửa code. Người dùng cuối và nhóm phát triển là người Việt: **giao diện, thông báo lỗi và tài liệu viết bằng tiếng Việt**, thuật ngữ kỹ thuật giữ tiếng Anh.

## 1. WayEcho là gì

WayEcho là **prototype nền tảng du lịch tiếp cận cho người mù và người nhìn kém tại Hà Nội**: tìm điểm đến có thông tin tiếp cận kèm nguồn, đặt dịch vụ kèm yêu cầu hỗ trợ, đọc nội dung bằng giọng nói, SOS, trợ lý camera. Có 4 vai trò: **Traveler** (khách), **Business** (doanh nghiệp), **Guide/Personal Assistant**, **Admin**.

**Trạng thái:** bản demo. Bảo mật và phân quyền đã làm ở server, nhưng **chưa có database production**. Nhà cung cấp, thanh toán, SOS cứu hộ, nhận diện AI và OCR **chưa có thật** và luôn được gắn nhãn DEMO.

## 2. Stack và lệnh

- Next.js 16 (App Router, Turbopack; bản trong lock: 16.4.2), React 19, Tailwind CSS **3.4** (chủ ý chưa lên v4, xem mục 9), Leaflet + react-leaflet 5. JavaScript thuần (không TypeScript), alias `@/` = gốc repo (`jsconfig.json`).
- Node.js ≥ 20.9.

```bash
npm ci
npm run dev          # http://localhost:3000, không cần biến môi trường
npm test             # node:test, tests/**/*.test.mjs
npm run lint         # ESLint (eslint-config-next)
npm run build        # KHÔNG chạy khi dev server đang bật (dùng chung .next/)
node scripts/http-smoke.mjs   # sau build: ~208 kiểm tra HTTP trên server production tạm, DB tạm
```

## 3. Cấu trúc thư mục

```
app/                 Route (App Router). Mỗi thư mục có page.jsx; nhiều thư mục có layout.jsx chỉ để đặt metadata/title
  api/               API route (route.js) — xem mục 5
  layout.jsx         Root layout: font, ThemeProvider/A11yProvider, StorageNotice, Header, Footer, MobileNav, AccessibilityToolbar, PWARegister
  robots.js, sitemap.js, not-found.jsx
components/          Component dùng chung (hầu hết "use client")
lib/                 Logic thuần + server: auth, store, phân quyền, validate, seo, theme, sos, camera…
data/                Dữ liệu tĩnh: destinations.js, catalog.js, businesses.js, guides.js, articles.js, db.seed.json
proxy.js             (Next 16 "proxy" = middleware cũ) chặn portal /business, /admin, /guide ở server
public/              Ảnh (assets/images, có CREDITS.md), icon PWA, manifest, sw.js
scripts/             provision-user.mjs (cấp tài khoản), http-smoke.mjs, inspect-store-lock.mjs
tests/               *.test.mjs + helpers/alias-loader.mjs
docs/                (chỉ trên nhánh docs) báo cáo nâng cấp A–G, bài viết nháp
```

## 4. Route

**Traveler (công khai):**

| Route | Nội dung |
|---|---|
| `/` | Trang chủ (gallery ảnh dùng `<dialog>`, `components/DestinationGallery.jsx`) |
| `/explore`, `/search?q=` | Khám phá theo nhu cầu; tìm toàn catalog, **gõ không dấu được** (`lib/search.js`) |
| `/destination` · `/destination?d=<slug>` | Danh sách · chi tiết điểm đến (`app/destination/DestinationView.jsx`): nguồn, ngày đối chiếu, lưu, báo thông tin sai |
| `/item?id=<catalogId>` | Chi tiết dịch vụ catalog; `/item?slug=` cũ chuyển hướng sang điểm đến |
| `/booking?item=<id>` → `/my-booking` | Đặt chỗ DEMO kèm yêu cầu hỗ trợ (consent mặc định tắt) → xem trạng thái |
| `/my-trip`, `/notifications`, `/profile`, `/review` | Chuyến đi, thông báo, hồ sơ tiếp cận (lưu `localStorage`), đánh giá |
| `/navigation?to=<slug>` | Bản đồ Leaflet + các bước điều hướng minh họa |
| `/assistant` | Camera thật (chụp/chọn ảnh, không gửi đi) + ví dụ mô tả bằng ảnh mẫu |
| `/sos` | SOS DEMO: xin vị trí khi bấm, xử lý từ chối/timeout/offline, `tel:` liên hệ khẩn cấp |
| `/articles`, `/articles/[slug]` | Cẩm nang (`data/articles.js`) |
| `/services/guide-dogs` | Thông tin chó dẫn đường (chỉ thông tin, không có dịch vụ) |
| `/partners/[kind]` | `business` · `guide` · `cooperate`: giới thiệu + form "quan tâm hợp tác" |
| `/help`, `/app`, `/privacy`, `/terms`, `/sitemap`, `/staff`, `/login` | Hỗ trợ, cài PWA, pháp lý, sơ đồ trang, đăng nhập tài khoản được cấp |

**Portal (proxy.js yêu cầu đăng nhập đúng vai trò; phiên khách bị chuyển về trang login):**
- `/business`, `/business/{bookings,requests,services,reviews,profile}`: `BusinessShell` lấy `businessId` từ phiên server.
- `/admin`, `/admin/{businesses,moderation,inquiries}`: moderation gồm review và báo cáo thông tin sai.
- `/guide`, `/guide/{bookings,schedule,notifications,profile}`; `/guide/login` và `/guide/register` công khai. Dữ liệu Guide vẫn là DEMO (`data/guides.js`).

## 5. API (app/api) và phân quyền

Mọi handler cần đăng nhập đều bọc bằng `secured(handler, roles, { guest })` trong `lib/auth.js`. Hàm này kiểm tra `Origin` với request ghi, xác thực cookie, kiểm vai trò. `guest: true` nghĩa là Traveler chưa có phiên sẽ được **tự cấp phiên khách**.

| API | Method → quyền |
|---|---|
| `/api/auth/login` · `logout` · `session` | POST công khai (có giới hạn số lần) · POST · GET (đã đăng nhập) |
| `/api/bookings` | GET mọi vai trò + khách (lọc theo quyền) · POST traveler + khách · PATCH: traveler chỉ **hủy** của mình, business/admin xác nhận/từ chối |
| `/api/requests` | GET mọi vai trò + khách · PATCH business sở hữu / admin |
| `/api/notifications` | GET (vai trò phải khớp, trừ admin) + khách · POST chỉ admin |
| `/api/saved`, `/api/trip` | GET/POST traveler + khách · DELETE traveler (chỉ của mình) |
| `/api/reviews` | GET công khai (không trả ownerId) · POST traveler + khách |
| `/api/reports` | POST traveler + khách (báo thông tin sai, 10 lần/giờ) · GET chỉ admin |
| `/api/inquiries` | POST công khai **chỉ khi** `WAYECHO_INQUIRIES_ENABLED=1`, lưu bằng file và có admin · GET chỉ admin |

Phạm vi đọc dữ liệu nằm ở `lib/permissions.js`. Bản ghi phải có `ownerId`; Business chỉ thấy `businessId` của mình; Guide chỉ thấy `guideId`; Admin thấy tất cả. Bản ghi cũ không có chủ thì bị ẩn.

## 6. Kiến trúc chính

- **Phiên đăng nhập** (`lib/auth.js`): cookie `we_session` = claims + chữ ký HMAC (`WAYECHO_SESSION_SECRET`), HttpOnly, SameSite=Lax, Secure ở production. Không lưu session ở server, nên không thu hồi từng phiên; đổi mật khẩu hoặc khóa tài khoản sẽ vô hiệu mọi phiên cũ (`pw` mark). Phiên khách: `uid = guest_<32 hex>`, hạn 30 ngày; tài khoản được cấp: hạn 8 giờ. Dev thiếu secret thì tự sinh secret theo tiến trình; production thiếu secret thì **503**.
- **Tài khoản:** `WAYECHO_USERS` (JSON, chỉ chứa hash scrypt) + collection `users` trong store. Tạo bằng `scripts/provision-user.mjs [--env] email role [businessId|guideId]` (mật khẩu đọc từ stdin). Business demo: `b1/b2/b3` trong `data/businesses.js`.
- **Nguồn IP để giới hạn đăng nhập** (`lib/loginLimiter.js`), theo thứ tự: Vercel (`x-real-ip`) → `WAYECHO_TRUSTED_IP_HEADER` (vd. `cf-connecting-ip` khi chạy sau Cloudflare Tunnel; chỉ bật khi app không truy cập trực tiếp được) → header ký HMAC từ reverse proxy (`WAYECHO_PROXY_SECRET`) → dev: `development-local`.
- **Lưu trữ** (`lib/store.js`): `transaction(fn)` là nguyên tử. Chế độ `file`: JSON có lock, ghi qua file tạm + rename, dùng cho dev hoặc `WAYECHO_STORAGE_MODE=local-single-host`. Chế độ `memory`: mặc định trên Vercel, mất khi instance khởi động lại; lúc đó `StorageNotice` hiện banner và response có header `X-WayEcho-Storage: memory`. Collections: `bookings, saved, trip, reviews, requests, notifications, users, loginAttempts, inquiries, reports`. Seed: `data/db.seed.json`; dữ liệu chạy: `data/db.json` (gitignore). Ghi lỗi thì trả 503, **không bao giờ báo thành công giả**.
- **Consent:** booking chỉ tạo yêu cầu hỗ trợ khi `shareAccessibility === true` (kiểm ở server, mặc định false).
- **Trợ năng:** `A11yProvider` (`speak()` dùng TTS tiếng Việt + vùng `aria-live`; chữ lớn, tương phản cao, giảm chuyển động) đặt `data-textsize`, `data-contrast`, `data-reduce` trên `<html>`. `ThemeProvider` + `lib/theme.js` đặt `data-theme` (system/light/dark); script bootstrap chạy trong `<head>` để không nháy màu. Bộ chọn theme, **tìm kiếm bằng giọng nói** và **nghe nội dung trang** nằm trong `AccessibilityToolbar` (cụm nút nổi góc dưới phải). Màu dùng token Tailwind (`primary, ink, ink-soft, surface, surface-alt, line, accent, accent-dark`) trỏ tới CSS variables; theme tối và tương phản cao ghi đè trong `app/globals.css` bằng selector `html[data-theme="dark"]` / `html[data-contrast="high"]` và các class `hc-surface`, `hc-muted`, `hc-border`.
- **localStorage:** `we-theme, dl-contrast, dl-textsize, dl-motion, we-speech-rate, we-access-prefs, we-emergency, we-share-business, we-usertype`. Hồ sơ tiếp cận chỉ lưu trên thiết bị.
- **SEO** (`lib/seo.js`): `pageMetadata()`, `jsonLd()`. Không có `NEXT_PUBLIC_SITE_URL` (domain https thật, đặt lúc build) thì toàn site `noindex`, không canonical, sitemap rỗng; đây là chủ ý để bản preview không bị index.
- **Dữ liệu điểm đến** (`data/destinations.js`): `slug, name, area, address, coordinates, image(+Fallback, alt, imageCredit, imageSource), summary, facts, visit, access{level,status,blind,lowVision,staff,audio}, audio, tags, sources`. `data/catalog.js` gộp điểm đến (id = slug) với dịch vụ DEMO; `getItem(id)` là nguồn chuẩn để server kiểm id, tên và giá.

## 7. Biến môi trường (xem `.env.example`)

| Biến | Khi nào cần |
|---|---|
| `WAYECHO_SESSION_SECRET` | **Bắt buộc ở production** (≥ 32 ký tự) |
| `WAYECHO_USERS` | Tài khoản Business/Guide/Admin khi không ghi được file (Vercel) |
| `WAYECHO_STORAGE_MODE`, `WAYECHO_DATA_PATH` | Để trống: file khi dev, memory trên Vercel. Production tự host: `local-single-host` |
| `WAYECHO_ORIGIN` | Origin được phép gửi request ghi; bắt buộc khi production ngoài Vercel (vd. URL tunnel) |
| `WAYECHO_TRUSTED_IP_HEADER` / `WAYECHO_PROXY_SECRET` | Nguồn IP khi tự host sau proxy (mục 6) |
| `NEXT_PUBLIC_SITE_URL` | Domain https chính thức cho canonical/sitemap |
| `WAYECHO_INQUIRIES_ENABLED` | `1` mới nhận form hợp tác |

## 8. Quy tắc bắt buộc khi sửa

1. **Giữ nhận diện:** logo, màu `primary` #f8ae38, font Barlow Condensed / Lato / Lora, bố cục hiện có. Không thiết kế lại toàn bộ. Không xóa `VoiceBar`, `Reveal`, `FeaturedCarousel`: hiện chúng không được gắn ở trang nào (kể cả trên `main`) nhưng dự án yêu cầu giữ lại.
2. **Giữ route, slug, ID, API và cấu trúc dữ liệu.** Đổi gì thì phải tương thích ngược (vd. `/destination?d=`, `/item?slug=`).
3. **SOS phải luôn có** ở Header, header 3 portal, MobileNav và Footer. Sau mọi thay đổi giao diện hoặc route, kiểm lại luồng SOS. Không xin vị trí hay bật camera khi chưa có thao tác của người dùng.
4. **Không bịa dữ liệu:** không tạo review, đánh giá sao, giá, đối tác, tiện ích tiếp cận, số liệu hay chứng nhận giả. Thông tin chưa có nguồn thì ghi "Chưa xác minh / Cần khảo sát". Giữ nhãn **DEMO** cho mọi thứ chưa có dịch vụ thật.
5. **Không báo thành công khi chưa thành công** (ghi lỗi trả 503, UI hiển thị lỗi riêng, không đánh đồng lỗi với "danh sách trống").
6. **Trợ năng:** mọi control có tên truy cập; focus nhìn thấy được; vùng bấm ≥ 44px; ảnh có `alt` mô tả đúng (ảnh trang trí dùng `alt=""`); tương phản chữ ≥ 4,5:1 ở **cả theme sáng, tối và tương phản cao**; thông báo động dùng `role="status"` / `role="alert"`; đóng menu/dialog bằng Escape và trả focus. Màu đỏ, nền đen viết cứng cần có quy tắc ghi đè cho theme tối trong `globals.css`.
7. **Phân quyền luôn kiểm ở server** (`secured` + `permissions`), không tin role hay ownerId từ client.
8. Thêm logic thì thêm test (`node:test`). Ưu tiên tách logic thuần vào `lib/` để test được.

## 9. Kiểm thử và các bẫy đã gặp

- `tests/p0-b.test.mjs` import route handler thật qua `tests/helpers/alias-loader.mjs` (`module.register`, chạy được từ Node 20.6) để hiểu alias `@/`. Test bảo mật dùng DB tạm (`WAYECHO_DATA_PATH`).
- `scripts/http-smoke.mjs` tự đặt secret, DB tạm và tài khoản; kiểm mọi link nội bộ, anchor, 404, sitemap, phân quyền và khởi động lại server.
- **Chạy `next start` ở máy local** cần `.env.local` có ít nhất `WAYECHO_SESSION_SECRET`, `WAYECHO_ORIGIN`, `WAYECHO_STORAGE_MODE`; thiếu thì API trả 503 (đúng thiết kế fail-closed).
- **Service worker** (`public/sw.js`) chỉ đăng ký ở production; nếu giao diện không đổi sau khi sửa, hãy gỡ service worker và xóa cache.
- **Trình duyệt tự động hoặc chạy nền:** `requestAnimationFrame` có thể không chạy. Khi đó React 19.2 không hoán nội dung streaming (còn `div hidden id="S:0"`), và cuộn mượt (`scroll-behavior: smooth`) không cuộn được. Đó là do môi trường, không phải lỗi web. Đừng phụ thuộc rAF cho logic quan trọng.
- Giữ **Tailwind 3**. Lên v4 chỉ vá 4/9 cảnh báo `npm audit` (đều nằm trong công cụ build) và bỏ hỗ trợ trình duyệt cũ (Safari < 16.4), trong khi người dùng mục tiêu có thể dùng máy đời cũ. 5 cảnh báo còn lại do `eslint-config-next` ghim `fast-glob` cũ.
- Lock file của store: nếu một tiến trình chết khi đang giữ `data/db.json.lock`, mọi thao tác ghi bị chặn cho tới khi xóa lock bằng tay (`scripts/inspect-store-lock.mjs`). Đây là chủ ý.
- Cảnh báo git "LF will be replaced by CRLF" trên Windows là vô hại.

## 10. Nhánh và tài liệu

- `main`: bản gốc ngày 23/09. `upgrade/a-g`: toàn bộ nâng cấp A → G (mỗi đợt hoặc lần sửa một commit). `docs`: `upgrade/a-g` + thư mục `docs/` (báo cáo, bài nháp Cluster 8).
- Báo cáo tổng hợp: `docs/bao-cao/BAO_CAO_TONG_HOP.md` (trên nhánh docs). Lịch sử thay đổi cũ hơn: `IMPROVEMENTS.md`, `HOMEPAGE_REWORK.md`.
- **Việc còn mở:** database thật và tài khoản Traveler; nhận diện AI/OCR (cần API có phí); quảng cáo (chưa có dữ liệu thật); thử với screen reader và thiết bị thật; Search Console.
