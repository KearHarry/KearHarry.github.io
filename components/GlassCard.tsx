import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/70 
        backdrop-blur-xl 
        border border-white/20 
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        rounded-3xl 
        p-6 
        transition-all duration-500 ease-out
        ${hoverEffect ? 'hover:scale-[1.02] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Subtle gradient overlay for lighting effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
