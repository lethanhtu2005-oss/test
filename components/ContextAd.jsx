import { adsForContext } from "@/data/ads";
import AdCard from "./AdCard";
export default function ContextAd({ context }) {
  const ad = adsForContext(context)[0];
  return ad ? <AdCard ad={ad} /> : null;
}
