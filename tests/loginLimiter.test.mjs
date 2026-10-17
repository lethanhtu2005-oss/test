import test from "node:test";import assert from "node:assert/strict";
import {createHmac} from "node:crypto";
import {takeLoginPermit,trustedLoginSource} from "../lib/loginLimiter.js";
test("P8 limiter: chặn theo account+source, không khóa account từ nguồn khác",()=>{
 const db={loginAttempts:[]},now=1000000;
 for(let i=0;i<8;i++)assert.equal(takeLoginPermit(db,"account","source-A",now).allowed,true);
 assert.equal(takeLoginPermit(db,"account","source-A",now).allowed,false);
 assert.equal(takeLoginPermit(db,"account","source-B",now).allowed,true);
 assert.equal(takeLoginPermit(db,"account","source-A",now+16*60000).allowed,true);
});
test("P8 limiter: số email/cardinality không khóa toàn hệ thống, nguồn flood vẫn bị giới hạn",()=>{
 const now=1000000,db={loginAttempts:Array.from({length:6000},(_,i)=>({key:"legacy"+i,at:now}))};
 assert.equal(takeLoginPermit(db,"legitimate","new-source",now).allowed,true);
 for(let i=0;i<40;i++)takeLoginPermit(db,"email"+i,"attacker",now);
 assert.equal(takeLoginPermit(db,"email-next","attacker",now).allowed,false);
 assert.equal(takeLoginPermit(db,"legitimate","other-source",now).allowed,true);
 assert.ok(db.loginAttempts.length<100);
});
test("P8 source: không tin X-Forwarded-For hoặc chữ ký sai/hết hạn",()=>{
 const previous=process.env.NODE_ENV,secret=process.env.WAYECHO_PROXY_SECRET;
 process.env.NODE_ENV="production";process.env.WAYECHO_PROXY_SECRET="x".repeat(64);
 try{
  assert.throws(()=>trustedLoginSource(new Request("https://site.invalid",{headers:{"x-forwarded-for":"1.2.3.4"}})),{status:503});
  const stamp=String(Date.now()),source="192.0.2.1";
  const sig=createHmac("sha256",process.env.WAYECHO_PROXY_SECRET).update(`${stamp}:${source}`).digest("hex");
  const req=new Request("https://site.invalid",{headers:{"x-wayecho-source":source,"x-wayecho-source-time":stamp,"x-wayecho-source-signature":sig}});
  assert.ok(trustedLoginSource(req));assert.throws(()=>trustedLoginSource(req,Number(stamp)+61000),{status:503});
 }finally{if(previous===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=previous;if(secret===undefined)delete process.env.WAYECHO_PROXY_SECRET;else process.env.WAYECHO_PROXY_SECRET=secret;}
});

test("P8 active bucket cap không chặn người dùng mới",()=>{const now=1000000,db={loginAttempts:Array.from({length:6000},(_,i)=>({key:"active"+i,kind:"pair",count:1,at:now,expiresAt:now+900000}))};assert.equal(takeLoginPermit(db,"legitimate","new-source",now).allowed,true);assert.equal(db.loginAttempts.length,5000);assert.ok(db.loginAttempts.some(x=>x.kind==="source"));});

test("Vercel: nguồn đăng nhập lấy từ IP do nền tảng đặt; thiếu hoặc sai thì từ chối",()=>{
 const previous=process.env.VERCEL;process.env.VERCEL="1";
 try{
  const a=trustedLoginSource(new Request("https://site.invalid",{headers:{"x-real-ip":"203.0.113.5"}}));
  const b=trustedLoginSource(new Request("https://site.invalid",{headers:{"x-forwarded-for":"203.0.113.5, 10.0.0.1"}}));
  assert.equal(a,b);assert.doesNotMatch(a,/203\.0/);
  assert.throws(()=>trustedLoginSource(new Request("https://site.invalid")),{status:503});
  assert.throws(()=>trustedLoginSource(new Request("https://site.invalid",{headers:{"x-real-ip":"not-an-ip"}})),{status:503});
 }finally{if(previous===undefined)delete process.env.VERCEL;else process.env.VERCEL=previous;}
});
