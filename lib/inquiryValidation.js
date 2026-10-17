export const KINDS=["business","guide","cooperation"];
export function validateInquiry(body){
 if(!body || !KINDS.includes(body.kind))return {error:"Loại yêu cầu không hợp lệ."};
 if(body.consent!==true)return {error:"Cần chủ động đồng ý để lưu thông tin liên hệ và nội dung đề xuất."};
 const text=(value,max)=>typeof value === "string" && value.trim().length<=max?value.trim():"";
 const name=text(body.name,100),contact=text(body.contact,150),organization=text(body.organization,200),service=text(body.service,100),area=text(body.area,150),message=text(body.message,1500);
 if(name.length<2)return {error:"Nhập tên người liên hệ, từ 2 đến 100 ký tự."};
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^\+?[\d ()-]{8,25}$/.test(contact))return {error:"Nhập email hoặc số điện thoại liên hệ hợp lệ."};
 if(body.kind==="business"&&!organization)return {error:"Nhập tên doanh nghiệp hoặc đơn vị."};
 if(!service)return {error:"Nhập hình thức dịch vụ hoặc hỗ trợ bạn quan tâm."};
 if(message.length<10)return {error:"Nội dung đề xuất cần từ 10 đến 1.500 ký tự."};
 return {value:{kind:body.kind,name,contact,organization,service,area,message,consent:true}};
}
