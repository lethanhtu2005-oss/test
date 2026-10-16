# Storage và điều kiện tích hợp database

Không có DATABASE_URL hoặc cấu hình nhà cung cấp DB trong workspace; chỉ có .env.example. Không mở giá trị secret hoặc tạo dịch vụ bên ngoài. Giữ nguyên chặn VERCEL và production thiếu local-single-host.

Ảnh hưởng: login/session lookup/logout, bookings, requests, saved, trip, reviews (kể cả GET công khai), notifications và inbox inquiries cần đọc/ghi store. Khi không có storage phù hợp, chúng trả 503. Portal có cookie cũng có thể không xác thực được vì cần đọc session/user. Catalog, bài viết, gallery, SEO, TTS và SOS demo không phụ thuộc DB; hồ sơ tiếp cận vẫn cục bộ. Không có đường ghi fallback bộ nhớ hay filesystem tạm.

Repository đề xuất cho đợt chọn DB: readSnapshot() trả snapshot các collection; transaction(mutator) kiểm khóa/serialization, gọi mutator, commit nguyên tử hoặc rollback toàn bộ. Giữ list/add/update/remove/transaction hiện có làm façade để không thay hợp đồng API. DB adapter ban đầu có thể lưu snapshot có phiên bản và khóa hàng trong transaction; không chạy callback mutator trên dữ liệu chưa khóa hoặc tự retry callback có side effect. Đây là đề xuất, chưa có adapter production được kích hoạt. Cần đo kích thước dữ liệu rồi quyết định tách repository theo nghiệp vụ nếu cần scale.

Điều kiện trước tích hợp: chọn môi trường và DB; secret được cấp qua cấu hình ngoài source; snapshot/manifest và restore đã thử; mapping owner legacy được chủ dữ liệu xác nhận; staging import giữ ID, status và consent; test đồng thời/rollback; đối chiếu số lượng/checksum; chuyển traffic và rollback có người chịu trách nhiệm. Không tự gán owner hoặc reset dữ liệu.

JSON chỉ dùng local/một host có volume bền vững. Lock có metadata PID/host/time; không tự thu hồi lock dựa vào tuổi. scripts/inspect-store-lock.mjs chỉ chẩn đoán, không xóa. Crash trước rename giữ snapshot cũ; file tạm và lock có thể còn. Marker initialized ngăn seed lại khi DB đã khởi tạo bị mất. Marker và JSON phải được sao lưu cùng nhau.

Bảo trì lock: ngừng toàn bộ writer, xác minh host/PID (lưu ý PID reuse), sao lưu JSON/marker/lock/file tạm, xác minh JSON, rồi quản trị mới quyết định dọn lock và khởi động lại. Không có lệnh tự xóa trong app. Mất cả DB và marker, hỏng filesystem hoặc crash điện ở mức phần cứng cần quy trình restore; không coi atomic rename là giải pháp backup hoặc DB đa instance.
