import { list, transaction, insert } from "./store.js";
import { secured, fail, json } from "./auth.js";
import { readJson, cleanText } from "./validate.js";
export function personalCollection(collection) {
  return {
    GET: secured(async(_req,user)=>json((await list(collection)).filter(x=>x.ownerId===user.id)),["traveler"],{guest:true}),
    POST: secured(async(req,user)=>{
      const body=await readJson(req);
      const refId=cleanText(body?.refId,100);
      if(!refId) fail(400,"Thiếu refId.");
      const result=await transaction(db=>db[collection].find(x=>x.ownerId===user.id && x.refId===refId) || insert(db,collection,{ownerId:user.id,refId,name:cleanText(body.name,300),cat:cleanText(body.cat,300),image:cleanText(body.image,300),...(collection==="trip"?{area:cleanText(body.area,300)}:{})}));
      return json(result,201);
    },["traveler"],{guest:true}),
    DELETE: secured(async(req,user)=>{
      const params=new URL(req.url).searchParams;
      const id=params.get("refId")||params.get("id");
      if(!id) fail(400,"Thiếu id.");
      await transaction(db=>{
        const index=db[collection].findIndex(x=>x.ownerId===user.id && (x.id===id || x.refId===id));
        if(index<0) fail(404,"Không tìm thấy dữ liệu của bạn.");
        db[collection].splice(index,1);
      });
      return json({ok:true});
    },["traveler"]),
  };
}
