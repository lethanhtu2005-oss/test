import {notFound,redirect} from "next/navigation";
import {getItem} from "@/data/catalog";
import {pageMetadata} from "@/lib/seo";
import ItemView from "./ItemView";
export async function generateMetadata({searchParams}){const q=await searchParams;const item=getItem(q.id||q.slug);return item?pageMetadata(item.name,item.summary,`/item?id=${item.id}`,{index:!item.isDemo,image:item.image}):{title:"Không tìm thấy dịch vụ",robots:{index:false,follow:false}};}
export default async function ItemPage({searchParams}){const q=await searchParams;const item=getItem(q.id||q.slug);if(!item)notFound();if(item.cat==="destination"&&item.destinationSlug)redirect(`/destination?d=${item.destinationSlug}`);return <ItemView/>;}
