"use client";
import { useEffect, useRef, useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import { cameraErrorMessage, cameraSupported } from "@/lib/camera";
import { CameraIcon } from "@/components/Icons";

// AI01/AI02/AI11: mở camera khi người dùng bấm, chụp hoặc chọn ảnh, xem trước, chụp lại.
// Ảnh chỉ nằm trong bộ nhớ trình duyệt; không tải lên và không giả kết quả nhận diện.
export default function CameraCapture() {
  const { speak } = useA11y();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [live, setLive] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLive(false);
  }
  function clearPhoto() {
    setPhoto((p) => { if (p?.objectUrl) URL.revokeObjectURL(p.url); return null; });
  }
  useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);
  // Gắn luồng camera khi thẻ video đã xuất hiện (không phụ thuộc animation frame, vẫn chạy khi tab bị ẩn).
  useEffect(() => {
    if (live && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play?.().catch(() => {});
    }
  }, [live]);

  function report(text, isError = false) {
    if (isError) { setError(text); setStatus(""); } else { setStatus(text); setError(""); }
    speak(text);
  }

  async function openCamera() {
    clearPhoto();
    if (!cameraSupported(navigator)) { report("Trình duyệt này không hỗ trợ mở camera. Bạn có thể chọn ảnh có sẵn.", true); return; }
    report("Đang chờ bạn cho phép dùng camera…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      setLive(true);
      report("Camera đã mở. Hướng camera về phía cần xem rồi bấm Chụp ảnh.");
    } catch (e) {
      stopCamera();
      report(cameraErrorMessage(e), true);
    }
  }

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) { report("Camera chưa sẵn sàng. Hãy đợi một chút rồi chụp lại.", true); return; }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setPhoto({ url: canvas.toDataURL("image/jpeg", 0.85), source: "camera" });
    stopCamera();
    report("Đã chụp ảnh. Ảnh chỉ nằm trên thiết bị của bạn. Bạn có thể chụp lại hoặc xóa ảnh.");
  }

  function pickFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { report("Tệp đã chọn không phải ảnh. Hãy chọn một tệp ảnh.", true); return; }
    stopCamera(); clearPhoto();
    setPhoto({ url: URL.createObjectURL(file), objectUrl: true, source: "file" });
    report("Đã chọn ảnh. Ảnh chỉ nằm trên thiết bị của bạn.");
  }

  return (
    <section className="mt-8 rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border" aria-labelledby="camera-heading">
      <h2 id="camera-heading" className="text-2xl">Ảnh từ camera của bạn</h2>
      <p className="hc-muted mt-2 text-ink-soft">Camera chỉ mở khi bạn bấm nút. Ảnh chỉ nằm trên thiết bị của bạn và <strong>không được gửi đi đâu</strong>. Nhận diện vật thể, mô tả cảnh và đọc chữ (OCR) cần tích hợp dịch vụ AI, hiện chưa có trong bản demo.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        {!live && <button type="button" onClick={openCamera} className="btn-primary"><CameraIcon size={20} /> {photo ? "Chụp lại" : "Mở camera"}</button>}
        {live && <button type="button" onClick={capture} className="btn-primary"><CameraIcon size={20} /> Chụp ảnh</button>}
        {live && <button type="button" onClick={() => { stopCamera(); report("Đã tắt camera."); }} className="btn-ghost hc-border">Tắt camera</button>}
        <label className="btn-ghost hc-border cursor-pointer">
          Chọn ảnh có sẵn
          <input type="file" accept="image/*" onChange={pickFile} className="sr-only" />
        </label>
        {photo && <button type="button" onClick={() => { clearPhoto(); report("Đã xóa ảnh khỏi màn hình."); }} className="btn-ghost hc-border">Xóa ảnh</button>}
      </div>

      <p role="status" aria-live="polite" className="mt-3 min-h-[1.5rem]">{status}</p>
      {error && <p role="alert" className="text-red-800">{error}</p>}

      {live && <video ref={videoRef} playsInline muted aria-label="Hình ảnh trực tiếp từ camera" className="mt-3 aspect-[4/3] w-full rounded-2xl bg-black object-cover" />}
      {photo && (
        <figure className="mt-3">
          <img src={photo.url} alt={photo.source === "camera" ? "Ảnh bạn vừa chụp, chưa được mô tả tự động" : "Ảnh bạn vừa chọn, chưa được mô tả tự động"} className="max-h-[50vh] w-full rounded-2xl object-contain" />
          <figcaption className="mt-2 text-sm">Chưa có mô tả tự động cho ảnh này vì dịch vụ AI chưa được tích hợp. Nếu cần, hãy nhờ người thân hoặc kênh hỗ trợ mô tả giúp.</figcaption>
        </figure>
      )}
    </section>
  );
}
