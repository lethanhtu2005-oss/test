"use client";
import { useA11y } from "./A11yProvider";
import { SpeakerIcon } from "./Icons";
export default function ReadButton({ text, label = "Nghe nội dung" }) {
  const { speak, stop } = useA11y();
  return (
    <div className="flex flex-wrap gap-2 my-5">
      <button className="btn-primary" type="button" onClick={() => speak(text)}>
        <SpeakerIcon size={20} />
        {label}
      </button>
      <button className="btn-ghost" type="button" onClick={stop}>
        Dừng đọc
      </button>
    </div>
  );
}
