// Mật khẩu chỉ đọc từ stdin (không truyền qua argv hoặc ghi log).
// Mặc định ghi tài khoản vào store JSON local. Với --env: in một mục JSON để dán vào WAYECHO_USERS (dùng trên Vercel).
import { randomUUID } from "node:crypto";
import { getBusiness } from "../data/businesses.js";
import { hashPassword, ROLES } from "../lib/auth.js";
import { transaction, insert } from "../lib/store.js";
const args = process.argv.slice(2);
const toEnv = args[0] === "--env";
const [email, role, scope] = toEnv ? args.slice(1) : args;
if (!email || !email.includes("@") || !ROLES.includes(role) || (["business","guide"].includes(role) && !scope)) throw Error("Cách dùng: node scripts/provision-user.mjs [--env] email role [businessId/guideId]; nhập mật khẩu qua stdin.");
if(role === "business" && !getBusiness(scope)) throw Error("businessId chưa có trong dữ liệu hiện tại.");
let password=""; for await (const chunk of process.stdin) password+=chunk;
password=password.replace(/\r?\n$/,"");
if (password.length<12 || password.length>256) throw Error("Mật khẩu cần từ 12 đến 256 ký tự.");
const passwordHash=await hashPassword(password);
password="";
const account={email:email.trim().toLowerCase(),role,active:true,passwordHash,...(role==="business"?{businessId:scope}:role==="guide"?{guideId:scope}:{})};
if (toEnv) {
  console.log(JSON.stringify({id:`u_${randomUUID()}`,...account}));
} else {
  await transaction(db=>{
    if(db.users.some(u=>u.email===account.email)) throw Object.assign(Error("Tài khoản đã tồn tại; không ghi đè."),{status:409});
    insert(db,"users",account);
  });
  console.log("Đã cấp tài khoản. Không thay đổi dữ liệu legacy.");
}
