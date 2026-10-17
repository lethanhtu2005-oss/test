export function siteOrigin(value=process.env.NEXT_PUBLIC_SITE_URL) {
 if(!value)return null;
 try {const u=new URL(value);if(u.protocol!=="https:" || u.username || u.password || u.search || u.hash || !u.hostname.includes(".") || /(^|\.)(localhost|example\.com|example\.org|example\.net)$|\.(invalid|test|local)$|^\d+\.\d+\.\d+\.\d+$/.test(u.hostname))return null;return u.origin;}catch{return null;}
}
export function pageMetadata(title,description,path,{index=true,image}={}) {
 const origin=siteOrigin();const url=origin?new URL(path,origin).href:undefined;
 return {title,description,robots:{index:!!origin&&index,follow:index},...(url?{alternates:{canonical:url}}:{}),openGraph:{type:"website",title,description,...(url?{url}:{}),siteName:"WayEcho",locale:"vi_VN",...(image&&origin?{images:[{url:new URL(image,origin).href,alt:title}]}:{})}};
}
export function jsonLd(data){return JSON.stringify(data).replace(/</g,"\\u003c");}
