// Chỉ đọc chẩn đoán. Không tự xóa lock, kể cả khi PID không tồn tại.
import {promises as fs} from "node:fs";
import path from "node:path";
import {hostname} from "node:os";
const file=process.env.WAYECHO_DATA_PATH||path.join(process.cwd(),"data","db.json");
try{
 const owner=JSON.parse(await fs.readFile(path.join(`${file}.lock`,"owner.json"),"utf8"));
 let status="unknown-host";
 if(owner.host===hostname()&&Number.isSafeInteger(owner.pid)&&owner.pid>0){try{process.kill(owner.pid,0);status="process-alive";}catch(e){status=e.code==="ESRCH"?"process-not-found":"unknown-permission";}}
 console.log(JSON.stringify({status,startedAt:owner.startedAt,action:"Không tự xóa lock. Dừng/xác nhận mọi writer và sao lưu trước bảo trì."}));
}catch(e){console.log(JSON.stringify({status:e.code==="ENOENT"?"no-owner-metadata":"unreadable-metadata",action:"Kiểm tra lock thủ công; thiếu metadata không chứng minh không có writer."}));}
