import React, { useState } from 'react';
import { Product } from '../types';

interface PerfumeIllustrationProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const PerfumeIllustration: React.FC<PerfumeIllustrationProps> = ({
  product,
  className = '',
  size = 'md'
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Height mappings for consistent aspect ratio
  const heightClass = {
    sm: 'h-40',
    md: 'h-64',
    lg: 'h-80',
    hero: 'h-96 md:h-[480px]'
  }[size];

  // Specific visual styling based on product category & alcohol-free nature
  const isOil = product.category === 'perfume-oil';
  const isFreshener = product.category === 'home-freshener';
  const isMen = product.category === 'for-men';
  const isWomen = product.category === 'for-women';

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-gradient-to-b from-[#F5F1EB] to-[#ECE6DC] flex items-center justify-center p-4 group ${className}`}>
      {/* Background ambient radial glow */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${product.accentColor || '#D97706'}33 0%, transparent 70%)`
        }}
      />

      {/* Decorative luxury Islamic geometric / arabesque subtle lines */}
      <svg
        className="absolute inset-0 w-full h-full text-stone-900/[0.03] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M0 0 L50 50 L100 0 Z M0 100 L50 50 L100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
      </svg>

      {/* Attempt real product photo with strict error fallback */}
      {!imageFailed && product.image ? (
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        /* Bespoke Luxury Flacon Illustration Vector */
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 w-full h-full">
          {/* UAE Naseem Badge */}
          <div className="text-[11px] font-serif tracking-widest text-amber-700/80 mb-2 uppercase">
            {product.arabicName || 'عطور نسيم دبي'}
          </div>

          {/* SVG Flacon Silhouette */}
          <div className="relative w-28 h-36 flex items-center justify-center my-auto transition-transform duration-300 group-hover:-translate-y-1">
            {isOil ? (
              /* Concentrated Perfume Oil Attar Flacon */
              <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id={`goldGrad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>
                  <linearGradient id={`glassGrad-${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                {/* Crystal Faceted Finial/Dropper */}
                <polygon points="50,5 57,20 43,20" fill={`url(#goldGrad-${product.id})`} />
                <rect x="47" y="20" width="6" height="10" fill={`url(#goldGrad-${product.id})`} />
                {/* Gold Ornate Collar */}
                <rect x="36" y="30" width="28" height="8" rx="2" fill={`url(#goldGrad-${product.id})`} />
                {/* Attar Flacon Body */}
                <path
                  d="M32 38 L68 38 L76 110 C76 118 70 125 50 125 C30 125 24 118 24 110 Z"
                  fill={`url(#glassGrad-${product.id})`}
                  stroke={`url(#goldGrad-${product.id})`}
                  strokeWidth="2.5"
                />
                {/* Dropper Wand inside */}
                <line x1="50" y1="30" x2="50" y2="105" stroke="#B45309" strokeWidth="2" strokeDasharray="4 2" />
                {/* Arabic Emblem Seal */}
                <circle cx="50" cy="75" r="14" fill="#92400E" fillOpacity="0.15" stroke="#B45309" strokeWidth="1" />
                <text x="50" y="78" textAnchor="middle" fontSize="8" fill="#78350F" fontFamily="serif">NASEEM</text>
              </svg>
            ) : isFreshener ? (
              /* Home Ambient Room Freshener Spray */
              <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id={`freshGrad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>
                </defs>
                {/* Fine Mist Sprayer Nozzle */}
                <path d="M42 12 H58 V22 H42 Z" fill="#D97706" />
                <path d="M58 14 H66 V18 H58 Z" fill="#B45309" />
                {/* Bottle Neck */}
                <rect x="44" y="22" width="12" height="10" fill="#94A3B8" />
                {/* Sleek Tall Cylinder Bottle */}
                <rect x="28" y="32" width="44" height="98" rx="6" fill={`url(#freshGrad-${product.id})`} stroke="#64748B" strokeWidth="1.5" />
                {/* Luxury Label */}
                <rect x="33" y="55" width="34" height="52" rx="3" fill="#FFFDF8" stroke="#D97706" strokeWidth="1" />
                <text x="50" y="72" textAnchor="middle" fontSize="6.5" fill="#78350F" fontWeight="bold">NASEEM</text>
                <text x="50" y="81" textAnchor="middle" fontSize="5" fill="#B45309">AIR FRESHENER</text>
                <text x="50" y="94" textAnchor="middle" fontSize="4.5" fill="#64748B">300ml</text>
              </svg>
            ) : (
              /* Luxury Eau De Parfum Spray Bottle */
              <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id={`perfumeGrad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#D97706" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                {/* Heavy Metal Cap */}
                <rect x="38" y="10" width="24" height="22" rx="2" fill={isMen ? '#292524' : '#D97706'} stroke="#78350F" strokeWidth="1" />
                <rect x="43" y="32" width="14" height="6" fill="#F59E0B" />
                {/* Flacon Glass Shoulder & Body */}
                <path
                  d="M26 38 H74 C76 38 78 40 78 42 V118 C78 122 75 125 71 125 H29 C25 125 22 122 22 118 V42 C22 40 24 38 26 38 Z"
                  fill={`url(#perfumeGrad-${product.id})`}
                  stroke={isMen ? '#44403C' : '#B45309'}
                  strokeWidth="2"
                />
                {/* Internal Dip Tube */}
                <line x1="50" y1="36" x2="50" y2="120" stroke="#78350F" strokeWidth="1.5" strokeDasharray="3 1" opacity="0.6" />
                {/* Gold Embossed Emblem */}
                <rect x="34" y="62" width="32" height="36" rx="2" fill="#1C1917" stroke="#F59E0B" strokeWidth="1" />
                <text x="50" y="78" textAnchor="middle" fontSize="6" fill="#FDE68A" fontFamily="serif" fontWeight="bold">NASEEM</text>
                <text x="50" y="87" textAnchor="middle" fontSize="4.5" fill="#E5E7EB">PARFUM</text>
              </svg>
            )}
          </div>

          {/* Volume and Longevity indicator */}
          <div className="text-[11px] font-sans text-stone-600 flex items-center justify-center gap-1.5 mt-auto">
            <span className="font-medium text-stone-800">{product.volume}</span>
            <span>·</span>
            <span>{product.alcoholFree ? 'Alcohol-Free' : 'Luxury Perfume'}</span>
          </div>
        </div>
      )}

      {/* Alcohol-Free Assurance Tag at bottom left */}
      {product.alcoholFree && (
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-[10px] text-amber-200 font-sans tracking-wide">
          100% Alcohol-Free
        </div>
      )}
    </div>
  );
};
