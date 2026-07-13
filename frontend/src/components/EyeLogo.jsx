import React from 'react';

const EyeLogo = ({ className = '' }) => {
  return (
    <svg 
      className={`eye-logo ${className}`} 
      viewBox="0 0 100 60" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <pattern id="starfield" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.5" fill="#ffffff" opacity="0.8"/>
          <circle cx="15" cy="5" r="0.8" fill="#ffffff" opacity="0.6"/>
          <circle cx="8" cy="18" r="0.4" fill="#ffffff" opacity="0.9"/>
          <circle cx="18" cy="15" r="0.6" fill="#ffffff" opacity="0.5"/>
          <circle cx="4" cy="12" r="0.7" fill="#ffffff" opacity="0.7"/>
          <circle cx="12" cy="10" r="0.5" fill="#ffffff" opacity="0.8"/>
        </pattern>
        <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eab308" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#a16207" stopOpacity="0.9"/>
        </radialGradient>
      </defs>
      
      {/* Sclera (Eye white part) - Black with stars */}
      <path 
        d="M50 5 C80 5 95 30 95 30 C95 30 80 55 50 55 C20 55 5 30 5 30 C5 30 20 5 50 5 Z" 
        fill="#030303" 
        stroke="#eab308" 
        strokeWidth="4"
      />
      <path 
        d="M50 5 C80 5 95 30 95 30 C95 30 80 55 50 55 C20 55 5 30 5 30 C5 30 20 5 50 5 Z" 
        fill="url(#starfield)" 
      />

      {/* Iris/Pupil - Globe Emoji */}
      <text x="50" y="30" fontSize="28" textAnchor="middle" dominantBaseline="central" alignmentBaseline="middle">🌏</text>
    </svg>
  );
};

export default EyeLogo;
