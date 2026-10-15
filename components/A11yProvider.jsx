"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const A11yContext = createContext(null);
export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y phải nằm trong A11yProvider");
  return ctx;
}

export default function A11yProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState("light");
  const [contrast, setContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [speechRate, setSpeechRateState] = useState(1);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      setTheme(document.documentElement.dataset.theme || "light");
      setContrast(localStorage.getItem("dl-contrast") === "1");
      setLargeText(localStorage.getItem("dl-textsize") === "large");
      setReduceMotion(localStorage.getItem("dl-motion") === "reduce");
      const savedRate = Number(localStorage.getItem("we-speech-rate"));
      if (savedRate >= 0.6 && savedRate <= 1.6) setSpeechRateState(savedRate);
    } catch (_) {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = document.documentElement;
    reduceMotion
      ? el.setAttribute("data-reduce", "reduce")
      : el.removeAttribute("data-reduce");
    try {
      localStorage.setItem("dl-motion", reduceMotion ? "reduce" : "no");
    } catch (_) {}
  }, [reduceMotion, ready]);
  useEffect(() => {
    if (!ready) return;
    const el = document.documentElement;
    contrast
      ? el.setAttribute("data-contrast", "high")
      : el.removeAttribute("data-contrast");
    try {
      localStorage.setItem("dl-contrast", contrast ? "1" : "0");
    } catch (_) {}
  }, [contrast, ready]);
  useEffect(() => {
    if (!ready) return;
    const el = document.documentElement;
    largeText
      ? el.setAttribute("data-textsize", "large")
      : el.removeAttribute("data-textsize");
    try {
      localStorage.setItem("dl-textsize", largeText ? "large" : "normal");
    } catch (_) {}
  }, [largeText, ready]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      try {
        if (!localStorage.getItem("we-theme"))
          setTheme(media.matches ? "dark" : "light");
      } catch (_) {}
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);
  useEffect(() => {
    if (ready) document.documentElement.dataset.theme = theme;
  }, [theme, ready]);
  const toggleTheme = () =>
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("we-theme", next);
      } catch (_) {}
      return next;
    });
  const setSpeechRate = useCallback((rate) => {
    const safe = Math.max(0.6, Math.min(1.6, Number(rate) || 1));
    setSpeechRateState(safe);
    try {
      localStorage.setItem("we-speech-rate", String(safe));
    } catch (_) {}
  }, []);

  const speak = useCallback(
    (text) => {
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
    },
    [speechRate],
  );

  const value = {
    theme,
    toggleTheme,
    contrast,
    largeText,
    reduceMotion,
    speechRate,
    toggleContrast: () => setContrast((v) => !v),
    toggleLargeText: () => setLargeText((v) => !v),
    setContrastEnabled: (enabled) => setContrast(Boolean(enabled)),
    setLargeTextEnabled: (enabled) => setLargeText(Boolean(enabled)),
    toggleReduceMotion: () => setReduceMotion((v) => !v),
    setSpeechRate,
    speak,
    stop: () => {
      try {
        window.speechSynthesis?.cancel();
      } catch (_) {}
    },
  };

  return (
    <A11yContext.Provider value={value}>
      {children}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </A11yContext.Provider>
  );
}
