"use client";
import {createContext,useContext,useEffect,useState} from "react";
import {THEME_KEY,normalizeTheme,resolveTheme} from "@/lib/theme";
const Context=createContext(null);
export function useTheme(){return useContext(Context);}
function apply(preference){const theme=resolveTheme(preference,window.matchMedia?.("(prefers-color-scheme: dark)").matches||false);document.documentElement.dataset.theme=theme;document.documentElement.dataset.themePreference=preference;document.documentElement.style.colorScheme=theme;}
export default function ThemeProvider({children}){
 const [preference,setPreference]=useState("system"),[error,setError]=useState("");
 useEffect(()=>{
  function synchronize(){let value="system";try{value=normalizeTheme(localStorage.getItem(THEME_KEY));}catch{}apply(value);setPreference(value);}
  synchronize();const media=window.matchMedia?.("(prefers-color-scheme: dark)");
  function storage(event){if(event.key===THEME_KEY||event.key===null)synchronize();}
  media?.addEventListener("change",synchronize);window.addEventListener("storage",storage);
  return()=>{media?.removeEventListener("change",synchronize);window.removeEventListener("storage",storage);};
 },[]);
 function setTheme(value){value=normalizeTheme(value);setError("");apply(value);setPreference(value);try{localStorage.setItem(THEME_KEY,value);}catch{setError("Đã đổi giao diện cho phiên này nhưng không lưu được lựa chọn trên thiết bị.");}}
 return <Context.Provider value={{preference,setTheme,error}}>{children}</Context.Provider>;
}
