import React from 'react';

export default function Loader({ fullScreen = true, text = "Loading..." }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6 animate-fade-in">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-[#00C896]/20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-0 rounded-full border border-[#00C896]/30"></div>
        
        {/* Inner spinning broken ring */}
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-[#00C896] border-l-[#00C896] animate-spin" style={{ animationDuration: '0.8s' }}></div>
        
        {/* Center glowing dot */}
        <div className="w-3 h-3 rounded-full bg-[#00C896] shadow-[0_0_15px_#00C896] animate-pulse"></div>
      </div>
      
      {text && (
        <p className="text-[#00C896] text-[11px] font-bold tracking-[0.2em] uppercase animate-pulse opacity-80">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#08090A] pt-16 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="py-20 flex items-center justify-center">
      {content}
    </div>
  );
}
