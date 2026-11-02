// Hệ thống phản hồi đa giác quan (Âm thanh Web Audio API + Rung Haptic có điều kiện)
// Tuân thủ X-09: luôn kiểm tra navigator.vibrate an toàn trên iOS Safari và có âm thanh/TTS song hành.

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => null);
  }
  return audioCtx;
}

function isAudioFeedbackEnabled() {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem("we-feedback-audio") !== "0";
  } catch {
    return true;
  }
}

function isHapticFeedbackEnabled() {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem("we-feedback-haptic") !== "0";
  } catch {
    return true;
  }
}

// 1. Web Audio API Synthesis
export function playChirp() {
  if (!isAudioFeedbackEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now); // 880 Hz
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12); // 120ms

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // Không ném lỗi nếu trình duyệt chặn autoplay trước tương tác
  }
}

export function playDingDong() {
  if (!isAudioFeedbackEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Ding (523 Hz - C5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);

    // Dong (659 Hz - E5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659, now + 0.15);
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.45);
  } catch {}
}

export function playWarningBeep() {
  if (!isAudioFeedbackEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(350, now); // 350 Hz
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2); // 200ms

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch {}
}

// 2. Haptic Feedback có điều kiện (Safe for iOS Safari & Android)
export function vibrate(pattern = [50]) {
  if (!isHapticFeedbackEnabled()) return false;
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      return navigator.vibrate(pattern);
    }
  } catch {}
  return false;
}

// 3. Dispatchers kết hợp
export function feedbackAction() {
  playChirp();
  vibrate([40]);
}

export function feedbackSuccess() {
  playDingDong();
  vibrate([60, 40, 80]);
}

export function feedbackWarning() {
  playWarningBeep();
  vibrate([150, 60, 150]);
}

export const feedback = {
  chirp: playChirp,
  dingDong: playDingDong,
  warning: playWarningBeep,
  action: feedbackAction,
  success: feedbackSuccess,
  vibrate,
};
