import Link from "next/link";
import VerifiedImage from "@/components/VerifiedImage";
import { PlaceCard, ArticleCard } from "@/components/ContentCards";
import ServiceTiles from "@/components/ServiceTiles";
import Reveal from "@/components/Reveal";
import { destinations } from "@/data/destinations";
import { articles } from "@/data/articles";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Du lịch Hà Nội cho người khiếm thị",
  "Khám phá Hà Nội theo cách của bạn: thông tin điểm đến, dữ liệu tiếp cận, công cụ giọng nói và cẩm nang chuẩn bị chuyến đi cùng WayEcho.",
  "/",
  "/assets/images/hoan-kiem-verified.webp",
);
const gallery = [
  { d: destinations[0], title: "Một khoảng bình yên bên hồ" },
  { d: destinations[6], title: "Chạm vào những lớp lịch sử" },
  { d: destinations[2], title: "Nhịp sống trên những con phố" },
  { d: destinations[4], title: "Một góc Trấn Quốc" },
  { d: destinations[3], title: "Dành thời gian cho Hồ Tây" },
];
export default function HomePage() {
  return (
    <>
      <section
        className="container-page journey-hero"
        aria-labelledby="home-title"
      >
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Hà Nội · Những hành trình mở</p>
            <h1 id="home-title">
              Khám phá thế giới <em>theo cách của bạn.</em>
            </h1>
            <p>
              Từ một câu chuyện bên hồ đến nhịp sống trong phố nhỏ. WayEcho giúp
              bạn tìm thông tin và chuẩn bị trải nghiệm du lịch phù hợp với nhu
              cầu của mình.
            </p>
            <div className="hero-actions">
              <Link href="/explore" className="btn-primary">
                Bắt đầu khám phá <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/about" className="btn-ghost">
                Tìm hiểu WayEcho
              </Link>
            </div>
            <form action="/explore" role="search" className="hero-search">
              <label className="sr-only" htmlFor="home-q">
                Tìm điểm đến Hà Nội
              </label>
              <input
                id="home-q"
                name="q"
                placeholder="Bạn muốn khám phá nơi nào?"
              />
              <button className="btn-primary" type="submit">
                Tìm điểm đến
              </button>
            </form>
            <p className="!text-sm mt-4">
              Thông tin tiếp cận có trạng thái xác minh rõ ràng. Dịch vụ đặt chỗ
              hiện là bản demo.
            </p>
          </div>
          <figure className="hero-photo">
            <VerifiedImage
              src={destinations[0].image}
              alt={destinations[0].alt}
              priority
            />
            <figcaption className="hero-caption">
              <strong>Hồ Hoàn Kiếm, Hà Nội</strong>
              <span>Mỗi hành trình bắt đầu từ một điều muốn khám phá.</span>
              <Link href="/destination/ho-guom" className="text-link !text-sm">
                Tìm hiểu điểm đến ↗
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>
      <section
        className="container-page journey-section"
        aria-labelledby="home-places"
      >
        <div className="section-top">
          <div>
            <p className="eyebrow">Bắt đầu từ Hà Nội</p>
            <h2 id="home-places">Những nơi chốn, những câu chuyện</h2>
            <p>
              Tìm cảm hứng cho chuyến đi và xem điều gì đã được công bố, điều gì
              cần xác nhận thêm.
            </p>
          </div>
          <Link className="text-link" href="/explore?cat=destination">
            Xem tất cả điểm đến ↗
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[destinations[0], destinations[1], destinations[6]].map((d) => (
            <PlaceCard key={d.slug} destination={d} />
          ))}
        </div>
      </section>
      <section className="bg-surface-alt" aria-labelledby="home-support">
        <div className="container-page journey-section">
          <div className="section-top">
            <div>
              <p className="eyebrow">Có thêm thông tin, chủ động hơn</p>
              <h2 id="home-support">Chuẩn bị hành trình phù hợp với bạn</h2>
              <p>
                Chọn điều bạn muốn tìm hiểu: hỗ trợ từ người đồng hành, chó dẫn
                đường hay công cụ giúp tiếp cận thông tin.
              </p>
            </div>
            <Link className="text-link" href="/explore">
              Khám phá các danh mục ↗
            </Link>
          </div>
          <ServiceTiles compact />
        </div>
      </section>
      <section
        className="container-page journey-section"
        aria-labelledby="home-reading"
      >
        <div className="section-top">
          <div>
            <p className="eyebrow">Cẩm nang & góc nhìn</p>
            <h2 id="home-reading">Đi xa hơn, từ những điều nhỏ</h2>
          </div>
          <Link className="text-link" href="/articles">
            Đọc cẩm nang WayEcho ↗
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[articles[2], articles[0], articles[1]].map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
      <section
        className="container-page journey-section !pt-0"
        aria-labelledby="home-gallery"
      >
        <div className="section-top">
          <div>
            <p className="eyebrow">Một thành phố, nhiều cách cảm nhận</p>
            <h2 id="home-gallery">Một thế giới đang chờ bạn khám phá</h2>
            <p>
              Mỗi khung hình mở ra thông tin về một điểm đến. Chọn một nơi để
              tìm hiểu tiếp.
            </p>
          </div>
        </div>
        <div className="mosaic">
          {gallery.map(({ d, title }) => (
            <Link
              href={`/destination/${d.slug}`}
              key={d.slug}
              aria-label={`${title} — ${d.name}`}
            >
              <VerifiedImage src={d.image} alt={d.alt} />
              <span>
                {title}
                <br />
                <small>{d.name}</small>
              </span>
            </Link>
          ))}
        </div>
        <Link className="text-link mt-3 !text-sm" href="/about#image-credits">
          Nguồn và giấy phép hình ảnh
        </Link>
      </section>
      <Reveal className="container-page pb-12">
        <section className="journey-about" aria-labelledby="home-about">
          <div>
            <p className="eyebrow">Về WayEcho</p>
            <h2 id="home-about" className="journey-title">
              Mỗi người đều có cách khám phá của riêng mình.
            </h2>
            <p>
              WayEcho là prototype du lịch tiếp cận dành cho người mù và người
              nhìn kém, bắt đầu với Hà Nội. Chúng mình mong muốn giúp người đi
              du lịch có thông tin rõ ràng và quyền lựa chọn trong từng bước
              chuẩn bị.
            </p>
            <Link className="text-link mt-4" href="/about">
              Câu chuyện và cách WayEcho hoạt động ↗
            </Link>
          </div>
          <div>
            <blockquote>
              “Một điểm đến đẹp còn nằm ở những điều ta có thể cảm nhận và khám
              phá.”
            </blockquote>
            <p className="text-ink-soft">
              Chưa xác minh thì nói rõ. Có nhu cầu riêng thì có chỗ để trao đổi.
              Mọi hỗ trợ đều bắt đầu từ lựa chọn của bạn.
            </p>
          </div>
        </section>
      </Reveal>
    </>
  );
}
