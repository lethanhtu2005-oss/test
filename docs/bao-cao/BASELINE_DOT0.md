# WayEcho — Kết quả Đợt 0 (baseline)

> Ngày 17/10/2026 · Thư mục làm việc: `D:\PROJECT_ALL\echo\wayecho` · Nhánh `main` @ `c83898c`
> Log đầy đủ: `D:\PROJECT_ALL\echo\baseline\*.log`

## 1. Đã làm

| Bước | Kết quả |
|---|---|
| Clone repo | Xong. Working tree sạch, `main` khớp `origin/main` |
| Nhánh `backup-ban-moi` → `c0e2092` | Tạo **local**, chưa push |
| Nhánh `backup-preview` → `e45d773` | Tạo **local**, chưa push (thêm ngoài kế hoạch, lý do ở mục 3) |
| `npm ci` | Đạt. Cài 390 package mất khoảng 2 phút. Node v22.14.0, npm 11.12.1 |
| `npm test` | **5/5 đạt** (chỉ test `lib/validate.js`) |
| `npm run lint` | **0 lỗi, 9 cảnh báo** |
| `npm run build` | **Đạt.** Next 16.3.6, 40 trang tĩnh, 8 route động (6 API + `/destination` + `/item`) |
| `npm audit` | **12 lỗ hổng: 10 high, 2 moderate** (chi tiết ở mục 2) |

Không sửa file nào trong repo. Không push. Chưa chạy dev server, chưa kiểm tra bằng trình duyệt.

### 9 cảnh báo lint

- 8 cảnh báo `react-hooks/set-state-in-effect`: `booking`, `my-trip`, `profile`, `sos`, `A11yProvider`, `GuideShell`, `InstallAppCard`, `useSpeechRecognition`.
- 1 cảnh báo `exhaustive-deps` ở `business/reviews` (thiếu `biz.items`).

## 2. Lỗ hổng bảo mật mới (README cũ ghi "0 lỗ hổng" là đã lỗi thời)

| Package | Mức | Ghi chú | Cách sửa |
|---|---|---|---|
| `next` 16.0.0–16.3.7 (đang dùng **16.3.6**) | High | 6 advisory: SSRF ở Image Optimization, cache poisoning SSG/ISR, lộ thông tin… | `npm audit fix` (không breaking) |
| `sharp` < 0.35.5 | High | Lỗi trong librsvg | `npm audit fix` |
| `source-map-js` 1.0.0–1.2.1 | High | DoS | `npm audit fix` |
| `braces` | High | DoS | Chỉ có qua `--force` (breaking), cần xem kỹ |
| `postcss-selector-parser` < 7.1.6 | Moderate | CPU exhaustion | Chỉ có qua `--force` |

Lưu ý: npm trên máy đang trỏ tới mirror `registry.npmmirror.com`. Mirror này không hỗ trợ audit, nên mình chạy audit qua `--registry=https://registry.npmjs.org`.

**Đề xuất:** thêm bước **"nâng Next ≥ 16.3.8 bằng `npm audit fix` (không `--force`)"** vào đầu Đợt B, chạy lại test/lint/build sau khi nâng.

## 3. Phát hiện mới: nhánh `wayecho-preview`

Hôm qua chưa có nhánh này. Lịch sử của nó:

| Commit | Giờ (16/10) | Nội dung |
|---|---|---|
| `e45d773` | 22:30 | "Update WayEcho preview": 184 file, +7.804 / −671 |
| `b4f6121` | 22:57 | Revert toàn bộ, nên nhánh hiện **giống hệt `main`** |

`e45d773` **khác hẳn** `c0e2092`: nó làm **tuần tự** A, B, C, D, E, F, G rồi thêm Prompt 8–10. Theo báo cáo đi kèm:

- **Đợt A đã làm:** nhãn 5 trạng thái booking, đọc `?to=` theo slug, SOS ở header và cả 3 portal, phân biệt lỗi GPS và offline (`lib/bookingStatus.js`, `lib/navigationTarget.js`, `lib/sos.js`).
- **Đợt B đã làm:**
  - Session token ngẫu nhiên, chỉ lưu bản hash, cookie HttpOnly/SameSite=Strict. Mật khẩu băm scrypt. Tài khoản cấp bằng CLI, không có mật khẩu mặc định.
  - `proxy.js` chặn portal. API kiểm tra role và chủ sở hữu, giới hạn số lần đăng nhập.
  - Consent mặc định tắt và được kiểm tra ở server.
  - Ghi thất bại trả 503; trên Vercel thì chặn ghi.
- **Tự đánh giá:** test 42/42, HTTP smoke 203/203, build đạt. Kết luận của chính nó là **"NO-GO production"**: thiếu DB thật, chưa kiểm tra bằng trình duyệt và screen reader.
- **Mình chưa xác minh** các con số trên. Đó là lời của báo cáo trong commit.

**Ý nghĩa:** phần lớn Đợt A và B mà kế hoạch định viết mới thì **đã có một bản làm khá kỹ**. Thay vì viết lại từ đầu, nên **review và kiểm chứng `e45d773` theo từng đợt**: chạy test, build, đọc diff API và auth. Đạt thì lấy lại từng đợt vào nhánh riêng. Cách này nhanh hơn và tốn ít quota hơn.

Có hai điểm khác với phương án Q2 đã chốt:

1. `e45d773` dùng **session lưu server-side** (token và hash ghi trong store), không phải cookie ký HMAC. Cách này mạnh hơn vì thu hồi được, nhưng phụ thuộc store JSON.
2. Bản này **chặn ghi trên Vercel** (trả 503). Nghĩa là bản demo trên Vercel sẽ **không đặt chỗ, không lưu được nữa** cho đến khi có DB (liên quan Q3).

## 4. Câu hỏi cho bạn

- Bạn có biết vì sao `e45d773` bị revert sau 27 phút không (lỗi deploy, lỗi giao diện, hay chỉ là thử preview)?
- Mình đề xuất bước tiếp theo là **kiểm chứng `e45d773`**: chạy test, lint, build trên nhánh `backup-preview`, review diff Đợt A rồi Đợt B, và báo cáo phần nào lấy được, phần nào phải sửa.
