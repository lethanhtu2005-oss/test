# File thay đổi theo từng đợt

A là thêm, M là sửa. Không xóa đường dẫn nào của 150 file gốc. Không thay package.json/package-lock.json. Diff tương ứng ở patches/.

Bảng dưới dựa trên checkpoint Git. Patch A/B tách riêng SOS và auth trong Header/GuideNav để mỗi patch có thể áp dụng và test độc lập.

| Đợt | Loại | File | Lý do |
|---|---|---|---|
| A | M | app/my-booking/page.jsx | Trạng thái, navigation và SOS |
| A | M | app/navigation/page.jsx | Trạng thái, navigation và SOS |
| A | M | app/sos/page.jsx | Trạng thái, navigation và SOS |
| A | M | components/AdminNav.jsx | Trạng thái, navigation và SOS |
| A | M | components/BusinessNav.jsx | Trạng thái, navigation và SOS |
| A | M | components/MapView.jsx | Trạng thái, navigation và SOS |
| A | A | components/SOSLink.jsx | Trạng thái, navigation và SOS |
| A | A | lib/bookingStatus.js | Trạng thái, navigation và SOS |
| A | A | lib/navigationTarget.js | Trạng thái, navigation và SOS |
| A | A | lib/sos.js | Trạng thái, navigation và SOS |
| A | A | tests/p0-a.test.mjs | Trạng thái, navigation và SOS |
| B | M | .gitignore | Xác thực, scope, consent và lưu trữ |
| B | A | app/api/auth/login/route.js | Xác thực, scope, consent và lưu trữ |
| B | A | app/api/auth/logout/route.js | Xác thực, scope, consent và lưu trữ |
| B | A | app/api/auth/session/route.js | Xác thực, scope, consent và lưu trữ |
| B | M | app/api/bookings/route.js | Xác thực, scope, consent và lưu trữ |
| B | M | app/api/notifications/route.js | Xác thực, scope, consent và lưu trữ |
| B | M | app/api/requests/route.js | Xác thực, scope, consent và lưu trữ |
| B | M | app/api/reviews/route.js | Xác thực, scope, consent và lưu trữ |
| B | M | app/api/saved/route.js | Xác thực, scope, consent và lưu trữ |
| B | M | app/api/trip/route.js | Xác thực, scope, consent và lưu trữ |
| B | M | app/booking/page.jsx | Xác thực, scope, consent và lưu trữ |
| B | M | app/guide/login/page.jsx | Xác thực, scope, consent và lưu trữ |
| B | A | app/login/page.jsx | Xác thực, scope, consent và lưu trữ |
| B | M | app/profile/page.jsx | Xác thực, scope, consent và lưu trữ |
| B | M | components/GuideNav.jsx | Xác thực, scope, consent và lưu trữ |
| B | M | components/GuideShell.jsx | Xác thực, scope, consent và lưu trữ |
| B | M | components/Header.jsx | Xác thực, scope, consent và lưu trữ |
| B | A | components/LoginForm.jsx | Xác thực, scope, consent và lưu trữ |
| B | A | components/LogoutButton.jsx | Xác thực, scope, consent và lưu trữ |
| B | M | lib/api.js | Xác thực, scope, consent và lưu trữ |
| B | A | lib/auth.js | Xác thực, scope, consent và lưu trữ |
| B | M | lib/guideSession.js | Xác thực, scope, consent và lưu trữ |
| B | A | lib/permissions.js | Xác thực, scope, consent và lưu trữ |
| B | A | lib/personalCollection.js | Xác thực, scope, consent và lưu trữ |
| B | A | lib/redirect.js | Xác thực, scope, consent và lưu trữ |
| B | M | lib/store.js | Xác thực, scope, consent và lưu trữ |
| B | A | proxy.js | Xác thực, scope, consent và lưu trữ |
| B | M | public/sw.js | Xác thực, scope, consent và lưu trữ |
| B | A | reports/A.md | Xác thực, scope, consent và lưu trữ |
| B | A | reports/B.md | Xác thực, scope, consent và lưu trữ |
| B | A | scripts/provision-user.mjs | Xác thực, scope, consent và lưu trữ |
| B | A | tests/p0-b.test.mjs | Xác thực, scope, consent và lưu trữ |
| C | M | app/globals.css | Đọc, focus, reflow và tương phản |
| C | M | app/search/page.jsx | Đọc, focus, reflow và tương phản |
| C | M | components/AccessibilityToolbar.jsx | Đọc, focus, reflow và tương phản |
| C | M | lib/useSpeechRecognition.js | Đọc, focus, reflow và tương phản |
| C | A | reports/C.md | Đọc, focus, reflow và tương phản |
| C | A | tests/accessibility.test.mjs | Đọc, focus, reflow và tương phản |
| D | M | app/explore/page.jsx | Khám phá, gallery và tìm kiếm |
| D | M | app/guide/schedule/page.jsx | Khám phá, gallery và tìm kiếm |
| D | M | app/item/ItemView.jsx | Khám phá, gallery và tìm kiếm |
| D | M | app/item/page.jsx | Khám phá, gallery và tìm kiếm |
| D | M | app/page.jsx | Khám phá, gallery và tìm kiếm |
| D | M | app/search/page.jsx | Khám phá, gallery và tìm kiếm |
| D | A | components/DestinationGallery.jsx | Khám phá, gallery và tìm kiếm |
| D | A | lib/search.js | Khám phá, gallery và tìm kiếm |
| D | A | reports/D.md | Khám phá, gallery và tìm kiếm |
| D | A | tests/discovery.test.mjs | Khám phá, gallery và tìm kiếm |
| E | A | app/articles/[slug]/page.jsx | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | A | app/articles/page.jsx | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | M | app/booking/page.jsx | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | M | app/destination/DestinationView.jsx | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | M | app/explore/page.jsx | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | M | app/page.jsx | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | A | app/services/guide-dogs/page.jsx | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | A | components/DestinationActions.jsx | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | A | data/articles.js | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | M | data/destinations.js | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | A | reports/E.md | Cẩm nang và thông tin điểm đến/dịch vụ |
| E | A | tests/content.test.mjs | Cẩm nang và thông tin điểm đến/dịch vụ |
| F | M | app/admin/layout.jsx | Metadata, URL, sitemap và noindex |
| F | A | app/app/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/articles/[slug]/page.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/articles/page.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/assistant/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/booking/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/business/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/destination/page.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/explore/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/guide/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/help/page.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/item/page.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/my-booking/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/my-trip/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/navigation/layout.jsx | Metadata, URL, sitemap và noindex |
| F | A | app/not-found.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/notifications/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/page.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/privacy/page.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/profile/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/review/layout.jsx | Metadata, URL, sitemap và noindex |
| F | A | app/robots.js | Metadata, URL, sitemap và noindex |
| F | M | app/search/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/services/guide-dogs/page.jsx | Metadata, URL, sitemap và noindex |
| F | A | app/sitemap.js | Metadata, URL, sitemap và noindex |
| F | M | app/sitemap/page.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/sos/layout.jsx | Metadata, URL, sitemap và noindex |
| F | A | app/staff/layout.jsx | Metadata, URL, sitemap và noindex |
| F | M | app/terms/page.jsx | Metadata, URL, sitemap và noindex |
| F | A | lib/seo.js | Metadata, URL, sitemap và noindex |
| F | A | reports/F.md | Metadata, URL, sitemap và noindex |
| F | A | tests/seo.test.mjs | Metadata, URL, sitemap và noindex |
| G | A | .env.example | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | .gitignore | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | HUONG_DAN_REVIEW.md | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | README.md | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/admin/businesses/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | app/admin/inquiries/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/admin/moderation/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/admin/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | app/api/inquiries/route.js | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/booking/layout.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/booking/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/business/bookings/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/business/layout.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/business/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/business/profile/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/business/requests/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/business/reviews/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/business/services/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/explore/layout.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/guide/bookings/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/guide/login/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/guide/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/guide/profile/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/guide/register/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/item/ItemView.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/my-trip/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/navigation/layout.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/notifications/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | app/partners/[kind]/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/privacy/page.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/search/layout.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | app/sitemap.js | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | components/AdminNav.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | components/BusinessNav.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | components/BusinessShell.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | components/Footer.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | components/GuideNav.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | components/InterestForm.jsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | lib/inquiryValidation.js | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | lib/store.js | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | lib/validate.js | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/G.md | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/REQUIREMENTS.md | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/TEST_RESULTS.md | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/WayEcho_Requirement_Tracker.xlsx | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/b-build.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/b-lint.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/b-test.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/build-final.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/c-build.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/c-lint.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/c-test.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/d-build.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/d-lint.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/d-test.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/e-build.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/e-lint.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/e-test.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/f-build.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/f-lint.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/f-test.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/http-final.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/lint-final.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/evidence/tests-final.log | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | reports/requirements.json | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | scripts/http-smoke.mjs | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | scripts/provision-user.mjs | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | A | tests/inquiries.test.mjs | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | tests/p0-b.test.mjs | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
| G | M | tests/validate.test.mjs | Luồng đối tác, lỗi API, bảo toàn và bằng chứng |
