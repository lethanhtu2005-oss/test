import test, { after } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomBytes } from "node:crypto";
const root=fileURLToPath(new URL("../",import.meta.url));
register(new URL("./helpers/alias-loader.mjs",import.meta.url),{data:{root}});
const folder=await fs.mkdtemp(path.join(tmpdir(),"wayecho-p0-tests-"));
process.env.WAYECHO_DATA_PATH=path.join(folder,"db.json");
delete process.env.VERCEL;delete process.env.WAYECHO_STORAGE_MODE;delete process.env.WAYECHO_SESSION_SECRET;delete process.env.WAYECHO_USERS;
const { transaction, insert, list, add }=await import("../lib/store.js");
const { login, hashPassword, authenticate, signSession, sessionCookie, fail }=await import("../lib/auth.js");
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
const cookieOf=res=>(res.headers.get("set-cookie")||"").split(";")[0];
const payload={itemId:"demo-hotel",itemName:"ignored",date:"2026-12-01",guests:2,assist:true,accessibilityRequests:["Staff assistance"],requestNote:"private",ownerId:"t2",status:"confirmed",businessId:"b2"};
after(async()=>{await fs.rm(folder,{recursive:true,force:true});delete process.env.WAYECHO_DATA_PATH;});

test("Chưa đăng nhập chỉ nhận phiên khách rỗng; cookie giả, role từ client, CSRF bị chặn",async()=>{
 for(const r of ["bookings","saved","trip","requests","notifications"]){
  for(const extra of [{},{Cookie:"we_session=fake; role=admin"}]){
   const res=await call(r,"GET",undefined,null,extra);assert.equal(res.status,200);assert.deepEqual(await res.json(),[]);
   assert.match(res.headers.get("set-cookie")||"",/^we_session=[^;]+; HttpOnly; SameSite=Lax/);
  }
 }
 assert.equal((await call("requests","PATCH",{id:"x",status:"accepted"},null)).status,401);
 assert.equal((await call("notifications","POST",{role:"traveler",ownerId:"t1",message:"x"},null)).status,401);
 assert.equal((await call("bookings","POST",payload,"t1",{Origin:"https://evil.invalid"})).status,403);
 assert.equal((await call("bookings","POST",payload,null,{Origin:"https://evil.invalid"})).status,403);
 assert.equal((await call("bookings","POST",payload,"g1")).status,403);
 assert.equal((await call("notifications?role=admin")).status,403);
 const forged=tokens.a1.slice(0,-2)+(tokens.a1.endsWith("AA")?"BB":"AA");
 assert.equal((await call("notifications?role=admin","GET",undefined,null,{Cookie:`we_session=${forged}`})).status,403);
});
test("Phiên khách: mỗi trình duyệt chỉ thấy đặt chỗ của mình, không thấy của tài khoản khác",async()=>{
 const created=await call("bookings","POST",{itemId:"demo-restaurant"},null);assert.equal(created.status,201);
 const guestA=cookieOf(created);assert.match(guestA,/^we_session=/);
 const mine=await (await call("bookings","GET",undefined,null,{Cookie:guestA})).json();assert.equal(mine.length,1);assert.match(mine[0].ownerId,/^guest_[a-f0-9]{32}$/);
 assert.deepEqual(await (await call("bookings","GET",undefined,null)).json(),[]);
 assert.ok((await (await call("bookings")).json()).every(b=>b.id!==mine[0].id));
 assert.equal((await call("bookings","PATCH",{id:mine[0].id,status:"cancelled"},"t1")).status,404);
 assert.equal((await call("bookings","PATCH",{id:mine[0].id,status:"cancelled"},null,{Cookie:guestA})).status,200);
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
test("storage bảo toàn key lạ, không ghi đè JSON hỏng; Vercel dùng bộ nhớ tạm có báo, rollback khi lỗi",async()=>{
 await transaction(db=>{db.legacyExtra={keep:true};});assert.deepEqual(JSON.parse(await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8")).legacyExtra,{keep:true});
 const original=await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8");
 await fs.writeFile(process.env.WAYECHO_DATA_PATH,"broken");
 try{await assert.rejects(add("saved",{refId:"x"}));assert.equal(await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8"),"broken");}finally{await fs.writeFile(process.env.WAYECHO_DATA_PATH,original);}
 process.env.VERCEL="1";
 try{
  const res=await call("bookings","POST",{itemId:"demo-restaurant"});assert.equal(res.status,201);assert.equal(res.headers.get("x-wayecho-storage"),"memory");
  assert.equal(await fs.readFile(process.env.WAYECHO_DATA_PATH,"utf8"),original);
  const saved=(await list("saved")).length;
  await assert.rejects(transaction(db=>{db.saved.push({refId:"rollback"});fail(409,"thử rollback");}),{status:409});
  assert.equal((await list("saved")).length,saved);
  process.env.WAYECHO_STORAGE_MODE="local-single-host";
  assert.equal((await call("bookings")).status,503);
 }finally{delete process.env.VERCEL;delete process.env.WAYECHO_STORAGE_MODE;}
});
test("phiên ký: mật khẩu băm, chữ ký, hết hạn, khóa/đổi mật khẩu, cookie và redirect",async()=>{
 assert.notEqual(hash,password);
 const claims=Buffer.from(tokens.t1.split(".")[0],"base64url").toString();assert.doesNotMatch(claims,new RegExp(`${password}|${hash.split(":")[1]}`));
 await assert.rejects(login("t1@test.invalid","wrong-password"),{status:401});
 await assert.rejects(login("t1@test.invalid",password,"admin"),{status:401});
 assert.equal((await authenticate(request("bookings"))).role,"traveler");
 const withToken=token=>request("bookings","GET",undefined,null,{Cookie:`we_session=${token}`});
 await assert.rejects(authenticate(withToken(signSession({uid:"t2",role:"traveler",exp:Date.now()-1}))),{status:401});
 const [body,signature]=tokens.t1.split(".");
 const elevated=Buffer.from(JSON.stringify({...JSON.parse(Buffer.from(body,"base64url").toString()),role:"admin"})).toString("base64url");
 await assert.rejects(authenticate(withToken(`${elevated}.${signature}`)),{status:401});
 const extended=Buffer.from(JSON.stringify({...JSON.parse(Buffer.from(body,"base64url").toString()),exp:Date.now()+365*86400000})).toString("base64url");
 await assert.rejects(authenticate(withToken(`${extended}.${signature}`)),{status:401});
 await assert.rejects(authenticate(withToken(signSession({uid:`guest_${"a".repeat(32)}`,role:"admin",guest:true,exp:Date.now()+60000}))),{status:401});
 const t2=(await login("t2@test.invalid",password)).token;
 await transaction(db=>{db.users.find(u=>u.id==="t2").active=false;});
 await assert.rejects(authenticate(withToken(t2)),{status:401});
 await transaction(db=>{const u=db.users.find(u=>u.id==="t2");u.active=true;u.passwordHash=hash.replace(/^./,c=>c==="0"?"1":"0");});
 await assert.rejects(authenticate(withToken(t2)),{status:401});
 await transaction(db=>{db.users.find(u=>u.id==="t2").passwordHash=hash;});
 assert.equal((await authenticate(withToken(t2))).id,"t2");
 const env=process.env.NODE_ENV;process.env.NODE_ENV="production";
 try{await assert.rejects(authenticate(withToken(t2)),{status:503});}finally{if(env===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=env;}
 assert.match(sessionCookie("x"),/HttpOnly; SameSite=Lax/);assert.match(sessionCookie("",true),/Max-Age=0/);
 for(const target of ["//evil.invalid","/\\\\evil.invalid","https://evil.invalid","/login"] )assert.equal(safeNext(target),"/profile");
 assert.equal(safeNext("/my-booking?x=1"),"/my-booking?x=1");
});
test("tài khoản trong WAYECHO_USERS đăng nhập được; JSON hỏng thì từ chối an toàn",async()=>{
 process.env.WAYECHO_USERS=JSON.stringify([{id:"env_admin",email:"Env-Admin@Test.invalid",role:"admin",passwordHash:hash}]);
 try{
  const {token,user}=await login("env-admin@test.invalid",password);assert.equal(user.role,"admin");
  assert.equal((await authenticate(request("bookings","GET",undefined,null,{Cookie:`we_session=${token}`}))).id,"env_admin");
  process.env.WAYECHO_USERS="{broken";
  await assert.rejects(login("env-admin@test.invalid",password),{status:503});
 }finally{delete process.env.WAYECHO_USERS;}
});
test("G: tiếp nhận chỉ khi bật, có lưu trữ bền và có Admin; inbox chỉ Admin; gửi lặp trả một receipt",async()=>{
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
  // Chế độ lưu bộ nhớ (Vercel) không nhận hồ sơ đối tác vì sẽ mất mà vẫn báo đã nhận.
  process.env.VERCEL="1";
  try{assert.equal((await call("inquiries","POST",{...payload,message:"Gửi khi đang lưu bộ nhớ tạm."},null)).status,503);}finally{delete process.env.VERCEL;}
 }finally{delete process.env.WAYECHO_INQUIRIES_ENABLED;}
});
test("nhiều tiến trình cùng host không ghi đè dữ liệu nhau",async()=>{
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

test("P8 login: storage limiter lỗi thì không cho đăng nhập",async()=>{const original=fs.rename;fs.rename=async()=>{throw Object.assign(Error(),{code:"EACCES"});};try{await assert.rejects(login("t1@test.invalid",password),{status:503});}finally{fs.rename=original;}});

test("P9 booking từ chối ngày lịch sai, giờ sai và số khách boolean",async()=>{for(const patch of [{date:"2026-02-30"},{date:0},{time:"25:00"},{time:0},{guests:true}])assert.equal((await call("bookings","POST",{itemId:"demo-hotel",...patch})).status,400);});
