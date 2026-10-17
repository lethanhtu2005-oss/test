"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Hook nhận diện giọng nói thật qua Web Speech API, có fallback khi không hỗ trợ.
export function useSpeechRecognition({ lang = "vi-VN", onResult } = {}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recRef = useRef(null);
  const cbRef = useRef(onResult);
  useEffect(() => { cbRef.current = onResult; }, [onResult]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    setSupported(true);
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.onresult = (e) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join(" ").trim();
      if (text && cbRef.current) cbRef.current(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => { setListening(false); setError("Không nhận được giọng nói. Hãy kiểm tra quyền micro hoặc nhập bằng bàn phím."); };
    recRef.current = rec;
    return () => { try { rec.abort(); } catch (_) {} };
  }, [lang]);

  const start = useCallback(() => {
    if (!recRef.current) return false;
    try { setError(""); recRef.current.start(); setListening(true); return true; }
    catch (_) { return false; }
  }, []);

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch (_) {}
    setListening(false);
  }, []);

  return { supported, listening, start, stop, error };
}
