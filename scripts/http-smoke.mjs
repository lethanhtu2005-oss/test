// Chạy sau npm run build; chỉ dùng temporary DB do script tự tạo.
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {promises as fs} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {randomBytes,createHmac} from "node:crypto";
import net from "node:net";
const root=fileURLToPath(new URL("../",import.meta.url));
process.chdir(root);
const folder=await fs.mkdtemp(path.join(tmpdir(),"wayecho-http-"));
const socket=net.createServer();await new Promise(r=>socket.listen(0,"127.0.0.1",r));const port=socket.address().port;await new Promise(r=>socket.close(r));
const base=`http://127.0.0.1:${port}`;
process.env.WAYECHO_DATA_PATH=path.join(folder,"db.json");
process.env.WAYECHO_STORAGE_MODE="local-single-host";
process.env.WAYECHO_ORIGIN=base;
process.env.WAYECHO_INQUIRIES_ENABLED="1";
process.env.WAYECHO_PROXY_SECRET=randomBytes(32).toString("hex");
process.env.WAYECHO_SESSION_SECRET=randomBytes(32).toString("hex");
delete process.env.VERCEL;
const {hashPassword}=await import("../lib/auth.js");const {transaction}=await import("../lib/store.js");
const password=randomBytes(24).toString("hex");const passwordHash=await hashPassword(password);
await transaction(db=>{for(const [id,role,scope]of[["t1","traveler"],["t2","traveler"],["b1","business","b1"],["b2","business","b2"],["a1","admin"],["g1","guide","guide1"]])db.users.push({id,email:`${id}@test.invalid`,passwordHash,role,active:true,...(role==="business"?{businessId:scope}:role==="guide"?{guideId:scope}:{})});});
let server,checks=0;const errors=[];const cookies={};const publicPages=new Map();
async function start(){
 server=spawn(process.execPath,[path.join(root,"node_modules/next/dist/bin/next"),"start","--hostname","127.0.0.1","--port",String(port)],{cwd:root,env:{...process.env,NEXT_TELEMETRY_DISABLED:"1"},stdio:["ignore","pipe","pipe"]});
 let output="";server.stderr.on("data",chunk=>{output+=chunk.toString();});
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error("Server startup timeout: "+output)),20000);server.stdout.on("data",chunk=>{if(chunk.toString().includes("Ready")){clearTimeout(timer);resolve();}});server.on("exit",code=>{clearTimeout(timer);reject(Error("Server exit "+code+": "+output));});});
}
async function stop(){if(!server || server.exitCode!==null)return;await new Promise(resolve=>{server.once("exit",resolve);server.kill("SIGTERM");});}
function check(condition,label){checks++;if(!condition){errors.push(label);throw Error(label);}}
function sourceHeaders(){const time=String(Date.now()),source="127.0.0.1";return {"x-wayecho-source":source,"x-wayecho-source-time":time,"x-wayecho-source-signature":createHmac("sha256",process.env.WAYECHO_PROXY_SECRET).update(`${time}:${source}`).digest("hex")};}
async function request(url,{method="GET",body,user,headers={}}={}){return fetch(base+url,{redirect:"manual",method,headers:{...sourceHeaders(),Origin:base,"Content-Type":"application/json",...(user?{Cookie:cookies[user]}:{}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});}
try{
 await start();
 for(const url of ["/business","/admin","/guide","/guide/profile","/my-booking","/my-trip"]){const r=await request(url);check(r.status===307,`unauthorized page ${url}`);}
 for(const name of ["bookings","requests","saved","trip","notifications","inquiries"]){check((await request(`/api/${name}`)).status===401,`unauth API ${name}`);}
 for(const [id,role]of[["t1","traveler"],["t2","traveler"],["b1","business"],["b2","business"],["a1","admin"],["g1","guide"]]){
  const res=await request("/api/auth/login",{method:"POST",body:{email:`${id}@test.invalid`,password}});check(res.status===200,`login ${role}`);
  const cookie=res.headers.get("set-cookie");check(cookie?.includes("HttpOnly")&&cookie.includes("SameSite=Strict")&&cookie.includes("Secure"),`cookie ${role}`);cookies[id]=cookie.split(";")[0];
  const own={traveler:"/my-booking",business:"/business",admin:"/admin",guide:"/guide"}[role];check((await request(own,{user:id})).status===200,`own portal ${role}`);
  check((await request(role==="admin"?"/guide":"/admin",{user:id})).status===403,`foreign portal ${role}`);
 }
 let res=await request("/api/bookings",{method:"POST",user:"t1",body:{itemId:"demo-hotel",assist:true,shareAccessibility:false}});check(res.status===201,"save booking");const booking=await res.json();check(booking.status==="pending"&&!booking.assist,"pending and consent");
 check((await request("/api/bookings",{method:"PATCH",user:"t2",body:{id:booking.id,status:"cancelled"}})).status===404,"IDOR traveler");
 check((await request("/api/bookings",{method:"PATCH",user:"b2",body:{id:booking.id,status:"confirmed"}})).status===404,"IDOR business");
 check((await request("/api/bookings",{method:"PATCH",user:"b1",body:{id:booking.id,status:"confirmed"}})).status===200,"business update");
 for(const url of ["/","/explore","/search?q=van%20mieu","/navigation","/navigation?to=ho-guom","/navigation?to=bad","/navigation?to=hoang-thanh-thang-long","/destination","/destination?d=ho-guom","/destination?d=hoang-thanh-thang-long","/articles","/articles/chuan-bi-hanh-trinh","/services/guide-dogs","/partners/business","/partners/guide","/partners/cooperate","/guide/register","/sos","/assistant","/profile"]){const r=await request(url);const html=await r.text();publicPages.set(url,html);check(r.status===200,`public status ${url}`);check(/<title>/.test(html),`title ${url}`);check(/<h1[\s>]/.test(html),`h1 ${url}`);}
 const links=new Set();
 for(const [url,html] of publicPages){
  for(const match of html.matchAll(/href="([^"]+)"/g)){
   const href=match[1].replaceAll("&amp;","&");
   if(href.startsWith("#")){check(html.includes(`id="${href.slice(1)}"`),`local anchor ${url}${href}`);continue;}
   if(href.startsWith("/")&&!href.startsWith("//")&&!/^\/(_next|assets|icons)\//.test(href))links.add(href);
  }
 }
 for(const href of links){const url=new URL(href,base);const r=await request(url.pathname+url.search);check([200,307,308].includes(r.status),`internal link ${href}`);if(url.hash&&r.status===200){const html=await r.text();check(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`target anchor ${href}`);}}
 for(const url of ["/not-a-route","/destination?d=does-not-exist","/item?id=does-not-exist","/articles/does-not-exist","/partners/does-not-exist"]){check((await request(url)).status===404,`404 ${url}`);}
 check((await request("/item?slug=ho-guom")).status===307,"legacy slug redirect");
 for(const url of ["/robots.txt","/sitemap.xml"]){const r=await request(url);check(r.status===200,`SEO endpoint ${url}`);const body=await r.text();check(!body.includes("localhost")&&!body.includes("127.0.0.1")&&!body.includes("example.com"),`no invented sitemap domain ${url}`);}
 const proposal={kind:"business",name:"HTTP Contact",contact:"contact@test.invalid",organization:"HTTP fixture",service:"Travel",message:"Đề xuất kiểm thử HTTP được lưu trong temporary DB.",consent:true};
 res=await request("/api/inquiries",{method:"POST",body:proposal});check(res.status===201,"inquiry saves");const receipt=await res.json();res=await request("/api/inquiries",{method:"POST",body:proposal});check(res.status===200&&(await res.json()).id===receipt.id,"inquiry dedupe");check((await request("/api/inquiries",{user:"b1"})).status===403,"inquiry private");check((await request("/api/inquiries",{user:"a1"})).status===200,"admin inbox");
 await stop();await start();check((await request("/api/auth/session",{user:"t1"})).status===200,"session persists restart");res=await request("/api/bookings",{user:"t1"});check((await res.json()).some(x=>x.id===booking.id&&x.status==="confirmed"),"booking persists restart");
 check((await request("/api/auth/logout",{method:"POST",user:"t1"})).status===200,"logout persisted");check((await request("/api/auth/session",{user:"t1"})).status===401,"revoked token");
 console.log(JSON.stringify({checks,passed:checks,scope:"HTTP on localhost; temporary DB; server restart; no browser/GPS/AI/provider tests"}));
}finally{await stop();await fs.rm(folder,{recursive:true,force:true});}
