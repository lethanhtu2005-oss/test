"use client";
import { useA11y } from "./A11yProvider";
export default function ThemeToggle() {
  const { theme, toggleTheme } = useA11y();
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
      aria-label="Giao diện tối"
      title="Chuyển giao diện sáng / tối"
    >
      <span aria-hidden="true">◐</span>
      <span className="theme-label">Sáng / Tối</span>
    </button>
  );
}
