"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { feedback } from "@/lib/feedback";

const A11yContext = createContext(null);
export function useA11y() { const ctx = useContext(A11yContext); if (!ctx) throw new Error("useA11y phải nằm trong A11yProvider"); return ctx; }

export default function A11yProvider({ children }) {
  const [prefsReady,setPrefsReady]=useState(false);
  const [contrast, setContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [minimalDom, setMinimalDom] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [speechRate, setSpeechRateState] = useState(1);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      setContrast(localStorage.getItem("dl-contrast") === "1");
      setLargeText(localStorage.getItem("dl-textsize") === "large");
      setReduceMotion(localStorage.getItem("dl-motion") === "reduce");
      setMinimalDom(localStorage.getItem("dl-minimal") === "1");
      setAudioFeedback(localStorage.getItem("we-feedback-audio") !== "0");
      setHapticFeedback(localStorage.getItem("we-feedback-haptic") !== "0");
      const savedRate = Number(localStorage.getItem("we-speech-rate"));
      if (savedRate >= 0.6 && savedRate <= 1.6) setSpeechRateState(savedRate);
    } catch (_) {}
    setPrefsReady(true);
  }, []);

  useEffect(() => { if(!prefsReady)return; const el = document.documentElement; reduceMotion ? el.setAttribute("data-reduce", "reduce") : el.removeAttribute("data-reduce"); try { localStorage.setItem("dl-motion", reduceMotion ? "reduce" : "no"); } catch (_) {} }, [reduceMotion,prefsReady]);
  useEffect(() => { if(!prefsReady)return; const el = document.documentElement; contrast ? el.setAttribute("data-contrast", "high") : el.removeAttribute("data-contrast"); try { localStorage.setItem("dl-contrast", contrast ? "1" : "0"); } catch (_) {} }, [contrast,prefsReady]);
  useEffect(() => { if(!prefsReady)return; const el = document.documentElement; largeText ? el.setAttribute("data-textsize", "large") : el.removeAttribute("data-textsize"); try { localStorage.setItem("dl-textsize", largeText ? "large" : "normal"); } catch (_) {} }, [largeText,prefsReady]);
  useEffect(() => { if(!prefsReady)return; const el = document.documentElement; minimalDom ? el.setAttribute("data-minimal", "true") : el.removeAttribute("data-minimal"); try { localStorage.setItem("dl-minimal", minimalDom ? "1" : "0"); } catch (_) {} }, [minimalDom,prefsReady]);
  useEffect(() => { if(!prefsReady)return; try { localStorage.setItem("we-feedback-audio", audioFeedback ? "1" : "0"); } catch (_) {} }, [audioFeedback,prefsReady]);
  useEffect(() => { if(!prefsReady)return; try { localStorage.setItem("we-feedback-haptic", hapticFeedback ? "1" : "0"); } catch (_) {} }, [hapticFeedback,prefsReady]);

  const setSpeechRate = useCallback((rate) => { const safe = Math.max(0.6, Math.min(1.6, Number(rate) || 1)); setSpeechRateState(safe); try { localStorage.setItem("we-speech-rate", String(safe)); } catch (_) {} }, []);

  const applyVisualProfile = useCallback((type) => {
    if (type === "lowvision") {
      setContrast(true);
      setLargeText(true);
      setMinimalDom(false);
    } else if (type === "blind" || type === "total_blind") {
      setMinimalDom(true);
    }
  }, []);

  const speak = useCallback((text) => {
    if (!text) return;
    setAnnouncement("");
    window.requestAnimationFrame(() => setAnnouncement(text));
    try {
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "vi-VN";
        u.rate = speechRate;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }
    } catch (_) {}
  }, [speechRate]);

  const value = {
    contrast, largeText, reduceMotion, minimalDom, audioFeedback, hapticFeedback, speechRate, feedback,
    toggleContrast: () => setContrast((v) => !v),
    toggleLargeText: () => setLargeText((v) => !v),
    toggleMinimalDom: () => setMinimalDom((v) => !v),
    setContrastEnabled: (enabled) => setContrast(Boolean(enabled)),
    setLargeTextEnabled: (enabled) => setLargeText(Boolean(enabled)),
    setMinimalDomEnabled: (enabled) => setMinimalDom(Boolean(enabled)),
    setAudioFeedbackEnabled: (enabled) => setAudioFeedback(Boolean(enabled)),
    setHapticFeedbackEnabled: (enabled) => setHapticFeedback(Boolean(enabled)),
    applyVisualProfile,
    toggleReduceMotion: () => setReduceMotion((v) => !v),
    setSpeechRate, speak,
    stop: () => { try { window.speechSynthesis?.cancel(); } catch (_) {} },
  };

  return <A11yContext.Provider value={value}>{children}<div aria-live="assertive" role="status" className="sr-only">{announcement}</div></A11yContext.Provider>;
}
