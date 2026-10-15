import { notFound, permanentRedirect } from "next/navigation";
import { getItem } from "@/data/catalog";
import { getDestination } from "@/data/destinations";
import ItemView from "./ItemView";
import { pageMetadata } from "@/lib/seo";
export async function generateMetadata({ searchParams }) {
  const { id, slug } = await searchParams;
  const item = getItem(id || slug);
  return item
    ? {
        ...pageMetadata(
          item.name,
          item.summary,
          `/item?id=${item.id}`,
          item.image,
        ),
        robots: item.isDemo ? { index: false, follow: true } : undefined,
      }
    : {};
}
export default async function ItemPage({ searchParams }) {
  const { id, slug } = await searchParams;
  const key = id || slug;
  const d = getDestination(key);
  if (d) permanentRedirect(`/destination/${d.slug}`);
  if (!getItem(key)) notFound();
  return <ItemView />;
}
