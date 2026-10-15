import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/data/articles";
import VerifiedImage from "@/components/VerifiedImage";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReadButton from "@/components/ReadButton";
import { RelatedReading, RelatedPlaces } from "@/components/ContentCards";
import ImageCredit from "@/components/ImageCredit";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return pageMetadata(a.title, a.excerpt, `/articles/${a.slug}`, a.image);
}
export default async function ArticlePage({ params }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  return (
    <div className="container-page">
      <Breadcrumbs
        items={[{ label: "Cẩm nang", href: "/articles" }, { label: a.title }]}
      />
      <header className="page-intro">
        <p className="eyebrow">{a.category}</p>
        <h1>{a.title}</h1>
        <p>{a.excerpt}</p>
        <p className="!text-sm mt-4">
          WayEcho biên soạn · Nội dung mẫu cho prototype
        </p>
      </header>
      <figure>
        <VerifiedImage
          src={a.image}
          alt={a.alt}
          className="article-cover"
          priority
        />
        <ImageCredit src={a.image} />
      </figure>
      <ReadButton
        text={[
          a.title,
          ...a.sections.flatMap((s) => [s.title, ...s.paragraphs]),
        ].join(". ")}
      />
      <div className="reading-layout">
        <article className="article-body">
          {a.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.title}</h2>
              {s.paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </section>
          ))}
          <div className="notice">
            <p>
              Tiếp tục chuẩn bị với{" "}
              <Link href={`/explore/${a.topic}`}>
                hướng dẫn hỗ trợ liên quan
              </Link>{" "}
              và{" "}
              <Link href={`/articles/${a.related[0]}`}>
                bài viết: {getArticle(a.related[0]).title}
              </Link>
              .
            </p>
          </div>
        </article>
        <aside className="contents" aria-label="Mục lục bài viết">
          <h2 className="font-bold">Trong bài viết này</h2>
          {a.sections.map((s) => (
            <a href={`#${s.id}`} key={s.id}>
              {s.title}
            </a>
          ))}
        </aside>
      </div>
      <RelatedReading slugs={a.related} />
      <RelatedPlaces slugs={a.destinations} />
    </div>
  );
}
