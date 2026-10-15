import Link from "next/link";
import { notFound } from "next/navigation";
import { topics, getTopic } from "@/data/topics";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReadButton from "@/components/ReadButton";
import VerifiedImage from "@/components/VerifiedImage";
import ImageCredit from "@/components/ImageCredit";
import { RelatedReading } from "@/components/ContentCards";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return topics.map(({ slug }) => ({ topic: slug }));
}
export async function generateMetadata({ params }) {
  const t = getTopic((await params).topic);
  return t ? pageMetadata(t.title, t.short, `/explore/${t.slug}`, t.image) : {};
}
export default async function TopicPage({ params }) {
  const t = getTopic((await params).topic);
  if (!t) notFound();
  return (
    <div className="container-page">
      <Breadcrumbs
        items={[{ label: "Khám phá", href: "/explore" }, { label: t.title }]}
      />
      <header className="page-intro">
        <p className="eyebrow">Hướng dẫn & kiến thức</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </header>
      {t.image && (
        <figure className="max-w-xl">
          <VerifiedImage
            src={t.image}
            alt={t.alt}
            className="w-full rounded-3xl max-h-96 object-contain bg-surface-alt"
            priority
          />
          <ImageCredit src={t.image} />
        </figure>
      )}
      <ReadButton
        text={[
          t.title,
          t.intro,
          ...t.sections.flatMap((s) => [s.title, ...s.paragraphs]),
        ].join(". ")}
      />
      <div className="reading-layout">
        <div className="article-body">
          {t.sections.map((s) => (
            <section id={s.id} key={s.id}>
              <h2>{s.title}</h2>
              {s.paragraphs.map((v) => (
                <p key={v}>{v}</p>
              ))}
            </section>
          ))}
          {t.sources && (
            <section id="sources">
              <h2>Nguồn tham khảo</h2>
              <ul>
                {t.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p>
                Tham khảo kiến thức quốc tế, không phải xác nhận chính sách tiếp
                cận tại Việt Nam.
              </p>
            </section>
          )}
          <Link
            href={t.action.href}
            className="btn-primary !no-underline !text-[#222a28]"
          >
            {t.action.label}
          </Link>
        </div>
        <nav className="contents" aria-label="Trong hướng dẫn này">
          <h2 className="font-bold">Trong hướng dẫn này</h2>
          {t.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>
      </div>
      <RelatedReading slugs={t.related} />
    </div>
  );
}
