import { notFound } from "next/navigation";
import Link from "next/link";
import { getDestination, destinations } from "@/data/destinations";
import { getArticle } from "@/data/articles";
import { pageMetadata, siteOrigin, jsonLd } from "@/lib/seo";
import VerifiedImage from "@/components/VerifiedImage";
import DestinationActions from "@/components/DestinationActions";
import ReportIssue from "@/components/ReportIssue";
import {
  SpeakerIcon,
  MapPinIcon,
  AccessibleIcon,
  CompassIcon,
  CalendarIcon,
  PhoneIcon,
  CheckIcon,
} from "@/components/Icons";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return { title: "Không tìm thấy điểm đến", robots: { index: false, follow: false } };

  return pageMetadata(
    `${d.name} — Du lịch tiếp cận Phố Cổ Hà Nội`,
    `${d.summary} Thông tin tiếp cận: ${d.access.level}. Đối chiếu nguồn công khai tại Phố Cổ Hoàn Kiếm.`,
    `/diem-den/${d.slug}`,
    { image: d.image }
  );
}

function AccessRow({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 hc-border sm:grid-cols-[220px_1fr] sm:gap-5">
      <dt className="font-semibold text-ink">{label}</dt>
      <dd className="hc-muted text-ink-soft">{value}</dd>
    </div>
  );
}

export default async function DiemDenPage({ params }) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();

  const accessRows = [
    ["Phù hợp người mù", d.access.blind],
    ["Phù hợp người nhìn kém", d.access.lowVision],
    ["Nhân viên / quầy hỗ trợ", d.access.staff],
    ["Audio / thuyết minh âm thanh", d.access.audio],
    ["Chữ nổi Braille", d.access.braille],
    ["Thang máy", d.access.elevator],
    ["Lối vào / bậc tam cấp", d.access.entrance],
    ["Lối đi không bậc", d.access.stepFree],
    ["Phương tiện công cộng", d.access.transit],
    ["Trạng thái tổng quan", d.access.status],
  ];

  const relatedArticles = (d.articles || [])
    .map((s) => getArticle(s))
    .filter(Boolean);

  return (
    <article className="container-page py-10">
      {siteOrigin() && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "TouristAttraction",
              name: d.name,
              description: d.summary,
              address: {
                "@type": "PostalAddress",
                streetAddress: d.address || d.street_name,
                addressLocality: "Hoàn Kiếm",
                addressRegion: "Hà Nội",
                addressCountry: "VN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: d.coordinates.lat,
                longitude: d.coordinates.lng,
              },
              image: d.images.map((img) => img.src),
            }),
          }}
        />
      )}

      <nav aria-label="Đường dẫn trang" className="text-sm font-semibold text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> ·{" "}
        <Link href="/explore" className="hover:underline">Khám phá</Link> ·{" "}
        <Link href="/destination" className="hover:underline">Điểm đến Phố Cổ</Link> ·{" "}
        <span className="text-ink">{d.name}</span>
      </nav>

      <header className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="chip hc-surface hc-border">
            <AccessibleIcon size={16} /> Phố Cổ Hoàn Kiếm, Hà Nội
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold">{d.name}</h1>
          <p className="hc-muted mt-2 flex items-center gap-2 text-lg text-ink-soft">
            <MapPinIcon size={20} className="text-[#b8461a]" /> {d.address || d.area}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/navigation?to=${encodeURIComponent(d.slug)}`}
            className="btn-primary min-h-[48px] px-5 font-bold"
          >
            <CompassIcon size={20} /> Chỉ đường demo
          </Link>
          <Link
            href={`/booking?item=demo-guide-tour`}
            className="btn-ghost hc-border min-h-[48px] px-5 font-bold"
          >
            <CalendarIcon size={20} /> Đặt Guide đồng hành
          </Link>
        </div>
      </header>

      {/* Bộ sưu tập ảnh thật có giấy phép (A-09: >= 3 ảnh) */}
      <section className="mt-8" aria-label={`Hình ảnh thực tế về ${d.name}`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {d.images.map((img, idx) => (
            <figure key={idx} className="overflow-hidden rounded-2xl border border-line bg-white shadow-card hc-border">
              <VerifiedImage
                src={img.src}
                fallback={d.imageFallback}
                alt={img.alt}
                className="h-56 w-full object-cover"
              />
              <figcaption className="p-3 text-xs text-ink-soft hc-muted border-t border-line">
                <p className="font-semibold text-ink">{img.credit}</p>
                <p className="mt-0.5">Giấy phép: {img.license} · <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">Nguồn kiểm chứng</a></p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Tóm tắt & Trợ năng */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
        <div>
          <section aria-labelledby="desc-heading">
            <h2 id="desc-heading" className="text-3xl font-bold">Mô tả cảnh quan & Lịch sử</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink hc-surface">{d.desc}</p>
          </section>

          <section aria-labelledby="access-heading" className="mt-8">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
              <h2 id="access-heading" className="text-3xl font-bold">Dữ liệu tiếp cận chi tiết</h2>
              <span className="chip hc-surface hc-border font-bold bg-amber-100 text-amber-950">
                {d.access.level}
              </span>
            </div>
            <dl className="mt-4">
              {accessRows.map(([label, val]) => (
                <AccessRow key={label} label={label} value={val} />
              ))}
            </dl>
          </section>

          {/* Nguồn thông tin và ngày đối chiếu */}
          <section className="mt-8 rounded-2xl border border-line bg-surface-alt p-5 hc-surface hc-border" aria-labelledby="source-heading">
            <h3 id="source-heading" className="text-xl font-bold">Nguồn đối chiếu & Ngày cập nhật</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft hc-muted">
              {d.sources.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckIcon size={18} className="text-green-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>{s.title}</strong>: {s.detail} (Ngày kiểm tra: {s.date})
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-6">
            <ReportIssue itemName={d.name} itemSlug={d.slug} />
          </div>
        </div>

        {/* Cột hành động & bài viết liên quan */}
        <aside className="space-y-6">
          <div className="rounded-[22px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
            <h3 className="text-xl font-bold">Lưu hoặc thêm vào chuyến đi</h3>
            <p className="hc-muted mt-1 text-sm text-ink-soft">Lưu địa điểm để nghe lại thông tin và lập kế hoạch đi lại.</p>
            <div className="mt-4">
              <DestinationActions destination={d} />
            </div>
          </div>

          <div className="rounded-[22px] border border-primary/40 bg-[#fffaf2] p-6 shadow-card hc-surface hc-border">
            <h3 className="text-xl font-bold">Hỗ trợ khẩn cấp tại Phố Cổ</h3>
            <p className="hc-muted mt-1 text-sm text-ink-soft">
              Nếu gặp khó khăn trong quá trình tiếp cận điểm đến, hãy kết nối ngay với tư vấn viên từ xa hoặc trạm SOS.
            </p>
            <div className="mt-4 space-y-3">
              <a
                href="tel:19001000"
                className="btn-primary flex min-h-[52px] w-full items-center justify-center gap-2 font-bold"
              >
                <PhoneIcon size={20} /> 📞 Tư vấn viên Phố Cổ
              </a>
              <Link
                href="/sos"
                className="btn-ghost hc-border flex min-h-[52px] w-full items-center justify-center font-bold text-red-800"
              >
                Kích hoạt SOS khẩn cấp
              </Link>
            </div>
          </div>

          {relatedArticles.length > 0 && (
            <div className="rounded-[22px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
              <h3 className="text-xl font-bold">Cẩm nang Phố Cổ liên quan</h3>
              <ul className="mt-3 space-y-3">
                {relatedArticles.map((art) => (
                  <li key={art.slug}>
                    <Link href={`/articles/${art.slug}`} className="group block">
                      <p className="font-bold text-base group-hover:text-primary transition-colors">
                        {art.title}
                      </p>
                      <p className="text-xs text-ink-soft hc-muted mt-0.5 line-clamp-2">
                        {art.summary}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
