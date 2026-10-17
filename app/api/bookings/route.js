import { list, transaction, insert } from "@/lib/store";
import { businessIdForItem } from "@/data/businesses";
import { getItem } from "@/data/catalog";
import { readJson, cleanText, intInRange, canTransitionBooking, MAX_GUESTS, validBookingDate } from "@/lib/validate";
import { secured, fail, json, digest } from "@/lib/auth";
import { filterBusiness, findVisible } from "@/lib/permissions";
export const dynamic = "force-dynamic";

export const GET = secured(async (req, user) => json(filterBusiness(user, await list("bookings"), new URL(req.url).searchParams.get("business"))), undefined, { guest: true });
export const POST = secured(async (req, user) => {
  const body = await readJson(req);
  if (!body) fail(400,"Dữ liệu gửi lên không hợp lệ.");
  const item = getItem(body.itemId);
  if (!item) fail(400,"Dịch vụ không tồn tại.");
  const guests = body.guests === undefined ? 1 : intInRange(body.guests,1,MAX_GUESTS);
  if (body.guests !== undefined && !["number","string"].includes(typeof body.guests)) fail(400,"Số khách không hợp lệ.");
  if (guests === null) fail(400,`Số khách phải từ 1 đến ${MAX_GUESTS}`);
  if (body.date !== undefined && body.date !== null && body.date !== "" && !validBookingDate(body.date)) fail(400,"Ngày không hợp lệ (YYYY-MM-DD).");
  if(body.time !== undefined && body.time !== null && body.time !== "" && (typeof body.time!=="string" || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(body.time)))fail(400,"Giờ không hợp lệ.");
  if (body.shareAccessibility !== undefined && typeof body.shareAccessibility !== "boolean") fail(400,"Quyền chia sẻ phải là boolean.");
  // Mặc định từ chối. Không dùng assist, prefs hoặc requestNote làm bằng chứng đồng ý.
  const shareAccessibility = body.shareAccessibility === true;
  const requests = shareAccessibility && Array.isArray(body.accessibilityRequests) ? body.accessibilityRequests.slice(0,20).filter(x=>typeof x === "string").map(x=>cleanText(x,100)).filter(Boolean) : [];
  const note = shareAccessibility ? cleanText(body.requestNote) : "";
  const assist = shareAccessibility && body.assist === true && !!(requests.length || note);
  const businessId = businessIdForItem(item.id);
  const requestId=body.requestId;
  if(requestId!==undefined&&(typeof requestId!=="string"||!/^[A-Za-z0-9_-]{16,128}$/.test(requestId)))fail(400,"Mã yêu cầu không hợp lệ.");
  const requestHash=digest(JSON.stringify({itemId:item.id,date:body.date||null,time:cleanText(body.time,20)||null,guests,assist,shareAccessibility,requests,note}));
  const record = await transaction(db=>{
    if(requestId){const previous=db.bookings.find(x=>x.ownerId===user.id&&x.requestId===requestId);if(previous){if(previous.requestHash!==requestHash)fail(409,"Mã yêu cầu đã được dùng với nội dung khác.");return previous;}}
    const booking = insert(db,"bookings",{ownerId:user.id,isDemo:true,...(requestId?{requestId,requestHash}:{}),itemId:item.id,itemName:item.name,businessId,date:body.date || null,time:cleanText(body.time,20)||null,guests,assist,shareAccessibility,price:item.price || null,status:businessId?"pending":"demo"});
    if (assist && businessId) {
      insert(db,"requests",{ownerId:user.id,bookingId:booking.id,businessId,itemName:item.name,shareAccessibility:true,content:requests.length?requests.join(", "):note,status:"pending"});
      insert(db,"notifications",{ownerId:user.id,role:"business",businessId,type:"accessibility_request",message:`Yêu cầu hỗ trợ mới cho "${item.name}"`});
    }
    if (businessId) insert(db,"notifications",{ownerId:user.id,role:"business",businessId,type:"new_booking",message:`Đặt chỗ DEMO mới: ${item.name}`});
    return booking;
  });
  return json(record,201);
}, ["traveler"], { guest: true });

export const PATCH = secured(async (req,user)=>{
  const body=await readJson(req);
  if(!body?.id || !["confirmed","rejected","cancelled"].includes(body.status)) fail(400,"Thiếu id hoặc trạng thái không hợp lệ.");
  const result=await transaction(db=>{
    const record=findVisible(user,db.bookings,body.id);
    if(user.role === "traveler" && body.status !== "cancelled") fail(403,"Traveler chỉ được hủy đặt chỗ của mình.");
    if(record.status===body.status)return record;
    if(!canTransitionBooking(record.status,body.status)) fail(409,"Không thể chuyển trạng thái đặt chỗ này.");
    Object.assign(record,{status:body.status,updatedAt:new Date().toISOString()});
    insert(db,"notifications",{ownerId:record.ownerId,role:"traveler",type:"booking_status",message:`Booking DEMO "${record.itemName}": ${body.status === "confirmed" ? "đã xác nhận trong hệ thống demo" : body.status === "rejected" ? "đã từ chối" : "đã hủy"}.`});
    return record;
  });
  return json(result);
},["traveler","business","admin"]);
