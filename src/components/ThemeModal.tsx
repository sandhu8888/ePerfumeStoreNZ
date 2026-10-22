import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Check, Palette, Sparkles, RefreshCw } from 'lucide-react';
import { ThemeId } from '../types';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4">
        {/* Header */}
        <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-black">
                  Boutique Luxury Themes
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-100 text-black border border-amber-300 font-bold">
                  Live Stylizer
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium">
                Select an aesthetic theme inspired by Gulf fragrance palaces and UAE luxury houses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-black rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close theme selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {availableThemes.map((theme) => {
            const isActive = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setTheme(theme.id as ThemeId)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isActive
                    ? 'border-black bg-stone-50 shadow-md ring-2 ring-black/10'
                    : 'border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Color Swatch Dots */}
                  <div className="flex -space-x-1 shrink-0 pt-0.5 sm:pt-0">
                    {theme.previewDots.map((dotColor, idx) => (
                      <span
                        key={idx}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: dotColor }}
                      />
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-black">
                        {theme.name}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black text-white flex items-center gap-1 shadow-xs">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-stone-700">
                      {theme.tagline}
                    </div>
                    <p className="text-xs text-stone-500 mt-1 max-w-md font-medium leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Preview CTA Button */}
                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(theme.id as ThemeId);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-white hover:bg-stone-100 text-black border border-stone-300'
                    }`}
                  >
                    {isActive ? 'Current Theme' : 'Apply Theme'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-600 flex items-center justify-between">
          <span className="text-[11px] font-medium">
            Theme changes are saved automatically to your device session.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black hover:bg-stone-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
