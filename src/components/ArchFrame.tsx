/**
 * A hand-drawn pointed (ogee) arch that frames the hero — the mihrab silhouette,
 * rendered as a thin gilded line. Purely decorative.
 */
export function ArchFrame() {
  return (
    <svg
      className="arch-frame"
      viewBox="0 0 400 620"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="archgold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4c879" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#e0a64e" stopOpacity="0.5" />
          <stop offset="1" stopColor="#2f9e93" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* outer arch */}
      <path
        d="M40 620 L40 300 C40 160 110 70 200 30 C290 70 360 160 360 300 L360 620"
        stroke="url(#archgold)"
        strokeWidth="1.5"
      />
      {/* inner arch */}
      <path
        d="M70 620 L70 310 C70 185 125 105 200 70 C275 105 330 185 330 310 L330 620"
        stroke="url(#archgold)"
        strokeWidth="1"
        opacity="0.6"
      />
      {/* apex flourish */}
      <path
        d="M200 30 C205 14 205 14 200 0 C195 14 195 14 200 30"
        stroke="#f4c879"
        strokeWidth="1.2"
      />
      <circle cx="200" cy="48" r="3" fill="#f4c879" />
    </svg>
  );
}
