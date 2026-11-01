// Icon SVG inline — nhẹ, sắc nét, tự đổi màu theo currentColor.
// Mỗi icon là trang trí (aria-hidden); nhãn nằm ở nút/label bao ngoài.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function MicIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

export function SpeakerIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function WaveIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <line x1="3" y1="12" x2="3" y2="12.01" />
      <line x1="7" y1="9" x2="7" y2="15" />
      <line x1="11" y1="5" x2="11" y2="19" />
      <line x1="15" y1="8" x2="15" y2="16" />
      <line x1="19" y1="10" x2="19" y2="14" />
      <line x1="23" y1="12" x2="23" y2="12.01" />
    </svg>
  );
}

export function SearchIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function MapPinIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function CalendarIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function CompassIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function CameraIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function UserIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function PhoneIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function CheckIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ContrastIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
    </svg>
  );
}

export function TextSizeIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

export function BedIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M2 17v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="M2 17h20M2 20v-3M22 20v-3" />
      <path d="M6 10V8a2 2 0 0 1 2-2h3v4" />
    </svg>
  );
}

export function FoodIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M4 3v7a2 2 0 0 0 2 2v9M6 3v6M3 3v6M18 3c-1.5 0-3 1.5-3 5s1.5 4 3 4v9" />
    </svg>
  );
}

export function TicketIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4z" />
      <path d="M13 6v12" strokeDasharray="2 2" />
    </svg>
  );
}

export function ActivityIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export function HeartIcon({ className = "", size = 24, filled = false }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export function PlusIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function TrashIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function GridIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function StarIcon({ className = "", size = 24, filled = true }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"}>
      <polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9" />
    </svg>
  );
}

export function AccessibleIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="4" r="2" />
      <path d="M5 8h14" />
      <path d="M12 6v8" />
      <path d="M9 22l3-8 3 8" />
    </svg>
  );
}

export function DownloadIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M12 3v12" />
      <polyline points="7 10 12 15 17 10" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function MenuIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}


export function BusIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect x="4" y="3" width="16" height="15" rx="3" />
      <path d="M7 18v3M17 18v3M4 10h16M8 6h8" />
      <circle cx="8" cy="15" r="1" /><circle cx="16" cy="15" r="1" />
    </svg>
  );
}

export function MuseumIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M3 9h18L12 3 3 9z" />
      <path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M2 18h20" />
    </svg>
  );
}

export function BookmarkIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  );
}

export function HeadphonesIcon({ className = "", size = 24 }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14h3v6H5a1 1 0 0 1-1-1v-5zM20 14h-3v6h2a1 1 0 0 0 1-1v-5z" />
    </svg>
  );
}
