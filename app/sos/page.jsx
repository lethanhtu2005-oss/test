"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import { PhoneIcon, MapPinIcon, CheckIcon } from "@/components/Icons";

export default function SOSPage() {
  const { speak } = useA11y();
  const [contact, setContact] = useState("");
  const [locationStatus, setLocationStatus] = useState("Chưa yêu cầu quyền vị trí");
  const [active, setActive] = useState(false);

  useEffect(() => { try { setContact(localStorage.getItem("we-emergency") || ""); } catch (_) {} }, []);

  function startSOS() {
    setActive(true);
    speak("SOS demo đã được kích hoạt. WayEcho sẽ chỉ lấy vị trí nếu bạn cho phép. Bản demo không tự động gọi dịch vụ khẩn cấp.");
    if (!navigator.geolocation) { setLocationStatus("Thiết bị không hỗ trợ Geolocation"); return; }
    setLocationStatus("Đang chờ bạn cấp quyền vị trí…");
    navigator.geolocation.getCurrentPosition(
      () => setLocationStatus("Đã nhận vị trí trên thiết bị — bản demo không gửi vị trí ra ngoài."),
      () => setLocationStatus("Không có quyền hoặc không lấy được vị trí. SOS vẫn hiển thị trạng thái để bạn xử lý thủ công."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="container-page py-10">
      <p className="font-semibold text-red-700">Safety</p>
      <h1 className="mt-1 text-4xl sm:text-5xl">SOS & hỗ trợ khẩn cấp</h1>
      <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">Nút SOS phải nhanh, nhưng cũng phải minh bạch về quyền location và trạng thái xử lý. Bản demo này không tự gọi cơ quan khẩn cấp và không gửi vị trí tới máy chủ.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-[24px] bg-red-700 p-7 text-white" aria-labelledby="activate-sos">
          <h2 id="activate-sos" className="text-3xl">Cần trợ giúp?</h2>
          <p className="mt-2 text-red-100">Nhấn nút bên dưới để mô phỏng luồng SOS và yêu cầu quyền vị trí trên thiết bị.</p>
          <button type="button" onClick={startSOS} className="mt-6 flex min-h-[76px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 text-xl font-bold text-red-800 focus:outline-white"><PhoneIcon size={28} /> {active ? "SOS demo đang hoạt động" : "Kích hoạt SOS demo"}</button>
        </section>

        <section className="rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border" aria-labelledby="status-sos">
          <h2 id="status-sos" className="text-2xl">Trạng thái</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-surface-alt p-4 hc-surface hc-border"><MapPinIcon size={20} className="mt-1 shrink-0" /><div><p className="font-semibold">Vị trí</p><p className="hc-muted text-sm text-ink-soft">{locationStatus}</p></div></div>
            <div className="flex items-start gap-3 rounded-xl bg-surface-alt p-4 hc-surface hc-border"><CheckIcon size={20} className="mt-1 shrink-0" /><div><p className="font-semibold">Emergency contact</p><p className="hc-muted text-sm text-ink-soft">{contact || "Chưa thiết lập liên hệ khẩn cấp."}</p></div></div>
          </div>
          {!contact && <Link href="/profile" className="btn-primary mt-5">Thiết lập emergency contact</Link>}
        </section>
      </div>

      <div className="mt-6 rounded-[18px] border border-red-300 bg-red-50 p-5 text-red-950" role="note"><strong>Trong tình huống khẩn cấp thực tế:</strong> hãy sử dụng chức năng gọi điện của thiết bị hoặc dịch vụ khẩn cấp phù hợp tại nơi bạn đang ở. Không phụ thuộc vào bản demo WayEcho để đảm bảo an toàn.</div>
    </div>
  );
}
