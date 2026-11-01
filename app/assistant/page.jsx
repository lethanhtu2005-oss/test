"use client";

import { useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import VerifiedImage from "@/components/VerifiedImage";
import CameraCapture from "@/components/CameraCapture";
import { CameraIcon, SpeakerIcon, PhoneIcon, WaveIcon } from "@/components/Icons";

const SCENES = [
  { img: "/assets/images/old-quarter-street.jpg", alt: "Phố hẹp trong khu phố cổ Hà Nội với xe máy và hàng quán hai bên.", desc: "Demo mô tả: hình ảnh cho thấy một tuyến phố hẹp, có xe máy và hàng quán hai bên. Hệ thống không thể xác nhận khoảng cách hay vật cản thực tế chỉ từ ảnh demo.", confidence: "Trung bình" },
  { img: "/assets/images/cafe-street.jpg", alt: "Khu vực quán cà phê mặt phố với bàn ghế đặt gần lối đi.", desc: "Demo mô tả: có bàn ghế đặt gần khu vực lối đi. AI cần camera trực tiếp và vẫn có thể bỏ sót chướng ngại nhỏ hoặc vật đang chuyển động.", confidence: "Trung bình" },
  { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Temple_of_Literature%2C_Hanoi_by_Xiquinho_Silva_02.jpg/1280px-Temple_of_Literature%2C_Hanoi_by_Xiquinho_Silva_02.jpg", fallback: "/assets/images/location-image-unavailable.svg", alt: "Khuôn viên Văn Miếu – Quốc Tử Giám với kiến trúc mái ngói truyền thống và sân lát gạch.", desc: "Demo mô tả: đây là ảnh Văn Miếu – Quốc Tử Giám. AI có thể mô tả kiến trúc và cảnh quan nhìn thấy, nhưng không được tự kết luận lối đi có an toàn hoặc accessible hay không.", confidence: "Cao về nhận diện địa điểm, thấp về an toàn tuyến đi" },
];

export default function AssistantPage() {
  const { speak } = useA11y();
  const [scene, setScene] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [described, setDescribed] = useState(false);
  const current = SCENES[scene];

  function scan() { setScanning(true); setDescribed(false); speak("Đang phát mô tả viết sẵn cho ảnh mẫu. Chưa có phân tích AI thật."); setTimeout(() => { setScanning(false); setDescribed(true); speak(`${current.desc} Nhãn minh họa viết sẵn: ${current.confidence}.`); }, 900); }
  function nextScene() { setScene((scene + 1) % SCENES.length); setDescribed(false); }

  return (
    <div className="container-page py-10">
      <p className="font-semibold text-accent-dark">AI Camera / Vision Assistant</p>
      <h1 className="mt-1 text-4xl sm:text-5xl">Trợ lý mô tả hình ảnh</h1>
      <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">Tính năng này mô phỏng FR-12: zoom/OCR/mô tả cho người nhìn kém và người mù. AI là công cụ hỗ trợ, không phải hệ thống bảo đảm an toàn.</p>

      <p role="note" className="mt-4 rounded-xl border border-amber-400 p-4">Bạn có thể mở camera hoặc chọn ảnh để xem trước trên thiết bị. Chưa có nhận diện hình ảnh hay OCR thật, và ảnh của bạn không được gửi ra ngoài. Phần ví dụ bên dưới dùng ảnh mẫu với mô tả viết sẵn.</p>
      <CameraCapture />
      <h2 className="mt-10 text-2xl">Ví dụ mô tả với ảnh mẫu</h2>
      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-line bg-surface-alt shadow-card hc-border">
            <VerifiedImage src={current.img} fallback={current.fallback} alt={current.alt} className={`h-full w-full object-cover transition ${scanning ? "blur-[2px] brightness-75" : ""}`} />
            <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-white/80" aria-hidden="true" />
            {scanning && <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-white"><span className="flex items-center gap-2 rounded-pill bg-black/75 px-4 py-2 font-semibold"><WaveIcon size={20} /> Đang mở mô tả mẫu…</span></div>}
          </div>
          <div className="mt-4 flex flex-wrap gap-3"><button onClick={scan} className="btn-primary text-lg"><CameraIcon size={22} /> Mô tả ảnh demo</button><button onClick={nextScene} className="btn-ghost hc-border text-lg">Đổi cảnh</button></div>
        </div>

        <div>
          <div className="rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
            <p className="flex items-center gap-2 text-sm font-semibold text-accent-dark"><SpeakerIcon size={18} /> Kết quả mô tả</p>
            <p className="mt-2 min-h-[6rem] text-xl leading-relaxed" aria-live="polite">{described ? current.desc : "Nhấn “Mô tả ảnh demo” để xem cách hệ thống phản hồi."}</p>
            {described && <><p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-950">Nhãn minh họa, không do mô hình tính: {current.confidence}</p><button onClick={() => speak(`${current.desc} Nhãn minh họa viết sẵn: ${current.confidence}.`)} className="btn-ghost hc-border mt-3"><SpeakerIcon size={18} /> Nghe lại</button></>}
          </div>
          <div className="mt-5 rounded-[18px] bg-black p-6 text-white"><h2 className="text-2xl">AI không chắc? Chuyển sang người thật.</h2><p className="mt-2 text-neutral-300">Trong sản phẩm thật, Human Support có thể nhận request và chỉ nhận location/thông tin khi Traveler cấp quyền.</p><a href="/help" className="btn-primary mt-4 w-full text-lg"><PhoneIcon size={22} /> Mở kênh hỗ trợ</a></div>
        </div>
      </div>
    </div>
  );
}
