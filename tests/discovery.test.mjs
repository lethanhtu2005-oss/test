import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {normalizeSearch,searchCatalog} from "../lib/search.js";
test("D: tìm không dấu, khu vực, nhiều từ và rỗng",()=>{const items=[{name:"Văn Miếu",area:"Đống Đa",cat:"destination"},{name:"Lưu trú — DEMO",cat:"accommodation"}];assert.equal(normalizeSearch("Đống Đa"),"dong da");assert.equal(searchCatalog(items,"van mieu").length,1);assert.equal(searchCatalog(items,"dong da").length,1);assert.equal(searchCatalog(items,"",()=>"").length,2);assert.equal(searchCatalog(items,"khong co").length,0);});
test("D: gallery có native dialog và link thật; homepage bỏ block trùng, giữ tính năng",async()=>{const read=p=>readFile(new URL("../"+p,import.meta.url),"utf8");const gallery=await read("components/DestinationGallery.jsx");assert.match(gallery,/showModal/);assert.match(gallery,/onClose/);assert.match(gallery,/imageCredit/);const home=await read("app/page.jsx");assert.doesNotMatch(home,/Vì sao WayEcho hữu ích|badge: "Dễ tiếp cận"|\/item\?slug=/);assert.match(home,/DestinationGallery/);assert.match(home,/CameraIcon/);});
