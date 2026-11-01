import {notFound} from "next/navigation";
import {getDestination} from "@/data/destinations";
import {pageMetadata} from "@/lib/seo";
import DestinationView from "./DestinationView";
export async function generateMetadata({searchParams}){const {d}=await searchParams;const destination=getDestination(d);if(d&&!destination)return {title:"Không tìm thấy điểm đến",robots:{index:false,follow:false}};return destination?pageMetadata(`${destination.name} — thông tin du lịch tiếp cận`,`${destination.summary} Thông tin tiếp cận: ${destination.access.level}. Đọc nguồn và lưu ý trước khi đến.`,`/destination?d=${destination.slug}`,{image:destination.image}):pageMetadata("Điểm đến Hà Nội và dữ liệu tiếp cận","Tìm hiểu cảnh quan, nguồn thông tin và những dữ liệu tiếp cận còn cần xác minh trước khi tham quan Hà Nội.","/destination");}
export default async function DestinationPage({searchParams}){const {d}=await searchParams;if(d&&!getDestination(d))notFound();return <DestinationView/>;}
