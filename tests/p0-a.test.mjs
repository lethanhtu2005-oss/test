import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { bookingStatus } from "../lib/bookingStatus.js";
import { navigationTarget } from "../lib/navigationTarget.js";
import { requestSOSLocation, networkMessage } from "../lib/sos.js";

test("booking trạng thái thực và fallback không xác nhận", () => {
  assert.match(bookingStatus("pending")[0], /chờ/);
  assert.match(bookingStatus("demo")[0], /DEMO/);
  assert.match(bookingStatus("confirmed")[0], /xác nhận/);
  for (const s of ["cancelled", "rejected", "unknown", undefined]) assert.doesNotMatch(bookingStatus(s)[0], /Đã xác nhận/);
});
test("navigation slug/id, thiếu, sai và tọa độ không hợp lệ", () => {
  const ds = [{slug:"ho-guom", id:"lake", name:"Hồ Gươm", coordinates:{lat:21,lng:105}}, {slug:"missing",name:"Thiếu"}, {slug:"bad",name:"Sai",coordinates:{lat:100,lng:105}}];
  assert.deepEqual(navigationTarget("ho-guom",ds).center,[21,105]);
  assert.equal(navigationTarget("lake",ds).zoom,16);
  assert.equal(navigationTarget(null,ds).message,"");
  for (const to of ["absent","missing","bad"]) {assert.equal(navigationTarget(to,ds).zoom,13);assert.ok(navigationTarget(to,ds).message);}
});
test("SOS chỉ yêu cầu vị trí khi gọi hàm, không gọi mạng; thành công và lỗi", () => {
  let count=0; const reports=[];
  const geo={ getCurrentPosition(ok, error, opts) {count++;assert.equal(opts.timeout,8000);ok({coords:{latitude:21,longitude:105}});}};
  assert.equal(count,0);
  requestSOSLocation(geo,x=>reports.push(x));
  assert.equal(count,1);assert.match(reports.at(-1),/không gửi/);
  for (const [code, pattern] of [[1,/từ chối/],[2,/GPS/],[3,/thời gian/]]) {
    requestSOSLocation({getCurrentPosition(ok,err){err({code});}},x=>reports.push(x));assert.match(reports.at(-1),pattern);
  }
  requestSOSLocation(null,x=>reports.push(x));assert.match(reports.at(-1),/không hỗ trợ/);
  requestSOSLocation({getCurrentPosition(){throw Error();}},x=>reports.push(x));assert.match(reports.at(-1),/Không thể/);
  assert.match(networkMessage(false),/ngoại tuyến/);assert.match(networkMessage(true),/không kết nối/);
});
test("SOS không tự xin vị trí khi mount; link desktop/portal và mobile/footer được giữ",async()=>{
 const sos=await readFile(new URL("../app/sos/page.jsx",import.meta.url),"utf8");
 assert.equal(sos.match(/requestSOSLocation\(/g).length,1);
 assert.match(sos,/function startSOS[\s\S]*requestSOSLocation/);
 for(const c of ["Header","BusinessNav","AdminNav","GuideNav"]) assert.match(await readFile(new URL(`../components/${c}.jsx`,import.meta.url),"utf8"),/<SOSLink/);
 for(const c of ["MobileNav","Footer"]) assert.match(await readFile(new URL(`../components/${c}.jsx`,import.meta.url),"utf8"),/\/sos/);
});

import {emergencyPhone} from "../lib/sos.js";
test("P9 SOS chỉ mở số người dùng đã lưu, bỏ chuỗi mơ hồ hoặc nhiều số",()=>{assert.equal(emergencyPhone("Liên hệ +1 (202) 555-0123"),"+12025550123");assert.equal(emergencyPhone("Chưa có"),null);assert.equal(emergencyPhone("+12025550123 / +12025550124"),null);assert.equal(emergencyPhone("123"),null);});
