import React from 'react';

const Spinner: React.FC = () => {
  const dotCount = 8;
  const dots = [];

  for (let i = 0; i < dotCount; i++) {
    const style: React.CSSProperties = {
      transform: `rotate(${(360 / dotCount) * i}deg) translateY(24px)`,
      animationDelay: `${i * 0.1}s`,
    };
    dots.push(
      <div key={i} className="absolute inset-0 flex justify-center items-start" style={style}>
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-wave-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center text-center py-20" role="status" aria-live="polite">
      <span className="sr-only">Loading...</span>
      <div className="relative w-16 h-16">
        {dots}
      </div>
    </div>
  );
};

export default Spinner;
