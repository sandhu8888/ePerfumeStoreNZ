import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light';
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      aria-label="ePerfume Store New Zealand"
    >
      {/* Golden Flacon Crest Emblem */}
      <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-700 via-amber-600 to-amber-900 p-0.5 shadow-sm group-hover:shadow transition-shadow">
        <div className="w-full h-full rounded-[10px] bg-stone-900 flex items-center justify-center p-1.5 overflow-hidden relative">
          <svg
            viewBox="0 0 40 40"
            className="w-full h-full text-amber-300 transition-transform duration-300 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Perfume Cap */}
            <path
              d="M17 6h6v4h-6V6z"
              fill="currentColor"
            />
            {/* Atomizer / Collar */}
            <path
              d="M18 10h4v2h-4v-2z"
              fill="#FDE68A"
            />
            {/* Flacon Shoulder & Body */}
            <path
              d="M12 14c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2l2 15c0 3.3-2.7 6-6 6H16c-3.3 0-6-2.7-6-6l2-15z"
              stroke="currentColor"
              strokeWidth="2"
              fill="url(#goldGrad)"
            />
            {/* Inner Essence Liquid Level */}
            <path
              d="M13.5 22c2-1 4 1 6.5 0s4-1 6.5 0v6c0 2.2-1.8 4-4 4h-5c-2.2 0-4-1.8-4-4v-6z"
              fill="currentColor"
              fillOpacity="0.3"
            />
            {/* Center Crown Monogram 'eP' */}
            <path
              d="M17 25v-6h4a2 2 0 010 4h-4"
              stroke="#FFFBEB"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="goldGrad" x1="10" y1="12" x2="30" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" stopOpacity="0.4" />
                <stop stopColor="#B45309" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-serif font-bold tracking-tight ${variant === 'light' ? 'text-white' : 'text-stone-900'}`}>
            <span className="text-amber-600 font-semibold">e</span>Perfume
          </span>
          <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-amber-700">
            Store
          </span>
        </div>
        {variant !== 'compact' && (
          <span className={`text-[10px] font-sans font-medium tracking-wide ${variant === 'light' ? 'text-stone-300' : 'text-stone-500'}`}>
            Invercargill · Naseem UAE
          </span>
        )}
      </div>
    </div>
  );
};
