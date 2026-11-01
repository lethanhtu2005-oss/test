import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const read=p=>readFile(new URL("../"+p,import.meta.url),"utf8");
test("C: voice không giả kết quả; panel có Escape và giới hạn màn hình",async()=>{
 const search=await read("app/search/page.jsx");assert.doesNotMatch(search,/setSimListening|setTimeout/);assert.match(search,/nhập bằng bàn phím/);
 const panel=await read("components/AccessibilityToolbar.jsx");assert.match(panel,/Escape/);assert.match(panel,/aria-controls="accessibility-panel"/);assert.match(panel,/100dvh/);
 const css=await read("app/globals.css");assert.match(css,/focus-visible/);assert.match(css,/data-textsize="large"/);assert.match(css,/input::placeholder/);
});
