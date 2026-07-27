import React from 'react';

interface NyayaSetuLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  width?: number | string;
  height?: number | string;
  showText?: boolean;
}

export const NyayaSetuLogo: React.FC<NyayaSetuLogoProps> = ({
  className = '',
  size = 'md',
  width,
  height,
  showText = true,
}) => {
  // Sizing defaults
  let sizeDimensions = 'w-16 h-16';
  if (size === 'sm') sizeDimensions = 'w-10 h-10';
  if (size === 'md') sizeDimensions = 'w-20 h-20';
  if (size === 'lg') sizeDimensions = 'w-48 h-48';
  if (size === 'xl') sizeDimensions = 'w-64 h-64';
  if (size === 'custom') sizeDimensions = '';

  const styleOverride = width && height ? { width, height } : {};

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${sizeDimensions} ${className}`}
      style={styleOverride}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Watercolor Background Gradient Filters */}
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <linearGradient id="bridgeBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          <linearGradient id="bridgeOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Watercolor Background Blobs */}
          <filter id="blurSplash" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="25" result="blur" />
          </filter>
        </defs>

        {/* Watercolor Texture Backplate */}
        <g opacity="0.65" filter="url(#blurSplash)">
          {/* Top Left Peach / Orange Splash */}
          <path
            d="M 120 180 C 60 120, 100 40, 200 60 C 280 80, 260 180, 180 200 Z"
            fill="#fed7aa"
          />
          {/* Top Right Sky Blue Splash */}
          <path
            d="M 320 160 C 260 80, 380 40, 440 120 C 480 200, 380 240, 320 180 Z"
            fill="#bae6fd"
          />
          {/* Bottom Pink Splash */}
          <path
            d="M 100 320 C 40 280, 80 440, 200 420 C 300 400, 220 300, 120 340 Z"
            fill="#fbcfe8"
          />
          {/* Bottom Green Splash */}
          <path
            d="M 280 340 C 240 420, 380 460, 420 380 C 460 300, 360 280, 300 340 Z"
            fill="#bbf7d0"
          />
        </g>

        {/* 1. Rising Sun (Left Side) */}
        <g transform="translate(110, 175)">
          {/* Sun Body */}
          <circle cx="0" cy="0" r="42" fill="url(#sunGrad)" />
          {/* Sun Rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <polygon
              key={deg}
              points="0,-48 -7,-62 7,-62"
              fill="#f59e0b"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>

        {/* 2. City Skyline (Right Side) */}
        <g fill="#3b82f6" opacity="0.85" transform="translate(370, 110)">
          {/* Building 1 */}
          <rect x="0" y="20" width="30" height="70" rx="3" fill="#d97706" />
          <rect x="6" y="30" width="7" height="9" fill="#fef3c7" />
          <rect x="17" y="30" width="7" height="9" fill="#fef3c7" />
          <rect x="6" y="45" width="7" height="9" fill="#fef3c7" />
          <rect x="17" y="45" width="7" height="9" fill="#fef3c7" />
          <rect x="6" y="60" width="7" height="9" fill="#fef3c7" />
          <rect x="17" y="60" width="7" height="9" fill="#fef3c7" />

          {/* Building 2 */}
          <rect x="34" y="40" width="22" height="50" rx="2" fill="#2563eb" />
          <rect x="39" y="48" width="5" height="7" fill="#e0f2fe" />
          <rect x="47" y="48" width="5" height="7" fill="#e0f2fe" />
          <rect x="39" y="60" width="5" height="7" fill="#e0f2fe" />
          <rect x="47" y="60" width="5" height="7" fill="#e0f2fe" />
        </g>

        {/* 3. Orange Suspension Bridge Layer (Back Truss) */}
        <path
          d="M 50 220 Q 250 80 450 220 L 450 235 Q 250 100 50 235 Z"
          fill="url(#bridgeOrange)"
        />
        {/* Truss Pillars */}
        <line x1="160" y1="160" x2="160" y2="230" stroke="#d97706" strokeWidth="6" />
        <line x1="210" y1="130" x2="210" y2="230" stroke="#d97706" strokeWidth="6" />
        <line x1="290" y1="130" x2="290" y2="230" stroke="#d97706" strokeWidth="6" />
        <line x1="340" y1="160" x2="340" y2="230" stroke="#d97706" strokeWidth="6" />

        {/* Diagonal Bridge Cables */}
        <line x1="250" y1="85" x2="160" y2="225" stroke="#f59e0b" strokeWidth="3" />
        <line x1="250" y1="85" x2="210" y2="225" stroke="#f59e0b" strokeWidth="3" />
        <line x1="250" y1="85" x2="290" y2="225" stroke="#f59e0b" strokeWidth="3" />
        <line x1="250" y1="85" x2="340" y2="225" stroke="#f59e0b" strokeWidth="3" />

        {/* 4. Blue Primary Bridge Arch */}
        {/* Main Arch Cable */}
        <path
          d="M 40 240 Q 250 110 460 240 L 460 260 Q 250 135 40 260 Z"
          fill="url(#bridgeBlue)"
        />
        {/* Bridge Pillars (Pylons) */}
        <polygon points="100,280 125,180 145,180 120,280" fill="url(#bridgeBlue)" />
        <polygon points="380,280 355,180 375,180 400,280" fill="url(#bridgeBlue)" />
        <polygon points="230,280 242,100 258,100 270,280" fill="url(#bridgeBlue)" />

        {/* Bridge Lower Deck Line */}
        <path
          d="M 30 280 Q 250 170 470 280 L 470 298 Q 250 190 30 298 Z"
          fill="url(#bridgeBlue)"
        />

        {/* 5. Central Ashoka Chakra */}
        <g transform="translate(250, 260)">
          {/* Chakra Outer Circle */}
          <circle cx="0" cy="0" r="52" fill="none" stroke="#1e3a8a" strokeWidth="8" />
          <circle cx="0" cy="0" r="44" fill="none" stroke="#2563eb" strokeWidth="2" />
          <circle cx="0" cy="0" r="10" fill="#1e3a8a" />

          {/* 24 Spokes of Ashoka Chakra */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2="0"
              y2="-44"
              stroke="#1e3a8a"
              strokeWidth="2.5"
              transform={`rotate(${i * 15})`}
            />
          ))}

          {/* Golden Ring Enclosing Chakra */}
          <circle cx="0" cy="0" r="58" fill="none" stroke="#f59e0b" strokeWidth="4" />
        </g>

        {/* 6. Scales of Justice (Left and Right Pans) */}
        {/* Left Scale Pan */}
        <g transform="translate(185, 260)">
          <path d="M -30,0 L 30,0 L 0,-15 Z" fill="#1e3a8a" />
          <line x1="-25" y1="0" x2="-20" y2="35" stroke="#1e3a8a" strokeWidth="2" />
          <line x1="25" y1="0" x2="20" y2="35" stroke="#1e3a8a" strokeWidth="2" />
          <line x1="0" y1="-15" x2="0" y2="35" stroke="#1e3a8a" strokeWidth="2" />
          <path d="M -28,35 Q 0,55 28,35 Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="2" />
        </g>

        {/* Right Scale Pan */}
        <g transform="translate(315, 260)">
          <path d="M -30,0 L 30,0 L 0,-15 Z" fill="#1e3a8a" />
          <line x1="-25" y1="0" x2="-20" y2="35" stroke="#1e3a8a" strokeWidth="2" />
          <line x1="25" y1="0" x2="20" y2="35" stroke="#1e3a8a" strokeWidth="2" />
          <line x1="0" y1="-15" x2="0" y2="35" stroke="#1e3a8a" strokeWidth="2" />
          <path d="M -28,35 Q 0,55 28,35 Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="2" />
        </g>

        {/* 7. Typography Below Emblem */}
        {showText && (
          <g>
            {/* English Branding */}
            <text
              x="250"
              y="385"
              textAnchor="middle"
              fill="#1e3a8a"
              fontSize="44"
              fontWeight="900"
              letterSpacing="2"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              JUSTICE VOICE
            </text>

            {/* Devanagari Hindi Branding */}
            <text
              x="250"
              y="450"
              textAnchor="middle"
              fill="#1e3a8a"
              fontSize="44"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              न्याय वाणी
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
