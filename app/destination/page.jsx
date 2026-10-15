import { notFound, permanentRedirect } from "next/navigation";
import { destinations, getDestination } from "@/data/destinations";
import { PlaceCard } from "@/components/ContentCards";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Điểm đến Hà Nội và thông tin tiếp cận",
  "Tìm hiểu Hồ Hoàn Kiếm, Văn Miếu, Hoàng thành Thăng Long và các địa danh Hà Nội với trạng thái dữ liệu tiếp cận rõ ràng.",
  "/destination",
);
export default async function DestinationIndex({ searchParams }) {
  const { d } = await searchParams;
  if (d) {
    if (!getDestination(d)) notFound();
    permanentRedirect(`/destination/${d}`);
  }
  return (
    <div className="container-page pb-12">
      <Breadcrumbs items={[{ label: "Điểm đến" }]} />
      <header className="page-intro">
        <p className="eyebrow">Những nơi chốn Hà Nội</p>
        <h1>Điểm đến và thông tin cho hành trình của bạn</h1>
        <p>
          Khám phá địa danh và xem từng tiêu chí tiếp cận đang được công bố hay
          cần xác minh.
        </p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((d) => (
          <PlaceCard key={d.slug} destination={d} />
        ))}
      </div>
    </div>
  );
}
