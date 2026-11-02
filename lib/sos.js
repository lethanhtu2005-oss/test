export function networkMessage(online) {
  return online === false
    ? "Thiết bị đang ngoại tuyến. Nếu cần giúp ngay, hãy dùng chức năng gọi điện trực tiếp của thiết bị. WayEcho demo không gửi SOS."
    : "WayEcho demo không kết nối tới đầu nhận SOS thật.";
}

export function requestSOSLocation(geolocation, report, onSuccess) {
  if (!geolocation) {
    report("Thiết bị không hỗ trợ Geolocation.");
    return;
  }
  report("Đang chờ bạn cấp quyền vị trí…");
  try {
    geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos?.coords?.latitude ?? 0;
        const lng = pos?.coords?.longitude ?? 0;
        const accuracy = Math.round(pos?.coords?.accuracy || 0);
        report(`Đã xác định vị trí trên thiết bị: ${lat.toFixed(5)}, ${lng.toFixed(5)} (độ chính xác ±${accuracy}m) Nếu đã bấm SOS, vị trí sẽ được gửi tới máy chủ demo, không tới cứu hộ thật.`);
        if (onSuccess) onSuccess({ lat, lng, accuracy });
      },
      (error) => {
        const msg =
          error?.code === 1
            ? "Bạn đã từ chối quyền vị trí. Bạn vẫn có thể gọi trợ giúp thủ công."
            : error?.code === 3
            ? "Đã hết thời gian lấy vị trí. Hãy thử lại hoặc gọi trợ giúp thủ công."
            : "Không lấy được vị trí GPS. Hãy thử lại hoặc gọi trợ giúp thủ công.";
        report(msg);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  } catch {
    report("Không thể yêu cầu vị trí. Hãy gọi trợ giúp thủ công khi cần.");
  }
}

export async function sendSOSAlert({ lat, lng, accuracy, contact, message }) {
  try {
    const res = await fetch("/api/support/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng, accuracy, contact, message }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Chỉ biến thành link gọi khi có duy nhất một số đủ rõ trong liên hệ đã lưu.
export function emergencyPhone(contact) {
  if (typeof contact !== "string") return null;
  const candidates = (contact.match(/\+?\d[\d ().-]{6,23}\d/g) || [])
    .map((x) => x.replace(/[ ().-]/g, ""))
    .filter((x) => /^\+?\d{8,15}$/.test(x));
  return candidates.length === 1 ? candidates[0] : null;
}
