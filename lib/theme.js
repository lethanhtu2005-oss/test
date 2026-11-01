export const THEME_KEY="we-theme";
export const THEME_OPTIONS=["system","light","dark"];
export function normalizeTheme(value){return THEME_OPTIONS.includes(value)?value:"system";}
export function resolveTheme(preference,systemDark){return preference==="dark"||(preference==="system"&&systemDark)?"dark":"light";}
// Chạy trong head trước nội dung. Không tải script hoặc gửi dữ liệu bên ngoài.
export const THEME_BOOTSTRAP=`(function(){var p="system";try{var v=localStorage.getItem("we-theme");if(v==="light"||v==="dark")p=v;}catch(e){}var d=false;try{d=window.matchMedia("(prefers-color-scheme: dark)").matches;}catch(e){}var t=p==="dark"||(p==="system"&&d)?"dark":"light";try{if(localStorage.getItem("dl-contrast")==="1")document.documentElement.dataset.contrast="high";}catch(e){}document.documentElement.dataset.theme=t;document.documentElement.dataset.themePreference=p;document.documentElement.style.colorScheme=t;})();`;
