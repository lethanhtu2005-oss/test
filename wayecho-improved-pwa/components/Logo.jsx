// Logo WayEcho: icon ghim + sóng âm (ảnh thật do nhóm thiết kế) + wordmark
// "Way" (đậm) và "Echo" (cam). Bản `dark` (footer nền tối) dùng icon vẽ SVG
// để không lộ nền trắng của ảnh PNG.

const ORANGE = "#e0692c";

function DrawnMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke={ORANGE} strokeWidth="2.4" strokeLinecap="round">
      <path d="M16 30c5-6 9-10 9-15a9 9 0 0 0-18 0c0 5 4 9 9 15z" />
      <circle cx="16" cy="15" r="2.4" fill={ORANGE} stroke="none" />
      <path d="M11.5 12a5 5 0 0 0 0 6M9 10a8 8 0 0 0 0 10M20.5 12a5 5 0 0 1 0 6M23 10a8 8 0 0 1 0 10" />
    </svg>
  );
}

export default function Logo({ tagline = false, className = "", height = 34, dark = false }) {
  const iconSize = Math.round(height * 1.1);
  const wordColor = dark ? "#ffffff" : "#212529";

  return (
    <span className={`inline-flex flex-col ${className}`} role="img" aria-label="WayEcho — Hear Your Way">
      <span className="inline-flex items-center gap-2">
        {dark ? (
          <DrawnMark size={iconSize} />
        ) : (
          <img src="/assets/brand/logo.png" alt="" aria-hidden="true" width={iconSize} height={iconSize} style={{ height: iconSize, width: iconSize, objectFit: "contain" }} />
        )}
        <span className="font-display font-bold leading-none tracking-tight" style={{ fontSize: height }}>
          <span style={{ color: wordColor }}>Way</span>
          <span style={{ color: ORANGE }}>Echo</span>
        </span>
      </span>
      {tagline && (
        <span className="mt-1 pl-1 text-[11px] font-bold tracking-[0.35em]" style={{ color: dark ? "#9a938c" : "#6b6560" }}>
          HEAR YOUR WAY
        </span>
      )}
    </span>
  );
}

// Icon tròn cho nơi cần icon nhỏ (nền tối) — bản vẽ, không nền.
export function EchoDotIcon({ size = 32 }) {
  return <DrawnMark size={size} />;
}
