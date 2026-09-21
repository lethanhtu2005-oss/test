"use client";

import { useEffect, useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import { UserIcon, SpeakerIcon, AccessibleIcon, PhoneIcon, CheckIcon } from "@/components/Icons";

const GROUPS = [
  { title: "Visual", items: [["largeText", "Large Text — Chữ lớn"], ["highContrast", "High Contrast — Tương phản cao"], ["magnification", "Screen Magnification — Phóng to màn hình"], ["colorAdjust", "Color Adjustment — Điều chỉnh màu sắc"]] },
  { title: "Audio", items: [["screenReader", "Screen Reader — Đọc màn hình"], ["audioDescription", "Audio Description — Mô tả âm thanh"], ["voiceNavigation", "Voice Navigation — Điều hướng giọng nói"], ["voiceCommand", "Voice Command — Điều khiển giọng nói"]] },
  { title: "Mobility", items: [["stepFree", "Step-free Access — Lối không bậc"], ["elevator", "Elevator Access — Thang máy"], ["staff", "Staff Assistance — Nhân viên hỗ trợ"], ["mobility", "Mobility Assistance — Hỗ trợ di chuyển"]] },
  { title: "Travel Assistance", items: [["checkin", "Check-in Assistance — Hỗ trợ check-in"], ["navigation", "Navigation Assistance — Hỗ trợ tìm đường"], ["transport", "Transport Assistance — Hỗ trợ lên/xuống phương tiện"], ["attraction", "Attraction Assistance — Hỗ trợ tại điểm tham quan"]] },
];

const DEFAULT_PREFS = { screenReader: true, audioDescription: true, staff: true, navigation: true };

export default function ProfilePage() {
  const { speak, contrast, largeText, setContrastEnabled, setLargeTextEnabled, speechRate, setSpeechRate } = useA11y();
  const [userType, setUserType] = useState("lowvision");
  const [emergency, setEmergency] = useState("");
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [shareWithBusiness, setShareWithBusiness] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setUserType(localStorage.getItem("we-usertype") || "lowvision");
      setEmergency(localStorage.getItem("we-emergency") || "");
      const savedPrefs = JSON.parse(localStorage.getItem("we-access-prefs") || "null");
      if (savedPrefs) setPrefs(savedPrefs);
      setShareWithBusiness(localStorage.getItem("we-share-business") !== "0");
    } catch (_) {}
  }, []);

  function togglePref(id) { setPrefs((p) => ({ ...p, [id]: !p[id] })); setSaved(false); }
  function save() {
    try {
      localStorage.setItem("we-usertype", userType);
      localStorage.setItem("we-emergency", emergency);
      localStorage.setItem("we-access-prefs", JSON.stringify(prefs));
      localStorage.setItem("we-share-business", shareWithBusiness ? "1" : "0");
    } catch (_) {}
    setContrastEnabled(!!prefs.highContrast);
    setLargeTextEnabled(!!prefs.largeText);
    setSaved(true);
    speak("Đã lưu và áp dụng hồ sơ tiếp cận. Bạn vẫn có thể thay đổi các tùy chọn bất kỳ lúc nào.");
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-ink"><UserIcon size={34} /></span>
        <div><h1 className="text-4xl">Hồ sơ tiếp cận</h1><p className="hc-muted text-ink-soft">Lưu điều bạn thường cần; mỗi booking vẫn cho phép chọn lại yêu cầu sẽ chia sẻ.</p></div>
      </div>

      <section aria-labelledby="user-type" className="mt-8 rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
        <h2 id="user-type" className="text-2xl">1. Loại hồ sơ</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Loại người dùng">
          {[["lowvision", "Low Vision — Người nhìn kém", "Ưu tiên chữ lớn, tương phản, phóng to và giọng đọc."], ["blind", "Blind — Người mù", "Ưu tiên screen reader, voice navigation, audio feedback và bàn phím."]].map(([id, label, desc]) => (
            <label key={id} className={`cursor-pointer rounded-2xl border p-4 hc-border ${userType === id ? "border-primary bg-surface-alt hc-surface" : "border-line"}`}>
              <span className="flex items-start gap-3"><input type="radio" name="usertype" checked={userType === id} onChange={() => { setUserType(id); setSaved(false); }} className="mt-1 h-5 w-5 accent-[#f8ae38]" /><span><span className="block text-lg font-semibold">{label}</span><span className="hc-muted mt-1 block text-sm text-ink-soft">{desc}</span></span></span>
            </label>
          ))}
        </div>
      </section>

      <section aria-labelledby="prefs" className="mt-6 rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><h2 id="prefs" className="flex items-center gap-2 text-2xl"><AccessibleIcon size={22} /> 2. My Accessibility Preferences</h2><p className="hc-muted mt-1 text-sm text-ink-soft">Có thể chọn nhiều tùy chọn cùng lúc.</p></div><span className="chip hc-surface hc-border">{Object.values(prefs).filter(Boolean).length} tùy chọn đang bật</span></div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {GROUPS.map((group) => (
            <fieldset key={group.title} className="rounded-2xl border border-line p-4 hc-border">
              <legend className="px-2 font-bold">{group.title}</legend>
              <div className="mt-2 space-y-2">
                {group.items.map(([id, label]) => (
                  <label key={id} className="flex min-h-[48px] cursor-pointer items-center justify-between gap-3 rounded-xl px-2 hover:bg-surface-alt">
                    <span>{label}</span><input type="checkbox" checked={!!prefs[id]} onChange={() => togglePref(id)} className="h-5 w-5 shrink-0 accent-[#f8ae38]" />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section aria-labelledby="display" className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
          <h2 id="display" className="flex items-center gap-2 text-2xl"><SpeakerIcon size={22} /> 3. Giọng nói & hiển thị</h2>
          <label htmlFor="rate" className="mt-5 block font-semibold">Tốc độ đọc: {speechRate.toFixed(1)}×</label>
          <input id="rate" type="range" min="0.6" max="1.6" step="0.1" value={speechRate} onChange={(e) => setSpeechRate(Number(e.target.value))} className="mt-2 w-full accent-[#f8ae38]" />
          <button type="button" onClick={() => speak("Đây là tốc độ đọc hiện tại của WayEcho.")} className="btn-ghost hc-border mt-3"><SpeakerIcon size={18} /> Nghe thử</button>
          <div className="mt-5 space-y-3">
            <label className="flex items-center justify-between rounded-xl border border-line p-3 hc-border"><span className="font-semibold">Tương phản cao</span><input type="checkbox" checked={contrast} onChange={(e) => { setContrastEnabled(e.target.checked); setPrefs((p) => ({ ...p, highContrast: e.target.checked })); setSaved(false); }} className="h-5 w-5 accent-[#f8ae38]" /></label>
            <label className="flex items-center justify-between rounded-xl border border-line p-3 hc-border"><span className="font-semibold">Chữ lớn</span><input type="checkbox" checked={largeText} onChange={(e) => { setLargeTextEnabled(e.target.checked); setPrefs((p) => ({ ...p, largeText: e.target.checked })); setSaved(false); }} className="h-5 w-5 accent-[#f8ae38]" /></label>
          </div>
        </div>

        <div className="rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
          <h2 className="flex items-center gap-2 text-2xl"><PhoneIcon size={22} /> 4. Quyền riêng tư & liên hệ khẩn cấp</h2>
          <label htmlFor="emg" className="mt-5 block font-semibold">Emergency contact</label>
          <input id="emg" value={emergency} onChange={(e) => { setEmergency(e.target.value); setSaved(false); }} placeholder="Tên và số điện thoại người thân" autoComplete="tel" className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-lg outline-none hc-surface hc-border" />
          <label className="mt-5 flex items-start gap-3 rounded-xl border border-line p-4 hc-border">
            <input type="checkbox" checked={shareWithBusiness} onChange={(e) => { setShareWithBusiness(e.target.checked); setSaved(false); }} className="mt-1 h-5 w-5 accent-[#f8ae38]" />
            <span><span className="block font-semibold">Cho phép đề xuất Accessibility Request từ hồ sơ</span><span className="hc-muted mt-1 block text-sm text-ink-soft">Business chỉ nên nhận các thông tin cần thiết cho dịch vụ đã đặt và chỉ sau khi bạn xác nhận.</span></span>
          </label>
          <p className="hc-muted mt-3 text-sm text-ink-soft">Trong bản demo, dữ liệu này được lưu cục bộ trên thiết bị. Hệ thống thật phải áp dụng bảo mật và phân quyền cho location, itinerary, contact và accessibility profile.</p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} className="btn-primary text-lg"><CheckIcon size={20} /> Lưu preferences</button>
        {saved && <span role="status" className="font-semibold text-green-800">Đã lưu trên thiết bị.</span>}
      </div>
    </div>
  );
}
