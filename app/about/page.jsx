import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RelatedReading } from "@/components/ContentCards";
import { mediaCredits } from "@/data/media";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Về WayEcho — Những hành trình rộng mở",
  "Tìm hiểu prototype WayEcho, cách phân biệt dữ liệu đã công bố và thông tin cần xác minh, cùng mục tiêu du lịch tiếp cận cho người khiếm thị.",
  "/about",
);
export default function AboutPage() {
  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Về WayEcho" }]} />
      <header className="page-intro">
        <p className="eyebrow">Hear your way</p>
        <h1>Thông tin rõ ràng. Hành trình do bạn lựa chọn.</h1>
        <p>
          WayEcho là prototype nền tảng du lịch tiếp cận dành cho người mù và
          người nhìn kém, với dữ liệu điểm đến ban đầu tại Hà Nội.
        </p>
      </header>
      <div className="journey-about">
        <blockquote>
          Khả năng tiếp cận bắt đầu từ việc biết mình có thể hỏi gì, tìm ở đâu
          và lựa chọn thế nào.
        </blockquote>
        <div>
          <h2 className="text-2xl">Vì sao WayEcho được xây dựng?</h2>
          <p>
            Một địa chỉ và một tấm ảnh đẹp chưa đủ để lên kế hoạch phù hợp.
            Người đi du lịch còn cần biết điều kiện lối đi, cách tiếp cận nội
            dung và hỗ trợ nào có thể được xác nhận trước.
          </p>
          <p>
            WayEcho tổ chức thông tin điểm đến, cẩm nang và các công cụ giọng
            nói để bạn chuẩn bị chuyến đi theo nhu cầu của mình.
          </p>
        </div>
      </div>
      <section className="journey-section article-body">
        <h2>Cách chúng mình xây dựng niềm tin</h2>
        <p>
          Thông tin địa danh có nguồn được trình bày riêng với các tiêu chí tiếp
          cận. Những mục chưa đủ bằng chứng ghi rõ ‘cần khảo sát’, ‘cần xác
          minh’ hoặc ‘chưa công bố’. Website không mặc định một nơi phù hợp với
          mọi người.
        </p>
        <p>
          Hồ sơ nhu cầu và yêu cầu hỗ trợ cho từng lần đặt được tách riêng. Bạn
          lựa chọn những gì muốn chia sẻ trong luồng demo.
        </p>
        <h2>Những gì đang có và giới hạn hiện tại</h2>
        <p>
          Bạn có thể khám phá điểm đến, nghe nội dung bằng giọng đọc thiết bị,
          tìm kiếm, lưu điểm và thử các luồng đặt chỗ. Dữ liệu doanh nghiệp, đặt
          dịch vụ, thanh toán, bản đồ dẫn đường, trợ lý camera và SOS vẫn là mô
          phỏng.
        </p>
        <p>
          WayEcho chưa xác nhận nhà cung cấp chó dẫn đường hoặc đối tác quảng
          cáo thật. Chưa có số liệu người dùng, thành tích hay chứng nhận WCAG
          được công bố.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link
            className="btn-primary !text-[#222a28] !no-underline"
            href="/explore"
          >
            Bắt đầu khám phá
          </Link>
          <Link className="text-link" href="/help">
            Xem giới hạn và trợ giúp
          </Link>
        </div>
      </section>
      <section id="image-credits" className="pb-10">
        <h2 className="journey-title mb-5">Nguồn và giấy phép hình ảnh</h2>
        <p className="text-ink-soft mb-5 max-w-3xl">
          Ảnh mới được lấy từ Wikimedia Commons, đổi kích thước và chuyển sang
          WebP. Ảnh có thể được cắt khi hiển thị. Việc sử dụng không hàm ý tác
          giả hoặc tổ chức trong ảnh bảo trợ WayEcho.
        </p>
        <ul className="grid gap-4 md:grid-cols-2">
          {mediaCredits.map((m) => (
            <li key={m.file} className="notice">
              <a
                href={m.source}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                {m.file}
              </a>
              <p>
                {m.artist} ·{" "}
                <a
                  className="underline"
                  href={m.licenseUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {m.license}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </section>
      <RelatedReading
        slugs={["kham-pha-ha-noi-bang-am-thanh", "chuan-bi-chuyen-di"]}
      />
    </div>
  );
}
