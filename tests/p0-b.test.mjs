import test, { after } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomBytes } from "node:crypto";
const root=fileURLToPath(new URL("../",import.meta.url));
registerHooks({resolve(specifier,context,next){
 if(specifier.startsWith("@/")) return next(pathToFileURL(path.join(root,specifier.slice(2)+".js")).href,context);
 try{return next(specifier,context);}catch(e){if(specifier.startsWith(".") && !path.extname(specifier))return next(specifier+".js",context);throw e;}
}});
const folder=await fs.mkdtemp(path.join(tmpdir(),"wayecho-p0-tests-"));
process.env.WAYECHO_DATA_PATH=path.join(folder,"db.json");
delete process.env.VERCEL;
const { transaction, insert, list, add }=await import("../lib/store.js");
const { login, hashPassword, authenticate, logout, digest, sessionCookie }=await import("../lib/auth.js");
const { safeNext }=await import("../lib/redirect.js");
const modules={};for(const name of ["bookings","saved","trip","requests","notifications","reviews","inquiries"])modules[name]=await import(`../app/api/${name}/route.js`);
const password=randomBytes(24).toString("hex");
const hash=await hashPassword(password);
await transaction(db=>{
 for(const [id,role,scope] of [["t1","traveler"],["t2","traveler"],["b1","business","b1"],["b2","business","b2"],["g1","guide","guide1"],["a1","admin"]])db.users.push({id,email:`${id}@test.invalid`,role,active:true,passwordHash:hash,...(role==="business"?{businessId:scope}:role==="guide"?{guideId:scope}:{})});
 insert(db,"bookings",{itemId:"legacy",itemName:"Legacy",status:"pending",businessId:"b1"});
});
const tokens={};for(const id of ["t1","t2","b1","b2","g1","a1"])tokens[id]=(await login(`${id}@test.invalid`,password)).token;
function request(route,method="GET",body,user="t1",extra={}) {
 return new Request(`http://localhost/api/${route}`,{method,headers:{Origin:"http://localhost",...(user?{Cookie:`we_session=${tokens[user]}`} : {}),"Content-Type":"application/json",...extra},...(body===undefined?{}:{body:JSON.stringify(body)})});
}
async function call(route,method="GET",body,user="t1",extra={}){const name=route.split("?")[0];return modules[name][method](request(route,method,body,user,extra));}
const payload={itemId:"demo-hotel",itemName:"ignored",date:"2026-12-01",guests:2,assist:true,accessibilityRequests:["Staff assistance"],requestNote:"private",ownerId:"t2",status:"confirmed",businessId:"b2"};
after(async()=>{await fs.rm(folder,{recursive:true,force:true});delete process.env.WAYECHO_DATA_PATH;});

test("API nhạy cảm chặn chưa login, cookie giả, role từ client, CSRF",async()=>{
 for(const r of ["bookings","saved","trip","requests","notifications"]){assert.equal((await call(r,"GET",undefined,null)).status,401);assert.equal((await call(r,"GET",undefined,"t1",{Cookie:"we_session=fake; role=admin"})).status,401);}
 assert.equal((await call("bookings","POST",payload,"t1",{Origin:"https://evil.invalid"})).status,403);
 assert.equal((await call("bookings","POST",payload,"g1")).status,403);
 assert.equal((await call("notifications?role=admin")).status,403);
});
test("booking server gán owner/status; consent thiếu hoặc false không tạo/chia sẻ request",async()=>{
 const before=(await list("requests")).length;
 for(const share of [undefined,false]){
  const res=await call("bookings","POST",{...payload,shareAccessibility:share});assert.equal(res.status,201);const b=await res.json();
  assert.equal(b.ownerId,"t1");assert.equal(b.status,"pending");assert.equal(b.businessId,"b1");assert.equal(b.assist,false);assert.equal(b.shareAccessibility,false);
 }
 assert.equal((await list("requests")).length,before);
 assert.equal((await call("bookings","POST",{...payload,shareAccessibility:"true"})).status,400);
 const demo=await (await call("bookings","POST",{itemId:"demo-restaurant"})).json();assert.equal(demo.status,"demo");
 const b1=await (await call("bookings","GET",undefined,"b1")).json();assert.ok(b1.every(b=>b.itemId!=="legacy"));
});
test("ownership và Business scope chặn sửa ID người khác; consent true tạo nguyên tử",async()=>{
 const b=await (await call("bookings","POST",{...payload,shareAccessibility:true})).json();
 assert.equal(b.assist,true);
 const requests=await (await call("requests","GET",undefined,"b1")).json();const r=requests.find(x=>x.bookingId===b.id);assert.ok(r);
 assert.equal((await call("requests","PATCH",{id:r.id,status:"accepted"},"b2")).status,404);
 assert.equal((await call("requests","PATCH",{id:r.id,status:"accepted"},"t1")).status,403);
 assert.equal((await call("bookings?business=b1","GET",undefined,"b2")).status,403);
 assert.equal((await call("bookings","PATCH",{id:b.id,status:"cancelled"},"t2")).status,404);
 assert.equal((await call("bookings","PATCH",{id:b.id,status:"confirmed"},"t1")).status,403);
 assert.equal((await call("bookings","PATCH",{id:b.id,status:"confirmed"},"b2")).status,404);
 assert.equal((await call("bookings","PATCH",{id:"missing",status:"confirmed"},"a1")).status,404);
 assert.equal((await call("bookings","PATCH",{id:b.id,status:"confirmed"},"b1")).status,200);
 assert.equal((await call("bookings","PATCH",{id:b.id,status:"rejected"},"b1")).status,409);
 assert.equal((await call("requests","PATCH",{id:r.id,status:"accepted"},"b1")).status,200);
 assert.equal((await call("requests","PATCH",{id:r.id,status:"rejected"},"b1")).status,409);
 assert.ok((await (await call("notifications?role=traveler","GET",undefined,"t2")).json()).length===0);
 assert.ok((await (await call("bookings","GET",undefined,"t2")).json()).length===0);
 assert.ok((await (await call("bookings","GET",undefined,"g1")).json()).length===0);
});
test("Saved/trip: không xóa chéo, không trùng khi request đồng thời",async()=>{
 for(const name of ["saved","trip"]){
  const results=await Promise.all(Array.from({length:6},()=>call(name,"POST",{refId:"ho-guom"})));assert.ok(results.every(r=>r.ok));
  const all=await (await call(name)).json();assert.equal(all.length,1);
  assert.equal((await call(`${name}?refId=${all[0].id}`,"DELETE",undefined,"t2")).status,404);
  assert.equal((await call(`${name}?refId=ho-guom`,"DELETE")).status,200);
 }
});
test("lỗi ghi không trả thành công; transaction booking/request/notification rollback cùng nhau",async()=>{
 const before=await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8");
 const original=fs.rename;
 fs.rename=async()=>{throw Object.assign(Error("test write failure"),{code:"EACCES"});};
 try{const res=await call("bookings","POST",{...payload,shareAccessibility:true});assert.equal(res.status,503);assert.doesNotMatch(JSON.stringify(await res.json()),/EACCES|test write failure|password/);}
 finally{fs.rename=original;}
 assert.equal(await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8"),before);
});
test("storage bảo toàn key lạ, không ghi đè JSON hỏng và fail closed trên Vercel",async()=>{
 await transaction(db=>{db.legacyExtra={keep:true};});assert.deepEqual(JSON.parse(await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8")).legacyExtra,{keep:true});
 const original=await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8");
 await fs.writeFile(process.env.WAYECHO_DATA_PATH,"broken");
 try{await assert.rejects(add("saved",{refId:"x"}));assert.equal(await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8"),"broken");}finally{await fs.writeFile(process.env.WAYECHO_DATA_PATH,original);}
 process.env.VERCEL="1";try{assert.equal((await call("bookings")).status,503);}finally{delete process.env.VERCEL;}
});
test("session server: băm mật khẩu/token, expiry, revoke, role hiện tại và redirect",async()=>{
 assert.notEqual(hash,password);assert.ok(!(await list("sessions")).some(s=>s.token===tokens.t1));
 await assert.rejects(login("t1@test.invalid","wrong-password"),{status:401});
 await assert.rejects(login("t1@test.invalid",password,"admin"),{status:401});
 assert.equal((await authenticate(request("bookings"))).role,"traveler");
 const expires=(await login("t2@test.invalid",password)).token;
 await transaction(db=>{db.sessions.find(s=>s.tokenHash===digest(expires)).expiresAt=0;});
 await assert.rejects(authenticate(request("bookings","GET",undefined,"t2",{Cookie:`we_session=${expires}`})),{status:401});
 const token=(await login("t2@test.invalid",password)).token;
 const req=request("bookings","GET",undefined,"t2",{Cookie:`we_session=${token}`});await logout(req);await assert.rejects(authenticate(req),{status:401});
 assert.match(sessionCookie("x"),/HttpOnly; SameSite=Strict/);
 for(const target of ["//evil.invalid","/\\\\evil.invalid","https://evil.invalid","/login"] )assert.equal(safeNext(target),"/profile");
 assert.equal(safeNext("/my-booking?x=1"),"/my-booking?x=1");
});

test("G: tiếp nhận chỉ khi cấu hình/consent đúng; inbox chỉ Admin; gửi lặp trả một receipt",async()=>{
 const payload={kind:"business",name:"Contact test",contact:"partner@test.invalid",organization:"Organization test",service:"Travel",message:"Nội dung kiểm thử tiếp nhận.",consent:true};
 assert.equal((await call("inquiries","POST",payload,null)).status,503);
 process.env.WAYECHO_INQUIRIES_ENABLED="1";
 try{
  assert.equal((await call("inquiries","POST",{...payload,consent:false},null)).status,400);
  const before=(await list("inquiries")).length;
  const results=await Promise.all(Array.from({length:4},()=>call("inquiries","POST",payload,null)));
  assert.ok(results.every(r=>r.ok));
  const receipts=await Promise.all(results.map(r=>r.json()));assert.equal(new Set(receipts.map(r=>r.id)).size,1);
  assert.equal((await list("inquiries")).length,before+1);
  assert.equal((await call("inquiries","GET",undefined,null)).status,401);
  for(const who of ["t1","b1","g1"])assert.equal((await call("inquiries","GET",undefined,who)).status,403);
  const inbox=await call("inquiries","GET",undefined,"a1");assert.equal(inbox.status,200);assert.doesNotMatch(JSON.stringify(await inbox.json()),/fingerprint/);
  const original=fs.rename;fs.rename=async()=>{throw Object.assign(Error(),{code:"EACCES"});};
  try{assert.equal((await call("inquiries","POST",{...payload,message:"Một đề xuất khác để thử lỗi lưu."},null)).status,503);}finally{fs.rename=original;}
 }finally{delete process.env.WAYECHO_INQUIRIES_ENABLED;}
});
test("G: nhiều tiến trình cùng host không ghi đè dữ liệu nhau",async()=>{
 const {spawn}=await import("node:child_process");
 const before=(await list("reviews")).length;
 const code=`import {add} from ${JSON.stringify(pathToFileURL(path.join(root,"lib/store.js")).href)};for(let i=0;i<8;i++)await add("reviews",{itemId:"multiprocess-test"});`;
 await Promise.all(Array.from({length:3},()=>new Promise((resolve,reject)=>{const child=spawn(process.execPath,["--input-type=module","-e",code],{cwd:root,env:process.env,stdio:"ignore"});child.on("exit",c=>c===0?resolve():reject(Error("writer failed "+c)));child.on("error",reject);})));assert.equal((await list("reviews")).length,before+24);
});

test("P8 review: ID phải tồn tại, tên chuẩn server, strict types và quyền",async()=>{
 assert.equal((await call("reviews","POST",{itemId:"made-up"})).status,400);
 assert.equal((await call("reviews","POST",{itemId:"ho-guom",ratings:{entrance:true}})).status,400);
 assert.equal((await call("reviews","POST",{itemId:"ho-guom",author:{} })).status,400);
 assert.equal((await call("reviews","POST",{itemId:"ho-guom",comment:"x".repeat(2001)})).status,400);
 assert.equal((await call("reviews","POST",{itemId:"ho-guom"},"b1")).status,403);
 const r=await call("reviews","POST",{itemId:"ho-guom",itemName:"FAKE NAME",ratings:{entrance:4},comment:"Review test"});assert.equal(r.status,201);const body=await r.json();assert.notEqual(body.itemName,"FAKE NAME");assert.equal(body.ownerId,undefined);
 assert.equal((await call("reviews?limit=0")).status,400);
 assert.equal((await (await call("reviews?place=ho-guom&limit=1&offset=0")).json()).length,1);
});
test("P8 booking: idempotency cùng owner, conflict khác body, PATCH lặp không tạo notification",async()=>{
 const req={itemId:"demo-hotel",requestId:"opaque-request-unique-123"};
 const first=await (await call("bookings","POST",req)).json();
 const again=await (await call("bookings","POST",req)).json();assert.equal(first.id,again.id);assert.equal(first.isDemo,true);
 assert.equal((await call("bookings","POST",{...req,guests:2})).status,409);
 assert.notEqual((await (await call("bookings","POST",req,"t2")).json()).id,first.id);
 const before=(await list("notifications")).length;
 assert.equal((await call("bookings","PATCH",{id:first.id,status:"confirmed"},"a1")).status,200);
 assert.equal((await call("bookings","PATCH",{id:first.id,status:"confirmed"},"a1")).status,200);
 assert.equal((await list("notifications")).length,before+1);
});
test("P8 storage: DB đã khởi tạo bị mất không tự tạo seed",async()=>{
 const file=process.env.WAYECHO_DATA_PATH,backup=await fs.readFile(file);
 await fs.unlink(file);try{await assert.rejects(add("saved",{refId:"cannot-reinitialize"}),{status:503});}finally{await fs.writeFile(file,backup);}
});
test("P8 storage: writer đang sống hoặc chết để lại lock không bị tự xóa",async()=>{
 const lock=process.env.WAYECHO_DATA_PATH+".lock";
 await fs.mkdir(lock);await fs.writeFile(path.join(lock,"owner.json"),JSON.stringify({pid:process.pid,host:"test"}));
 const before=await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8");
 try{await assert.rejects(add("saved",{refId:"locked"}),{status:503});assert.ok((await fs.stat(lock)).isDirectory());assert.equal(await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8"),before);}finally{await fs.rm(lock,{recursive:true});}
 const {spawn}=await import("node:child_process");
 const code=`import {transaction} from ${JSON.stringify(pathToFileURL(path.join(root,"lib/store.js")).href)};await transaction(async db=>{console.log("LOCKED");await new Promise(()=>{});});`;
 const child=spawn(process.execPath,["--input-type=module","-e",code],{cwd:root,env:process.env,stdio:["ignore","pipe","ignore"]});
 await new Promise((resolve,reject)=>{child.stdout.once("data",()=>resolve());child.once("error",reject);});
 await new Promise(resolve=>{child.once("exit",resolve);child.kill("SIGKILL");});
 try{assert.ok((await fs.stat(lock)).isDirectory());await assert.rejects(add("saved",{refId:"stale"}),{status:503});assert.equal(await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8"),before);}finally{await fs.rm(lock,{recursive:true});}
});

test("P8 login: storage limiter lỗi thì không tạo session và không cho đăng nhập",async()=>{const before=(await list("sessions")).length;const original=fs.rename;fs.rename=async()=>{throw Object.assign(Error(),{code:"EACCES"});};try{await assert.rejects(login("t1@test.invalid",password),{status:503});}finally{fs.rename=original;}assert.equal((await list("sessions")).length,before);});

test("P9 booking từ chối ngày lịch sai, giờ sai và số khách boolean",async()=>{for(const patch of [{date:"2026-02-30"},{date:0},{time:"25:00"},{time:0},{guests:true}])assert.equal((await call("bookings","POST",{itemId:"demo-hotel",...patch})).status,400);});
