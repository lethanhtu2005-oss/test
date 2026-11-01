import { list, transaction, insert } from "@/lib/store";
import { secured, fail, json, errorResponse } from "@/lib/auth";
import { readJson } from "@/lib/validate";
import {getItem} from "@/data/catalog";
const CRITERIA = ["entrance","navigation","staff","toilet","info","audio"];
export const dynamic = "force-dynamic";
const publicReview=r=>({id:r.id,itemId:r.itemId,itemName:getItem(r.itemId)?.name||r.itemName,author:r.author,comment:r.comment,ratings:r.ratings,createdAt:r.createdAt});
export async function GET(req) {
 try{
  const params=new URL(req.url).searchParams,place=params.get("place");
  if(place&&!getItem(place))fail(400,"Địa điểm không tồn tại.");
  let records=(await list("reviews")).filter(r=>!place||r.itemId===place);
  const total=records.length;
  // Phân trang opt-in, giữ response array và hành vi client cũ.
  if(params.has("limit")||params.has("offset")){
   const limit=Number(params.get("limit")||20),offset=Number(params.get("offset")||0);
   if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(offset)||offset<0)fail(400,"Phân trang không hợp lệ.");
   records=records.slice(offset,offset+limit);
  }
  const response=json(records.map(publicReview));response.headers.set("X-Total-Count",String(total));return response;
 }catch(e){return errorResponse(e);}
}
export const POST=secured(async(req,user)=>{
 const body=await readJson(req),item=typeof body?.itemId==="string"?getItem(body.itemId):null;
 if(!item)fail(400,"Địa điểm hoặc dịch vụ không tồn tại trong catalog.");
 for(const [key,max] of [["author",80],["comment",2000]])if(body[key]!==undefined&&(typeof body[key]!=="string"||body[key].length>max))fail(400,`Trường ${key} không hợp lệ hoặc quá dài.`);
 if(body.ratings!==undefined&&(!body.ratings||typeof body.ratings!=="object"||Array.isArray(body.ratings)))fail(400,"Ratings phải là object.");
 const ratings={};for(const key of CRITERIA){const n=body.ratings?.[key]??0;if(typeof n!=="number"||!Number.isInteger(n)||n<0||n>5)fail(400,`Điểm ${key} phải là số nguyên 0–5.`);ratings[key]=n;}
 const r=await transaction(db=>{
  if(db.reviews.filter(x=>x.ownerId===user.id&&Date.parse(x.createdAt)>Date.now()-3600000).length>=20)fail(429,"Đã đạt giới hạn gửi đánh giá trong giờ này.");
  return insert(db,"reviews",{ownerId:user.id,itemId:item.id,itemName:item.name,author:body.author?.trim()||"Khách ẩn danh",comment:body.comment?.trim()||"",ratings});
 });return json(publicReview(r),201);
},["traveler"],{guest:true});
