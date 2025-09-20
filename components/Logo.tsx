import React from 'react';

const Logo: React.FC = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67E8F9" /> {/* cyan-300 */}
        <stop offset="100%" stopColor="#22D3EE" /> {/* cyan-400 */}
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <circle cx="12" cy="12" r="10" fill="url(#logo-gradient)" />
    <g>
      <path
        d="M8.5 16.5L15.5 12L8.5 7.5V16.5Z"
        fill="white"
        fillOpacity="0.4"
      />
      <path
        d="M9.5 16.5L16.5 12L9.5 7.5V16.5Z"
        fill="white"
        fillOpacity="0.7"
      />
      <path
        d="M10.5 16.5L17.5 12L10.5 7.5V16.5Z"
        fill="white"
      />
    </g>
  </svg>
);

export default Logo;