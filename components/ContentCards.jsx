import Link from "next/link";
import VerifiedImage from "./VerifiedImage";
import { getArticle } from "@/data/articles";
import { getDestination } from "@/data/destinations";
export function ArticleCard({ article: a }) {
  return (
    <article className="editorial-card">
      <Link
        className="card-image"
        href={`/articles/${a.slug}`}
        aria-label={`Đọc: ${a.title}`}
      >
        <VerifiedImage src={a.image} alt={a.alt} />
      </Link>
      <div className="card-copy">
        <p className="eyebrow">{a.category}</p>
        <h3>
          <Link href={`/articles/${a.slug}`}>{a.title}</Link>
        </h3>
        <p>{a.excerpt}</p>
        <Link className="text-link" href={`/articles/${a.slug}`}>
          Đọc bài viết <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
export function PlaceCard({ destination: d }) {
  return (
    <article className="editorial-card">
      <Link
        className="card-image"
        href={`/destination/${d.slug}`}
        aria-label={`Khám phá ${d.name}`}
      >
        <VerifiedImage src={d.image} fallback={d.imageFallback} alt={d.alt} />
      </Link>
      <div className="card-copy">
        <p className="eyebrow">{d.area}</p>
        <h3>
          <Link href={`/destination/${d.slug}`}>{d.name}</Link>
        </h3>
        <p>{d.summary}</p>
        <span className="status-label">Tiếp cận: {d.access.level}</span>
        <div>
          <Link className="text-link" href={`/destination/${d.slug}`}>
            Khám phá điểm đến <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
export function RelatedReading({
  slugs,
  title = "Đọc tiếp cho hành trình của bạn",
}) {
  const items = slugs.map(getArticle).filter(Boolean);
  return items.length ? (
    <section className="journey-section" aria-label={title}>
      <div className="section-top">
        <div>
          <p className="eyebrow">Cẩm nang WayEcho</p>
          <h2>{title}</h2>
        </div>
        <Link className="text-link" href="/articles">
          Tất cả bài viết ↗
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  ) : null;
}
export function RelatedPlaces({ slugs }) {
  return (
    <section className="journey-section" aria-label="Điểm đến liên quan">
      <div className="section-top">
        <div>
          <p className="eyebrow">Tiếp tục khám phá</p>
          <h2>Thêm một điểm đến, thêm một câu chuyện</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {slugs
          .map(getDestination)
          .filter(Boolean)
          .map((d) => (
            <PlaceCard key={d.slug} destination={d} />
          ))}
      </div>
    </section>
  );
}
