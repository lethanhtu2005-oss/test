import { list, add } from "@/lib/store";
import { secured, fail, json, listUsers } from "@/lib/auth";
import { filterBusiness } from "@/lib/permissions";
import { readJson, cleanText, NOTIFICATION_ROLES } from "@/lib/validate";
export const dynamic = "force-dynamic";
export const GET = secured(async(req,user)=>{
  const params=new URL(req.url).searchParams;
  const role=params.get("role") || user.role;
  if(user.role !== "admin" && user.role !== role) fail(403,"Không có quyền đọc thông báo của vai trò khác.");
  return json(filterBusiness(user,(await list("notifications")).filter(x=>x.role===role),params.get("business")));
}, undefined, { guest: true });
export const POST = secured(async(req)=>{
  const body=await readJson(req);
  if(!body || !NOTIFICATION_ROLES.includes(body.role) || !cleanText(body.message)) fail(400,"Thông báo không hợp lệ.");
  // Không broadcast vào dữ liệu chung. Recipient phải là user đang hoạt động.
  const target=(await listUsers()).find(x=>x.id===body.ownerId && x.active && x.role===body.role);
  if(!target) fail(400,"Thiếu người nhận hợp lệ.");
  return json(await add("notifications",{ownerId:target.id,role:target.role,businessId:target.businessId||null,guideId:target.guideId||null,message:cleanText(body.message),type:cleanText(body.type,50)||"info"}),201);
},["admin"]);
