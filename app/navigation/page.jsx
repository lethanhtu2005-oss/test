"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useA11y } from "@/components/A11yProvider";
import { destinations } from "@/data/destinations";
import { CompassIcon, SpeakerIcon, MapPinIcon } from "@/components/Icons";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-surface-alt text-ink-soft">
      Đang tải bản đồ…
    </div>
  ),
});

const POINTS = destinations
  .filter((d) => d.coordinates)
  .map((d) => ({
    id: d.slug,
    name: d.name,
    lat: d.coordinates.lat,
    lng: d.coordinates.lng,
    level: d.access.level,
    href: `/destination/${d.slug}`,
  }));

// Tuyến chỉ để minh hoạ UI. Không phải dữ liệu route đã khảo sát accessibility.
const ROUTE = [
  [21.031578, 105.853047],
  [21.0309, 105.853],
  [21.030297, 105.853086],
];
const STEPS = [
  {
    d: "Xác nhận điểm xuất phát và đích đến trước khi bắt đầu.",
    meta: "Bước minh hoạ — cần GPS và dữ liệu route thực tế",
  },
  {
    d: "Ứng dụng đọc hướng rẽ và khoảng cách khi nhà cung cấp bản đồ trả về dữ liệu.",
    meta: "Không giả lập chướng ngại chưa được xác minh",
  },
  {
    d: "Nếu gặp giao cắt hoặc chướng ngại không có dữ liệu, dừng và yêu cầu hỗ trợ con người.",
    meta: "Ưu tiên an toàn",
    hazard: true,
  },
  {
    d: "Khi tới gần điểm đích, ứng dụng đọc tên địa điểm và lối vào nếu lối vào đã được xác minh.",
    meta: "Entrance là dữ liệu accessibility riêng",
  },
];

export default function NavigationPage() {
  const { speak } = useA11y();
  const [active, setActive] = useState(0);
  function playStep(i) {
    setActive(i);
    speak(`Bước ${i + 1}. ${STEPS[i].d}`);
  }
  function startGuide() {
    speak(
      "Đây là tuyến điều hướng minh họa, không phải chỉ dẫn an toàn thời gian thực. Hãy xác minh môi trường thực tế và yêu cầu hỗ trợ khi cần.",
    );
    playStep(0);
  }

  return (
    <div className="container-page py-10">
      <p className="font-semibold text-accent-dark">Accessible Map · Demo</p>
      <h1 className="mt-1 text-4xl sm:text-5xl">
        Bản đồ & điều hướng bằng giọng nói
      </h1>
      <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">
        Các pin dùng tọa độ điểm đến đã đối chiếu. Đường nét đứt và các bước bên
        dưới chỉ minh họa cách giao diện hoạt động; không phải tuyến accessible
        đã khảo sát hay cảnh báo giao thông thời gian thực.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div
            className="h-[360px] overflow-hidden rounded-[18px] border border-line shadow-card hc-border"
            role="region"
            aria-label="Bản đồ OpenStreetMap các điểm đến Hà Nội; tuyến nét đứt là tuyến minh họa, không phải chỉ dẫn an toàn."
          >
            <MapView
              points={POINTS}
              route={ROUTE}
              center={[21.032, 105.846]}
              zoom={13}
            />
          </div>
          <p className="hc-muted mt-2 text-xs text-ink-soft">
            Nguồn nền bản đồ: OpenStreetMap. Nhãn accessibility trên pin phản
            ánh trạng thái dữ liệu của WayEcho, không phải chứng nhận an toàn.
          </p>
          <button onClick={startGuide} className="btn-primary mt-4 text-lg">
            <CompassIcon size={22} /> Nghe cách điều hướng hoạt động
          </button>
          <div
            className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950"
            role="alert"
          >
            <strong>Quan trọng:</strong> bản demo không biết xe đang tới, đèn
            tín hiệu đang hoạt động hay phía trước có vật cản. Không dùng các
            bước minh họa này để qua đường.
          </div>
        </div>

        <div>
          <h2 className="text-2xl">Luồng voice navigation dự kiến</h2>
          <ol className="mt-4 space-y-3">
            {STEPS.map((s, i) => (
              <li
                key={s.d}
                className={`rounded-2xl border p-4 hc-surface hc-border ${active === i ? "border-primary bg-surface-alt" : "border-line bg-white"}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${s.hazard ? "bg-orange-600 text-white" : "bg-primary text-ink"}`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{s.d}</p>
                    <p className="hc-muted mt-1 flex items-center gap-1 text-sm text-ink-soft">
                      <MapPinIcon size={14} /> {s.meta}
                    </p>
                  </div>
                  <button
                    onClick={() => playStep(i)}
                    className="btn-ghost hc-border !min-h-[40px] !p-2"
                    aria-label={`Nghe bước ${i + 1}`}
                  >
                    <SpeakerIcon size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
