import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations, getDestination } from "@/data/destinations";
import { visitGuide } from "@/data/visit-guides";
import Breadcrumbs from "@/components/Breadcrumbs";
import VerifiedImage from "@/components/VerifiedImage";
import ImageCredit from "@/components/ImageCredit";
import ReadButton from "@/components/ReadButton";
import CatalogCard from "@/components/CatalogCard";
import { catalog } from "@/data/catalog";
import { RelatedReading, RelatedPlaces } from "@/components/ContentCards";
import ContextAd from "@/components/ContextAd";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return destinations.map(({ slug }) => ({ slug }));
}
const displayName = (d) => (d.slug === "ho-guom" ? "Hồ Hoàn Kiếm" : d.name);
export async function generateMetadata({ params }) {
  const d = getDestination((await params).slug);
  return d
    ? pageMetadata(
        `${displayName(d)} – Thông tin tiếp cận cho người khiếm thị`,
        `Khám phá ${displayName(d)}, tìm hiểu thông tin điểm đến, khả năng tiếp cận, di chuyển và những lưu ý hữu ích khi tham quan cùng WayEcho.`,
        `/destination/${d.slug}`,
        d.image,
      )
    : {};
}
export default async function DestinationPage({ params }) {
  const d = getDestination((await params).slug);
  if (!d) notFound();
  const guide = visitGuide(d);
  const related = [
    ...destinations.filter(
      (x) =>
        ["ho-guom", "van-mieu", "hoang-thanh-thang-long"].includes(x.slug) &&
        x.slug !== d.slug,
    ),
    ...destinations.filter(
      (x) =>
        !["ho-guom", "van-mieu", "hoang-thanh-thang-long", d.slug].includes(
          x.slug,
        ),
    ),
  ].slice(0, 3);
  const rows = [
    ["Trạng thái dữ liệu", d.access.status],
    ["Người mù", d.access.blind],
    ["Người nhìn kém", d.access.lowVision],
    ["Nhân viên / quầy hỗ trợ", d.access.staff],
    ["Audio / thuyết minh", d.access.audio],
    ["Chữ Braille", d.access.braille],
    ["Thang máy", d.access.elevator],
    ["Lối không bậc", d.access.stepFree],
  ];
  const services = catalog.filter(
    (x) => x.isDemo && ["activity", "transport"].includes(x.cat),
  );
  return (
    <div className="container-page">
      <Breadcrumbs
        items={[
          { label: "Khám phá", href: "/explore" },
          { label: displayName(d) },
        ]}
      />
      <header className="detail-hero">
        <figure>
          <VerifiedImage
            src={d.image}
            fallback={d.imageFallback}
            alt={d.alt}
            priority
          />
          <ImageCredit src={d.image} />
        </figure>
        <div>
          <p className="eyebrow">{d.area}</p>
          <h1>{displayName(d)} – Thông tin tiếp cận cho người khiếm thị</h1>
          <p>{d.summary}</p>
          <p className="mt-3">{d.address}</p>
          <span className="status-label">Tiếp cận: {d.access.level}</span>
          <ReadButton
            text={[d.audio, guide.intro, guide.transport, ...guide.tips].join(
              ". ",
            )}
            label="Nghe giới thiệu và lưu ý"
          />
          <p className="!text-sm">
            Giọng đọc của thiết bị; không phải thuyết minh chính thức tại điểm
            đến.
          </p>
        </div>
      </header>
      <nav aria-label="Nội dung điểm đến" className="flex flex-wrap gap-2 my-8">
        {[
          ["intro", "Giới thiệu"],
          ["access", "Thông tin tiếp cận"],
          ["transport", "Di chuyển"],
          ["support", "Hỗ trợ"],
          ["tips", "Trước chuyến đi"],
        ].map(([id, label]) => (
          <a href={`#${id}`} className="chip min-h-11 underline" key={id}>
            {label}
          </a>
        ))}
      </nav>
      <div className="reading-layout">
        <div className="article-body">
          <section id="intro">
            <h2>Giới thiệu {displayName(d)}</h2>
            <p>{guide.intro}</p>
            {d.facts.length > 0 && (
              <ul>
                {d.facts.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </section>
          <section id="access">
            <h2>Thông tin tiếp cận</h2>
            <p>
              ‘Chưa công bố’ có nghĩa là chưa có đủ thông tin để xác nhận, không
              có nghĩa là tiện ích không tồn tại. Những gợi ý chuẩn bị dưới đây
              không thay thế khảo sát thực địa.
            </p>
            <dl>
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid sm:grid-cols-[180px_1fr] gap-2 py-3 border-b border-line"
                >
                  <dt className="font-semibold">{label}</dt>
                  <dd className="text-ink-soft">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="notice mt-5">{d.access.note}</p>
            <Link href="/articles/hoi-ve-kha-nang-tiep-can">
              Xem những câu hỏi cần xác nhận với điểm đến
            </Link>
          </section>
          <section id="transport">
            <h2>Di chuyển và phương tiện</h2>
            <p>{guide.transport}</p>
            <Link href={`/navigation?to=${d.slug}`}>
              Mở bản đồ demo của {displayName(d)}
            </Link>
          </section>
          <section id="support">
            <h2>Hỗ trợ cho hành trình</h2>
            <p>
              Trao đổi nhu cầu cụ thể với đơn vị tiếp đón và chờ xác nhận. Các
              luồng đặt dịch vụ trên WayEcho hiện là demo, chưa tạo ra hỗ trợ
              thực tế.
            </p>
            <ul>
              <li>
                <Link href="/explore/support">
                  Chuẩn bị yêu cầu hỗ trợ tại điểm đến
                </Link>
              </li>
              <li>
                <Link href="/explore/guide-dogs">
                  Tìm hiểu việc di chuyển cùng chó dẫn đường
                </Link>
              </li>
              <li>
                <Link href="/explore/assistive-technology">
                  Công cụ đọc và tìm thông tin bằng giọng nói
                </Link>
              </li>
            </ul>
          </section>
          <section id="tips">
            <h2>Những điều nên chuẩn bị</h2>
            <ul>
              {guide.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Link href="/articles/chuan-bi-chuyen-di">
              Đọc cẩm nang chuẩn bị chuyến đi Hà Nội
            </Link>
          </section>
        </div>
        <aside className="contents" aria-label="Thông tin tham quan và nguồn">
          <h2 className="text-lg font-bold">Thông tin tham quan</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="font-bold">Giờ tham quan</dt>
              <dd>{d.visit.hours}</dd>
            </div>
            <div>
              <dt className="font-bold">Giá / vé</dt>
              <dd>{d.visit.price}</dd>
            </div>
            <div>
              <dt className="font-bold">Ngày đối chiếu trong dữ liệu</dt>
              <dd>{d.checkedAt}</dd>
            </div>
          </dl>
          <p className="text-sm mt-4 text-ink-soft">
            Giờ và giá có thể thay đổi. Cần kiểm tra lại trên nguồn chính thức
            trước khi đi.
          </p>
          {d.sources.map((s) => (
            <a
              href={s.url}
              key={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm"
            >
              {s.label} ↗
            </a>
          ))}
        </aside>
      </div>
      <ContextAd context="hanoi" />
      <section className="journey-section">
        <div className="section-top">
          <div>
            <p className="eyebrow">Thử các công cụ chuẩn bị</p>
            <h2>Dịch vụ minh họa liên quan</h2>
            <p>
              Những mục bên dưới là dữ liệu demo, chưa có nhà cung cấp thực tế.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((item) => (
            <CatalogCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      <RelatedPlaces slugs={related.map((x) => x.slug)} />
      <RelatedReading
        slugs={["hoi-ve-kha-nang-tiep-can", "chuan-bi-chuyen-di"]}
      />
    </div>
  );
}
