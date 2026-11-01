import Link from "next/link";
export default function SOSLink() {
  return <Link href="/sos" aria-label="SOS — mở hỗ trợ khẩn cấp (demo)" className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border-2 border-red-700 bg-white px-3 font-bold text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">SOS</Link>;
}
