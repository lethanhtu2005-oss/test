# Báo cáo Đợt A — Sửa lỗi P0 nhỏ

> Ngày 17/10/2026 · Nhánh `fix/p0-batch-a` (tạo từ `main` @ `c83898c`) · **Chưa commit, chưa push**
> Nguồn: port từ `e45d773` (nhánh `backup-preview`), kèm 3 sửa bổ sung do kiểm thử trình duyệt phát hiện.
> Log: `D:\PROJECT_ALL\echo\baseline\batch-a\`

## 1. Lỗi đã sửa

| ID | Trước | Sau |
|---|---|---|
| A1 | Mọi booking hiện chip "Đã xác nhận" và icon tick xanh | Chip lấy theo `status`: chờ xử lý / DEMO / đã xác nhận / đã từ chối / đã hủy. Trạng thái lạ thì hiện "Chưa rõ trạng thái". Nút nghe lại đọc cả trạng thái |
| A1 | API lỗi thì hiện "Bạn chưa có đặt chỗ nào" | Hiện thông báo lỗi (`role="alert"`) kèm nút **Thử lại** |
| A2 | `/navigation?to=...` bị bỏ qua | Tìm điểm đến theo slug hoặc id. Tìm thấy thì zoom tới điểm; sai hoặc thiếu tọa độ thì báo rõ và giữ bản đồ tổng quan. Có `to` thì không vẽ tuyến minh họa giả |
| A3 | Desktop và 3 portal không có SOS; portal Guide trên mobile không có SOS ở đâu cả | Nút SOS ở Header Traveler, Guide, Business, Admin. Giữ nguyên SOS ở bottom nav mobile và footer |
| A4 | Mọi lỗi GPS chung một thông báo; không xử lý offline; không có nút gọi | Tách 3 thông báo (từ chối quyền / không lấy được vị trí / hết giờ); báo khi mất mạng; có nút `tel:` khi liên hệ khẩn cấp chứa đúng một số. Vẫn chỉ xin vị trí **khi bấm nút** |

## 2. File thay đổi

| File | Lý do |
|---|---|
| `lib/bookingStatus.js` *(mới)* | Bảng ánh xạ trạng thái → nhãn và màu (A1) |
| `lib/navigationTarget.js` *(mới)* | Tìm điểm đến từ `to` và kiểm tra tọa độ (A2) |
| `lib/sos.js` *(mới)* | Xử lý lỗi GPS, thông báo mạng, tách số điện thoại (A4) |
| `components/SOSLink.jsx` *(mới)* | Nút SOS dùng chung, có `aria-label`, focus ring, cao 44px (A3) |
| `tests/p0-a.test.mjs` *(mới)* | 5 test cho A1–A4 |
| `app/my-booking/page.jsx` | A1. Khác `e45d773`: bỏ link `/login` (trang này chỉ có ở Đợt B), thay bằng nút **Thử lại** |
| `app/navigation/page.jsx`, `components/MapView.jsx` | A2. Bản đồ đổi tâm bằng `useMap().setView` |
| `app/sos/page.jsx` | A4 |
| `components/Header.jsx`, `BusinessNav.jsx`, `AdminNav.jsx`, `GuideNav.jsx` | Chèn `<SOSLink />` bằng tay. **Không** lấy menu mới của Đợt D/G trong `e45d773`, vì sẽ sinh link chết |

### 3 sửa bổ sung (không có trong `e45d773`, phát hiện khi kiểm thử bằng trình duyệt)

1. **`SOSLink` thêm `bg-white`.** Trên nền đen của Admin và ở chế độ tương phản cao, chữ đỏ trên nền trong suốt chỉ đạt khoảng **3,2:1**, dưới chuẩn AA 4,5:1. Có nền trắng thì đạt khoảng **6,5:1**.
2. **Portal Guide ở 360–375px: nút SOS đè lên logo.** Đã thu khoảng cách trên mobile và ẩn nút chuông dưới 640px. Nút chuông vốn **không có chức năng** (thiếu `onClick`), còn trang Thông báo vẫn mở được qua menu avatar. Logo giữ nguyên kích thước.
3. **Portal Guide ở 1024–1279px: thêm SOS làm menu gãy dòng.** Đã ẩn chữ "Guide Portal" cạnh logo trong khoảng này (từ 1280px trở lên vẫn hiện). Link logo vẫn có `aria-label` "Guide Portal".

## 3. Kiểm thử đã chạy

### Tự động

| Lệnh | Kết quả |
|---|---|
| `npm test` | **10/10 đạt** (5 cũ + 5 mới) |
| `npm run lint` | 0 lỗi, 9 cảnh báo, **giống baseline**, không thêm cảnh báo mới |
| `npm run build` | **Đạt**, 40 trang, không cảnh báo |

### Trình duyệt thật (`next start` bản production, Chromium trong app)

| Trường hợp | Kết quả |
|---|---|
| `/navigation?to=ho-guom` | Zoom vào Hồ Gươm, báo "Đang xem vị trí… Chưa có tuyến đường thực tế", không vẽ tuyến giả ✅ |
| `/navigation?to=khong-ton-tai` | Báo "Không tìm thấy điểm đến", giữ bản đồ tổng quan ✅ |
| `/navigation` (không tham số) | Như cũ, có tuyến minh họa ✅ |
| `/my-booking` với 5 booking thử (pending, demo, confirmed, rejected, cancelled) | Mỗi booking hiện đúng nhãn trạng thái ✅ |
| `/my-booking` khi API trả 500 | Hiện lỗi, **không** hiện "chưa có đặt chỗ"; bấm Thử lại khi API ổn thì tải lại được ✅ |
| SOS: từ chối quyền / hết giờ / offline (giả lập) | Đúng 3 thông báo riêng ✅ |
| SOS: liên hệ "Me Lan 0912 345 678" | Nút gọi `tel:0912345678` ✅ |
| Nút SOS ở `/`, `/admin`, `/business`, `/guide` | Có ở cả 4 ✅ |
| Mobile 360 / 375px | Không tràn ngang; SOS ở header, bottom nav, footer ✅ |
| Portal Guide 360 / 375 / 1024 / 1280px | Không đè, menu không gãy dòng ✅ |
| Chế độ tương phản cao | SOS chữ đỏ trên nền trắng ✅ |

Dữ liệu booking thử đã xóa sau khi kiểm (`data/db.json`).

## 4. Lỗi còn tồn tại (chuyển sang đợt sau)

| Lỗi | Có từ trước? | Đợt |
|---|---|---|
| Portal Guide ở **320px**: logo vẫn bị đè 23px | Do thêm SOS, chỉ xảy ra ở 320px | C (responsive) |
| **Header Traveler ở 1280px: toàn bộ menu và các nút gãy 2–3 dòng** | **Có từ trước** trên `main` (ẩn SOS đi vẫn gãy) | C |
| Nút chuông portal Guide không có chức năng | Có từ trước | C |
| Toàn bộ API **chưa có xác thực**; `/my-booking` đang hiện booking của **mọi người** | Có từ trước | **B** |
| 12 lỗ hổng npm (Next 16.3.6) | Có từ trước | **B** |

## 5. Bảo mật

Đợt A **không** đụng tới bảo mật. Toàn bộ vấn đề xác thực, phân quyền, consent và lưu trữ vẫn còn nguyên, xử lý ở Đợt B. **Website chưa an toàn để chạy production.**

## 6. Giới hạn môi trường

- GPS, offline và API lỗi được **giả lập bằng JavaScript** trong trình duyệt, chưa thử trên điện thoại thật với quyền vị trí thật.
- Chưa thử bằng screen reader thật (NVDA / VoiceOver / TalkBack).
- Bản đồ cần mạng để tải nền OpenStreetMap.

## 7. Tính năng vẫn ở chế độ demo

SOS (không gửi đi đâu, không gọi cứu hộ), điều hướng giọng nói (tuyến minh họa), booking (không có nhà cung cấp, tồn kho hay thanh toán thật), các portal Business/Guide/Admin. Các nhãn DEMO được giữ nguyên.
