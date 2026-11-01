import {siteOrigin} from "@/lib/seo";
import {destinations} from "@/data/destinations";
import {articles} from "@/data/articles";
export default function sitemap(){const origin=siteOrigin();if(!origin)return [];return ["/","/explore","/destination","/help","/articles","/services/guide-dogs","/partners/business","/partners/guide","/partners/cooperate",...destinations.map(d=>`/destination?d=${encodeURIComponent(d.slug)}`),...articles.map(a=>`/articles/${a.slug}`)].map(path=>({url:new URL(path,origin).href}));}
