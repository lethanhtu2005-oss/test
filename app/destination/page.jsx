import { notFound, redirect } from "next/navigation";
import { getDestination } from "@/data/destinations";
import { pageMetadata } from "@/lib/seo";
import DestinationView from "./DestinationView";

export async function generateMetadata({ searchParams }) {
  const { d } = await searchParams;
  const destination = getDestination(d);
  if (d && !destination) return { title: "Không tìm thấy điểm đến", robots: { index: false, follow: false } };
  return destination
    ? pageMetadata(
        `${destination.name} — Thông tin du lịch tiếp cận Phố Cổ Hà Nội`,
        `${destination.summary} Thông tin tiếp cận: ${destination.access.level}.`,
        `/diem-den/${destination.slug}`,
        { image: destination.image }
      )
    : pageMetadata(
        "Điểm đến Phố Cổ Hà Nội và dữ liệu tiếp cận",
        "Tìm hiểu cảnh quan, nguồn thông tin và những dữ liệu tiếp cận đã được đối chiếu tại Phố Cổ Hà Nội.",
        "/destination"
      );
}

export default async function DestinationPage({ searchParams }) {
  const { d } = await searchParams;
  if (d) {
    const dest = getDestination(d);
    if (!dest) notFound();
    redirect(`/diem-den/${dest.slug}`);
  }
  return <DestinationView />;
}
