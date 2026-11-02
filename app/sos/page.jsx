"use client";

import { useEffect, useState } from "react";
import { requestSOSLocation, networkMessage, emergencyPhone, sendSOSAlert } from "@/lib/sos";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import { PhoneIcon, MapPinIcon, CheckIcon } from "@/components/Icons";

export default function SOSPage() {
  const { speak } = useA11y();
  const [contact, setContact] = useState("");
  const [shareContact, setShareContact] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Chưa yêu cầu quyền vị trí");
  const [active, setActive] = useState(false);
  const [online, setOnline] = useState(true);
  const [serverAlertStatus, setServerAlertStatus] = useState("");

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    try {
      setContact(localStorage.getItem("we-emergency") || "");
    } catch (_) {}
  }, []);

  function startSOS() {
    setActive(true);
    speak("Đang lấy vị trí. Nếu được cấp quyền, vị trí sẽ được gửi đến máy chủ demo WayEcho. Không có đầu nhận cứu hộ thật.");
    requestSOSLocation(navigator.geolocation, setLocationStatus, async (coords) => {
      setServerAlertStatus("Đang gửi tọa độ tới máy chủ demo WayEcho…");
      const res = await sendSOSAlert({
        lat: coords.lat,
        lng: coords.lng,
        accuracy: coords.accuracy,
        contact: shareContact ? contact : "",
        shareContact,
        message: "Yêu cầu hỗ trợ khẩn cấp từ ứng dụng WayEcho Phố Cổ",
      });
      if (res?.ok) {
        setServerAlertStatus("Đã lưu tọa độ vào máy chủ demo. Không có nhân viên cứu hộ nhận tín hiệu này.");
        speak("Tọa độ đã được lưu trong bản demo, không gửi tới cứu hộ. Hãy gọi số khẩn cấp tại địa phương nếu cần hỗ trợ thật.");
      } else {
        setServerAlertStatus("Không thể kết nối máy chủ WayEcho. Hãy dùng nút gọi điện thoại bên dưới.");
      }
    });
  }

  const phone = emergencyPhone(contact);

  return (
    <div className="container-page py-10">
      <p className="font-semibold text-red-700">Safety</p>
      <h1 className="mt-1 text-4xl sm:text-5xl">SOS demo</h1>
      <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">
        Bạn có thể chủ động chia sẻ vị trí với máy chủ demo trên trang này. WayEcho chưa có tổng đài trực hoặc dịch vụ cứu hộ; tín hiệu này không được gửi tới lực lượng khẩn cấp.
      </p>

      <p className="mt-4 text-red-900" role="status">
        {networkMessage(online)}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-[24px] bg-red-700 p-7 text-white" aria-labelledby="activate-sos">
          <h2 id="activate-sos" className="text-3xl">Cần trợ giúp khẩn cấp?</h2>
          <p className="mt-2 text-red-100">
            Khi bấm nút, trình duyệt sẽ xin quyền vị trí rồi gửi tọa độ tới máy chủ demo WayEcho. Tín hiệu không được chuyển tới cứu hộ.
          </p>
          <label className="mt-4 flex items-start gap-3 rounded-xl bg-red-800 p-3 text-sm text-white">
            <input type="checkbox" checked={shareContact} onChange={(e) => setShareContact(e.target.checked)} className="mt-1 h-5 w-5" />
            <span>Cho phép gửi số liên hệ đã lưu cùng tọa độ vào máy chủ demo.</span>
          </label>
          <button
            type="button"
            onClick={startSOS}
            className="mt-6 flex min-h-[76px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 text-xl font-bold text-red-800 shadow-xl focus:outline-white"
          >
            <PhoneIcon size={28} /> {active ? "SOS đang hoạt động" : "Kích hoạt SOS ngay"}
          </button>

          <div className="mt-6 space-y-3">
            <a
              href="tel:115"
              className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-black px-4 font-bold text-white shadow-md hover:bg-neutral-800"
            >
              <PhoneIcon size={22} /> 📞 Gọi khẩn cấp Cấp cứu 115
            </a>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl border-2 border-white bg-transparent px-4 font-bold text-white hover:bg-white/10"
              >
                <PhoneIcon size={22} /> 📞 Gọi người thân ({phone})
              </a>
            )}
          </div>
        </section>

        <section className="rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border" aria-labelledby="status-sos">
          <h2 id="status-sos" className="text-2xl">Trạng thái SOS</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-surface-alt p-4 hc-surface hc-border">
              <MapPinIcon size={20} className="mt-1 shrink-0" />
              <div>
                <p className="font-semibold">Vị trí GPS</p>
                <p role="status" className="hc-muted text-sm text-ink-soft">
                  {locationStatus}
                </p>
              </div>
            </div>

            {serverAlertStatus && (
              <div className="flex items-start gap-3 rounded-xl bg-surface-alt p-4 hc-surface hc-border">
                <CheckIcon size={20} className="mt-1 shrink-0 text-green-700" />
                <div>
                  <p className="font-semibold">Bản ghi demo</p>
                  <p role="status" className="hc-muted text-sm text-ink-soft">
                    {serverAlertStatus}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-xl bg-surface-alt p-4 hc-surface hc-border">
              <CheckIcon size={20} className="mt-1 shrink-0" />
              <div>
                <p className="font-semibold">Liên hệ khẩn cấp đã lưu</p>
                <p className="hc-muted text-sm text-ink-soft">
                  {contact || "Chưa thiết lập liên hệ khẩn cấp."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <p className="max-w-md text-sm text-ink-soft hc-muted">WayEcho chưa có tổng đài hỗ trợ trực. Chỉ dùng số liên hệ do bạn tự xác minh.</p>
            {!contact && (
              <Link href="/profile" className="btn-ghost hc-border flex min-h-[56px] items-center">
                Thiết lập liên hệ khẩn cấp
              </Link>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 rounded-[18px] border border-red-300 bg-red-50 p-5 text-red-950" role="note">
        <strong>Lưu ý an toàn:</strong> Trong tình huống nguy hiểm đe dọa sức khỏe hoặc an toàn tính mạng, luôn bấm gọi ngay cho đầu số khẩn cấp quốc gia (115 Cấp cứu / 113 Cảnh sát). WayEcho chưa kết nối tổng đài hoặc lực lượng cứu hộ. Tín hiệu và tọa độ gửi ở đây chỉ được lưu trong bản demo.
      </div>
    </div>
  );
}
