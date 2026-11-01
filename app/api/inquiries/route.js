import {list,transaction,insert,storageModeName} from "@/lib/store";
import {secured,checkOrigin,errorResponse,fail,json,digest,listUsers} from "@/lib/auth";
import {readJson} from "@/lib/validate";
import {validateInquiry} from "@/lib/inquiryValidation";
export const dynamic="force-dynamic";
// GET là inbox riêng của Admin; POST công khai theo mục đích đăng ký quan tâm.
export const GET=secured(async()=>json((await list("inquiries")).map(({fingerprint:_fingerprint,...record})=>record)),["admin"]);
export async function POST(req){
 try{
  checkOrigin(req);
  if(process.env.WAYECHO_INQUIRIES_ENABLED!=="1")fail(503,"Chưa bật hệ thống tiếp nhận. Chưa có dữ liệu nào được gửi thành công.");
  // Hồ sơ đối tác là dữ liệu liên hệ thật: không nhận khi chỉ lưu tạm trong bộ nhớ (sẽ mất mà vẫn báo đã nhận).
  if(storageModeName()!=="file")fail(503,"Bản demo trực tuyến chưa có lưu trữ bền. Chưa tiếp nhận hồ sơ.");
  const {value,error}=validateInquiry(await readJson(req));if(error)fail(400,error);
  if(!(await listUsers()).some(u=>u.role==="admin"&&u.active))fail(503,"Chưa có tài khoản quản trị để đọc yêu cầu. Chưa tiếp nhận hồ sơ.");
  const result=await transaction(db=>{
   const fingerprint=digest(JSON.stringify(value));
   const now=Date.now();
   const duplicate=db.inquiries.find(x=>x.fingerprint===fingerprint && Date.parse(x.createdAt)>now-24*60*60*1000);
   if(duplicate)return {id:duplicate.id,status:duplicate.status,duplicate:true};
   const recent=db.inquiries.filter(x=>Date.parse(x.createdAt)>now-60*60*1000);
   if(recent.length>=100 || recent.filter(x=>x.contact===value.contact).length>=3)fail(429,"Quá nhiều yêu cầu. Vui lòng thử lại sau.");
   const record=insert(db,"inquiries",{...value,status:"received",fingerprint});
   return {id:record.id,status:record.status,duplicate:false};
  });
  return json(result,result.duplicate?200:201);
 }catch(e){return errorResponse(e);}
}
