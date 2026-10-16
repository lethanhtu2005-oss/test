import { getItem } from "@/data/catalog";
import ItemView from "./ItemView";

export async function generateMetadata({ searchParams }) {
  const { id } = await searchParams;
  return { title: getItem(id)?.name || "Không tìm thấy dịch vụ" };
}

export default function ItemPage() {
  return <ItemView />;
}
