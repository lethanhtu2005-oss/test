import {createHmac,createHash,timingSafeEqual} from "node:crypto";
import {isIP} from "node:net";
const hash=value=>createHash("sha256").update(value).digest("hex");
export const LIMIT_WINDOW=15*60*1000;
export function trustedLoginSource(req,now=Date.now()) {
 const secret=process.env.WAYECHO_PROXY_SECRET;
 if(process.env.NODE_ENV!=="production" && !secret)return "development-local";
 if(!secret || secret.length<32)throw Object.assign(Error("Chưa cấu hình nguồn đăng nhập được xác thực ở proxy."),{status:503});
 const source=req.headers.get("x-wayecho-source")||"", stamp=req.headers.get("x-wayecho-source-time")||"",signature=req.headers.get("x-wayecho-source-signature")||"";
 if(!isIP(source)||!/^\d{13}$/.test(stamp)||Math.abs(now-Number(stamp))>60000||!/^[a-f0-9]{64}$/.test(signature))throw Object.assign(Error("Nguồn đăng nhập chưa được proxy xác thực."),{status:503});
 const expected=createHmac("sha256",secret).update(`${stamp}:${source}`).digest();
 if(!timingSafeEqual(expected,Buffer.from(signature,"hex")))throw Object.assign(Error("Nguồn đăng nhập chưa được proxy xác thực."),{status:503});
 return hash(source);
}
// Tài khoản + nguồn; không khóa toàn bộ tài khoản theo email do người khác nhập.
// Không có ngưỡng tổng số email làm chặn đăng nhập của tất cả người dùng.
export function takeLoginPermit(db,account,source,now=Date.now()) {
 db.loginAttempts=db.loginAttempts.filter(x=>x.expiresAt>now && ["source","pair"].includes(x.kind));
 const sourceKey=hash(`source:${source}`),pairKey=hash(`pair:${source}:${account}`);
 const sourceBucket=db.loginAttempts.find(x=>x.key===sourceKey),pair=db.loginAttempts.find(x=>x.key===pairKey);
 if((sourceBucket?.count||0)>=40 || (pair?.count||0)>=8)return {allowed:false,pairKey};
 for(const [key,kind,window]of[[sourceKey,"source",60000],[pairKey,"pair",LIMIT_WINDOW]]){
  const bucket=db.loginAttempts.find(x=>x.key===key);
  if(bucket){bucket.count++;bucket.at=now;}
  else db.loginAttempts.push({key,kind,count:1,at:now,expiresAt:now+window});
 }
 // Giới hạn dung lượng theo LRU; không đổi thành global login lock.
 if(db.loginAttempts.length>5000){const active=db.loginAttempts.filter(x=>x.key===sourceKey||x.key===pairKey);const other=db.loginAttempts.filter(x=>x.key!==sourceKey&&x.key!==pairKey).sort((a,b)=>b.at-a.at);db.loginAttempts=active.concat(other.slice(0,5000-active.length));}
 return {allowed:true,pairKey};
}
