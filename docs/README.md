# Tài liệu nâng cấp WayEcho (A → G)

Thư mục này gom báo cáo để team kiểm tra phần nâng cấp trên nhánh `upgrade/a-g`. Code của nhánh `docs` giống hệt `upgrade/a-g`, chỉ thêm thư mục `docs/`.

## Đọc theo thứ tự

1. **[bao-cao/BAO_CAO_TONG_HOP.md](bao-cao/BAO_CAO_TONG_HOP.md):** tóm tắt toàn bộ, việc còn lại, vì sao chưa làm. *Đọc file này trước.*
2. [bao-cao/BAO_CAO_DOT_A.md](bao-cao/BAO_CAO_DOT_A.md): sửa lỗi P0 (trạng thái booking, bản đồ, SOS).
3. [bao-cao/BAO_CAO_DOT_B.md](bao-cao/BAO_CAO_DOT_B.md): bảo mật (đăng nhập, phân quyền, consent, lưu trữ).
4. [bao-cao/BAO_CAO_DOT_C_G.md](bao-cao/BAO_CAO_DOT_C_G.md): giao diện, theme, nội dung, SEO, đối tác.
5. Tham khảo thêm:
   - [bao-cao/KE_HOACH_TRIEN_KHAI.md](bao-cao/KE_HOACH_TRIEN_KHAI.md): kế hoạch **ban đầu**. Một số hướng đã đổi sau đó, xem báo cáo tổng hợp.
   - [bao-cao/BASELINE_DOT0.md](bao-cao/BASELINE_DOT0.md): hiện trạng trước khi sửa.
   - [bao-cao/KIEM_CHUNG_E45D773.md](bao-cao/KIEM_CHUNG_E45D773.md): đánh giá bản nâng cấp cũ đã bị revert.

## Nội dung chờ nhóm duyệt

- [noi-dung/BAI_CLUSTER8_NHAP.docx](noi-dung/BAI_CLUSTER8_NHAP.docx) (bản Markdown cùng tên): bài Cluster 8 "Trải nghiệm Hà Nội bằng âm thanh", **bản nháp, chưa đăng**.
- [noi-dung/BAI_CLUSTER8_GHI_CHU.md](noi-dung/BAI_CLUSTER8_GHI_CHU.md): SEO đề xuất, số chữ, alt-text, checklist QA, những điểm nhóm cần xác nhận.

## Xem thử website

- **Link demo tạm thời** (Cloudflare Tunnel) được gửi riêng. Link chỉ chạy khi máy chủ demo đang bật và **đổi mỗi lần khởi động lại**.
- Trên link demo, dữ liệu đặt chỗ, báo cáo… là dữ liệu thử. Không nhập thông tin cá nhân thật.
- Chạy trên máy mình:

  ```bash
  npm ci
  npm run dev
  ```

  Mở `http://localhost:3000`. Tạo tài khoản portal bằng `node scripts/provision-user.mjs email role [scope]` (xem README gốc).

## Kiểm tra nhanh nên thử

- Theme sáng/tối/theo thiết bị (nút ♿ góc dưới phải), Chữ lớn, Tương phản cao.
- Đặt chỗ không cần tài khoản → **Đặt chỗ của tôi** (trạng thái và ghi chú yêu cầu hỗ trợ).
- Trang điểm đến → **Báo thông tin tiếp cận chưa đúng**.
- **Trợ lý camera** (`/assistant`): mở camera, chụp hoặc chọn ảnh. Ảnh không gửi đi đâu.
- SOS ở mọi header; thử chặn quyền vị trí.
- Menu 5 nhóm, kể cả trên điện thoại.
