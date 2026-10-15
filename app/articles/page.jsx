import { articles } from "@/data/articles";
import { ArticleCard } from "@/components/ContentCards";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Cẩm nang du lịch dễ tiếp cận",
  "Chuẩn bị chuyến đi Hà Nội, tìm hiểu thông tin tiếp cận và khám phá những cách cảm nhận điểm đến cùng cẩm nang WayEcho.",
  "/articles",
);
export default function ArticlesPage() {
  const categories = [...new Set(articles.map((a) => a.category))];
  return (
    <div className="container-page pb-12">
      <Breadcrumbs items={[{ label: "Cẩm nang" }]} />
      <header className="page-intro">
        <p className="eyebrow">Cẩm nang WayEcho</p>
        <h1>Những điều nhỏ cho một hành trình rộng mở</h1>
        <p>
          Gợi ý chuẩn bị, câu hỏi cần xác nhận và những góc nhìn để bạn khám phá
          theo cách của mình.
        </p>
      </header>
      <p className="notice mb-8">
        Nội dung mẫu do WayEcho biên soạn cho prototype, không phải bài báo, lời
        chứng thực hay hướng dẫn đã được khảo sát thực địa.
      </p>
      <nav aria-label="Chủ đề cẩm nang" className="flex flex-wrap gap-2 mb-7">
        {categories.map((c, i) => (
          <a className="chip min-h-11 underline" key={c} href={`#article-${i}`}>
            {c}
          </a>
        ))}
      </nav>
      <div className="grid gap-7 md:grid-cols-2">
        {articles.map((a, i) => (
          <div id={`article-${i}`} key={a.slug}>
            <ArticleCard article={a} />
          </div>
        ))}
      </div>
    </div>
  );
}
