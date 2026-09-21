"use client";

import { useState, useRef } from "react";
import { useA11y } from "./A11yProvider";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { MicIcon, WaveIcon, SpeakerIcon } from "./Icons";

// Chọn câu trả lời phù hợp nhất với nội dung người dùng nói (theo từ khóa trùng).
function bestMatch(text, samples) {
  const t = text.toLowerCase();
  let best = null, score = 0;
  for (const s of samples) {
    const words = s.utterance.toLowerCase().split(/\s+/);
    const hit = words.filter((w) => w.length > 2 && t.includes(w)).length;
    if (hit > score) { score = hit; best = s; }
  }
  return score > 0 ? best : null;
}

export default function VoiceBar({
  title = "Bạn muốn đi đâu ở Hà Nội?",
  hint = "Nhấn nút micro và nói, hoặc chọn một câu mẫu bên dưới.",
  samples = [],
}) {
  const { speak } = useA11y();
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [simListening, setSimListening] = useState(false);
  const timer = useRef(null);

  function handleResult(text) {
    setTranscript(text);
    const m = bestMatch(text, samples);
    const response = m
      ? m.response
      : `Bạn vừa nói: “${text}”. Tôi có thể giúp tìm điểm đến, đặt dịch vụ hoặc chỉ đường. Bạn muốn làm gì?`;
    setReply(response);
    speak(response);
  }

  const { supported, listening: realListening, start } = useSpeechRecognition({ onResult: handleResult });
  const listening = realListening || simListening;

  function respond(utterance, response) {
    setTranscript(utterance);
    setReply(response);
    speak(response);
  }

  function handleMic() {
    if (listening) return;
    setReply("");
    setTranscript("");
    if (supported) {
      speak("WayEcho đang nghe.");
      start();
      return;
    }
    // Fallback: trình duyệt không hỗ trợ nhận diện → mô phỏng
    setSimListening(true);
    speak("WayEcho đang nghe.");
    timer.current = setTimeout(() => {
      setSimListening(false);
      const s = samples[0] || { utterance: "Gợi ý điểm đến gần Hồ Gươm", response: "Gần Hồ Gươm có đền Ngọc Sơn và phố cổ. Bạn muốn nghe thông tin tiếp cận của điểm nào?" };
      respond(s.utterance, s.response);
    }, 1600);
  }

  return (
    <section aria-label="Trợ lý giọng nói" className="hc-surface rounded-[10px] border border-line bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      <p className="hc-muted mt-2 text-ink-soft">{hint}</p>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={handleMic}
          aria-pressed={listening}
          aria-label={listening ? "Đang nghe, nhấn để dừng" : "Nhấn để nói với WayEcho"}
          className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-ink transition-transform focus-visible:scale-105 ${
            listening ? "bg-primary listening-ring" : "bg-primary hover:bg-primary-hover"
          }`}
        >
          <MicIcon size={40} />
        </button>

        <div className="min-h-[6rem] flex-1 rounded-2xl bg-surface-alt p-4 hc-surface hc-border">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft hc-muted">
            <WaveIcon size={18} />
            {listening ? "Đang nghe…" : "Bạn nói"}
          </p>
          <p className="mt-1 text-lg text-ink hc-surface" aria-live="polite">
            {transcript || (listening ? "…" : "Chưa có câu nói nào.")}
          </p>

          {reply && (
            <div className="mt-3 border-t border-line pt-3 hc-border">
              <p className="flex items-center gap-2 text-sm font-semibold text-accent-dark">
                <SpeakerIcon size={18} /> WayEcho trả lời
              </p>
              <p className="mt-1 text-lg text-ink hc-surface">{reply}</p>
            </div>
          )}
          <p className="mt-2 text-xs text-ink-soft hc-muted">
            {supported ? "🎙️ Nhận diện giọng nói thật (cần cấp quyền micro, dùng Chrome/Edge)." : "Trình duyệt chưa hỗ trợ nhận diện giọng nói — đang dùng chế độ mô phỏng."}
          </p>
        </div>
      </div>

      {samples.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-ink-soft hc-muted">Câu nói mẫu</p>
          <ul className="flex flex-wrap gap-2">
            {samples.map((s, i) => (
              <li key={i}>
                <button type="button" onClick={() => respond(s.utterance, s.response)} className="chip hc-surface hc-border hover:bg-primary">
                  “{s.utterance}”
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
