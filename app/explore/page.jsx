import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceTiles from "@/components/ServiceTiles";
import ExploreResults from "@/components/ExploreResults";
import ContextAd from "@/components/ContextAd";
import { RelatedReading } from "@/components/ContentCards";
import { CATEGORIES } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";
export async function generateMetadata({ searchParams }) {
  const { cat, q } = await searchParams;
  const c = CATEGORIES.find((c) => c.id === cat);
  const title = c
    ? `${c.label} tại Hà Nội – Thông tin du lịch tiếp cận`
    : "Khám phá Hà Nội và dịch vụ hỗ trợ tiếp cận";
  return {
    ...pageMetadata(
      title,
      c
        ? `Khám phá danh mục ${c.label.toLowerCase()} tại Hà Nội. Xem thông tin, trạng thái xác minh và các lưu ý chuẩn bị cho người khiếm thị.`
        : "Tìm điểm đến, lưu trú, di chuyển, ăn uống, chó dẫn đường, công cụ hỗ trợ và cẩm nang du lịch cho người khiếm thị cùng WayEcho.",
      c ? `/explore?cat=${c.id}` : "/explore",
    ),
    ...(q ? { robots: { index: false, follow: true } } : {}),
  };
}
export default async function ExplorePage({ searchParams }) {
  const params = await searchParams;
  const cat = CATEGORIES.some((c) => c.id === params.cat)
    ? params.cat
    : "destination";
  return (
    <div className="container-page">
      <Breadcrumbs items={[{ label: "Khám phá" }]} />
      <header className="page-intro">
        <p className="eyebrow">Chọn cách bạn muốn khám phá</p>
        <h1>Hà Nội, theo nhịp của bạn</h1>
        <p>
          Từ điểm đến đến những điều cần chuẩn bị. Chọn một danh mục để tìm
          thông tin, kiểm tra trạng thái tiếp cận và lên kế hoạch phù hợp.
        </p>
      </header>
      <ServiceTiles />
      <div className="journey-section">
        <ExploreResults
          category={cat}
          initialQuery={typeof params.q === "string" ? params.q : ""}
          key={`${cat}-${params.q || ""}`}
        />
      </div>
      <ContextAd context={cat} />
      <RelatedReading
        slugs={["chuan-bi-chuyen-di", "hoi-ve-kha-nang-tiep-can"]}
      />
    </div>
  );
}
