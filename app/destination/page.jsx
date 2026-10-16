import { getDestination } from "@/data/destinations";
import DestinationView from "./DestinationView";

// Tiêu đề tab theo tên địa điểm để screen reader thông báo đúng nơi đang xem.
export async function generateMetadata({ searchParams }) {
  const { d } = await searchParams;
  if (!d) return { title: "Điểm đến" };
  return { title: getDestination(d)?.name || "Không tìm thấy điểm đến" };
}

export default function DestinationPage() {
  return <DestinationView />;
}
