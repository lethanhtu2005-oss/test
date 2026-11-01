export function normalizeSearch(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase().trim(); }
export function searchCatalog(items,query,categoryLabel=()=>"") {
 const q=normalizeSearch(query);if(!q)return items;
 const words=q.split(/\s+/);
 return items.filter(item=>{const haystack=normalizeSearch([item.name,item.area,item.cat,categoryLabel(item.cat),item.summary,item.level,item.note].join(" "));return words.every(word=>haystack.includes(word));});
}
