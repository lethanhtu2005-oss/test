import { list, transaction, insert } from "@/lib/store";
import { readJson, cleanText, REQUEST_STATUSES } from "@/lib/validate";
import { secured, fail, json } from "@/lib/auth";
import { filterBusiness, findVisible } from "@/lib/permissions";
export const dynamic = "force-dynamic";
export const GET = secured(async(req,user)=>json(filterBusiness(user,(await list("requests")).filter(r=>r.shareAccessibility === true),new URL(req.url).searchParams.get("business"))));
export const PATCH = secured(async(req,user)=>{
  const body=await readJson(req);
  if(!body?.id || !REQUEST_STATUSES.includes(body.status)) fail(400,"Thiếu id hoặc trạng thái không hợp lệ.");
  return json(await transaction(db=>{
    const record=findVisible(user,db.requests,body.id);
    if(record.shareAccessibility !== true) fail(404,"Không có yêu cầu đã được cho phép chia sẻ.");
    if(record.status !== "pending") fail(409,"Yêu cầu đã được xử lý.");
    Object.assign(record,{status:body.status,note:cleanText(body.note),updatedAt:new Date().toISOString()});
    insert(db,"notifications",{ownerId:record.ownerId,role:"traveler",type:"request_result",message:`Yêu cầu hỗ trợ cho "${record.itemName}" đã được ${body.status === "accepted"?"chấp nhận":"từ chối"} trong demo.`});
    return record;
  }));
},["business","admin"]);
