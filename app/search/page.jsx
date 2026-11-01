"use client";
import {Suspense,useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";
import {useA11y} from "@/components/A11yProvider";
import {useSpeechRecognition} from "@/lib/useSpeechRecognition";
import {catalog,catLabel} from "@/data/catalog";
import {A11Y_FILTERS,itemA11y} from "@/data/businesses";
import {searchCatalog} from "@/lib/search";
import CatalogCard from "@/components/CatalogCard";
import {MicIcon} from "@/components/Icons";
function SearchContent(){
 const params=useSearchParams();const initial=params.get("q")||"";
 const [query,setQuery]=useState(initial);const [filters,setFilters]=useState({});const [voiceError,setVoiceError]=useState("");
 const {speak}=useA11y();
 useEffect(()=>setQuery(initial),[initial]);
 const results=searchCatalog(catalog,query,catLabel).filter(item=>Object.keys(filters).filter(k=>filters[k]).every(k=>itemA11y(item)[k]));
 function runSearch(text){setQuery(text);speak(`Tìm kiếm: ${text}. Hãy kiểm tra dữ liệu tiếp cận trong kết quả.`);}
 const {supported,listening,start,error:recognitionError}=useSpeechRecognition({onResult:runSearch});
 function handleMic(){setVoiceError("");if(listening)return;if(supported&&start())return;const message="Không mở được nhận diện giọng nói. Hãy nhập bằng bàn phím.";setVoiceError(message);speak(message);document.getElementById("q")?.focus();}
 return <div className="container-page py-10"><h1 className="text-4xl sm:text-5xl">Tìm kiếm điểm đến và dịch vụ</h1><p className="mt-3 max-w-3xl text-lg text-ink-soft hc-muted">Tìm theo tên, khu vực, loại dịch vụ; có thể nhập tiếng Việt không dấu. Dữ liệu chưa xác minh và dịch vụ DEMO luôn được ghi rõ.</p><form role="search" className="mt-6 flex flex-wrap gap-3" onSubmit={event=>{event.preventDefault();runSearch(query);}}><label htmlFor="q" className="sr-only">Tên, khu vực hoặc loại dịch vụ</label><input id="q" name="q" value={query} onChange={event=>setQuery(event.target.value)} className="min-w-0 flex-1 rounded-full border border-line bg-white px-5 py-3 hc-surface hc-border" placeholder="Ví dụ: Văn Miếu, lưu trú"/><button className="btn-primary">Tìm</button><button type="button" onClick={handleMic} aria-pressed={listening} aria-label={listening?"Đang nghe":"Tìm kiếm bằng giọng nói"} className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white"><MicIcon/></button></form>{(voiceError||recognitionError)&&<p role="status" className="mt-3 text-red-800">{voiceError||recognitionError}</p>}<fieldset className="mt-5"><legend className="font-semibold">Lọc theo dữ liệu tiếp cận đã có</legend><div className="mt-2 flex flex-wrap gap-2">{A11Y_FILTERS.map(f=><button key={f.key} type="button" aria-pressed={!!filters[f.key]} onClick={()=>setFilters(prev=>({...prev,[f.key]:!prev[f.key]}))} className={`btn-ghost hc-border text-sm ${filters[f.key]?"bg-primary":""}`}>{f.label}</button>)}</div></fieldset><p className="mt-5" role="status">{results.length} kết quả{query?` cho “${query}”`:""}</p>{results.length?<div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map(item=><CatalogCard key={item.id} item={item}/>)}</div>:<p className="mt-4">Chưa có dữ liệu khớp. Điều này không chứng minh dịch vụ hoặc tiện ích đó không tồn tại.</p>}</div>;
}
export default function SearchPage(){return <Suspense fallback={<p className="container-page py-10" role="status">Đang tải tìm kiếm…</p>}><SearchContent/></Suspense>;}
