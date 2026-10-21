import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  onClick,
  size = 'md'
}) => {
  const logoSrc = '/assets/aistudio/Firefly_Gemini_Flash_white_background_464260__1__221bda0c.png';

  const sizeClass = {
    sm: 'h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20'
  }[size];

  const isLight = variant === 'light';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none cursor-pointer group ${className}`}
      aria-label="ePerfume Store New Zealand - Elegance in Every Drop"
    >
      <div className={`relative flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-102 ${isLight ? 'p-1.5 rounded-xl bg-white/95 shadow-xs' : ''}`}>
        <img
          src={logoSrc}
          alt="E-Perfume Store - Elegance in Every Drop"
          className={`${sizeClass} w-auto object-contain ${
            isLight
              ? ''
              : 'mix-blend-multiply'
          }`}
          referrerPolicy="no-referrer"
        />
      </div>

      {variant !== 'compact' && (
        <div className="hidden sm:flex flex-col justify-center border-l border-stone-300/80 pl-2.5 py-0.5">
          <span className={`text-[10px] font-sans font-semibold uppercase tracking-widest ${isLight ? 'text-amber-400' : 'text-amber-800'}`}>
            Invercargill, NZ
          </span>
          <span className={`text-[9px] font-sans ${isLight ? 'text-stone-300' : 'text-stone-500'}`}>
            Naseem Perfumes UAE
          </span>
        </div>
      )}
    </div>
  );
};
