import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeId, ThemeDefinition } from '../types';

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal Dubai Gold',
    tagline: 'Imperial UAE Amber & Desert Gold',
    description: 'The signature royal fragrance house aesthetic. Warm glowing amber-gold accents with rich black calligraphy and ivory highlights.',
    primaryColor: '#d97706',
    accentColor: '#92400e',
    previewBg: 'bg-amber-50',
    previewDots: ['#d97706', '#f59e0b', '#78350f'],
    cssVariables: {
      primary: '#d97706',
      primaryHover: '#b45309',
      primaryText: '#000000',
      accent: '#92400e',
      badgeBg: '#fef3c7',
      badgeText: '#78350f',
      badgeBorder: '#fcd34d',
      tickerBg: '#fffbeb',
      tickerText: '#78350f',
      tickerBorder: '#fde68a',
      border: '#f3e8d2',
      surfaceSubtle: '#fffdfa'
    }
  },
  'arabian-emerald': {
    id: 'arabian-emerald',
    name: 'Sharjah Royal Emerald',
    tagline: 'Imperial Jewel Green & Gold Filigree',
    description: 'Inspired by royal palaces and rare botanical attars. Deep emerald tones paired with warm gold touches and crisp white surfaces.',
    primaryColor: '#059669',
    accentColor: '#064e3b',
    previewBg: 'bg-emerald-50',
    previewDots: ['#059669', '#10b981', '#064e3b'],
    cssVariables: {
      primary: '#059669',
      primaryHover: '#047857',
      primaryText: '#ffffff',
      accent: '#064e3b',
      badgeBg: '#ecfdf5',
      badgeText: '#064e3b',
      badgeBorder: '#a7f3d0',
      tickerBg: '#f0fdf4',
      tickerText: '#064e3b',
      tickerBorder: '#bbf7d0',
      border: '#e1f5eb',
      surfaceSubtle: '#f9fdfb'
    }
  },
  'rose-oud': {
    id: 'rose-oud',
    name: 'Damask Rose & Oud',
    tagline: 'Taif Rose Petals & Velvet Wine',
    description: 'A romantic, sensual palette evoking Persian Damask roses and precious aged oud oils with delicate blush rose gold accents.',
    primaryColor: '#e11d48',
    accentColor: '#881337',
    previewBg: 'bg-rose-50',
    previewDots: ['#e11d48', '#fb7185', '#881337'],
    cssVariables: {
      primary: '#e11d48',
      primaryHover: '#be123c',
      primaryText: '#ffffff',
      accent: '#881337',
      badgeBg: '#ffe4e6',
      badgeText: '#881337',
      badgeBorder: '#fecdd3',
      tickerBg: '#fff1f2',
      tickerText: '#881337',
      tickerBorder: '#fecdd3',
      border: '#ffe4e6',
      surfaceSubtle: '#fffafb'
    }
  },
  'sapphire-night': {
    id: 'sapphire-night',
    name: 'Arabian Sapphire',
    tagline: 'Prestige Indigo & Oceanic Frankincense',
    description: 'Crisp, distinguished maritime luxury. Noble sapphire blue with platinum accents, inspired by Gulf coast sea breezes and cool oud.',
    primaryColor: '#2563eb',
    accentColor: '#1e3a8a',
    previewBg: 'bg-blue-50',
    previewDots: ['#2563eb', '#3b82f6', '#1e3a8a'],
    cssVariables: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      primaryText: '#ffffff',
      accent: '#1e3a8a',
      badgeBg: '#dbeafe',
      badgeText: '#1e3a8a',
      badgeBorder: '#bfdbfe',
      tickerBg: '#eff6ff',
      tickerText: '#1e3a8a',
      tickerBorder: '#bfdbfe',
      border: '#dbeafe',
      surfaceSubtle: '#f8faff'
    }
  },
  'minimal-luxe': {
    id: 'minimal-luxe',
    name: 'Monochrome High-Luxe',
    tagline: 'Editorial Black & Pure White Canvas',
    description: 'Timeless architectural minimalism. Deep charcoal structure, crisp gallery white negative space, and amber subtle details.',
    primaryColor: '#1c1917',
    accentColor: '#44403c',
    previewBg: 'bg-stone-50',
    previewDots: ['#1c1917', '#78716c', '#d97706'],
    cssVariables: {
      primary: '#1c1917',
      primaryHover: '#292524',
      primaryText: '#ffffff',
      accent: '#44403c',
      badgeBg: '#f5f5f4',
      badgeText: '#1c1917',
      badgeBorder: '#d6d3d1',
      tickerBg: '#ffffff',
      tickerText: '#1c1917',
      tickerBorder: '#e7e5e4',
      border: '#e7e5e4',
      surfaceSubtle: '#fafaf9'
    }
  }
};

const THEME_STORAGE_KEY = 'eperfume_boutique_theme';

interface ThemeContextType {
  currentTheme: ThemeId;
  themeConfig: ThemeDefinition;
  setTheme: (themeId: ThemeId) => void;
  availableThemes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<ThemeId>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
      if (stored && THEMES[stored]) {
        return stored;
      }
    } catch {
      // fallback
    }
    return 'royal-gold'; // New default theme!
  });

  const setTheme = (themeId: ThemeId) => {
    if (THEMES[themeId]) {
      setCurrentThemeState(themeId);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, themeId);
      } catch {
        // ignore
      }
    }
  };

  const themeConfig = THEMES[currentTheme];

  // Apply CSS variables and data-theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);

    const vars = themeConfig.cssVariables;
    root.style.setProperty('--theme-primary', vars.primary);
    root.style.setProperty('--theme-primary-hover', vars.primaryHover);
    root.style.setProperty('--theme-primary-text', vars.primaryText);
    root.style.setProperty('--theme-accent', vars.accent);
    root.style.setProperty('--theme-badge-bg', vars.badgeBg);
    root.style.setProperty('--theme-badge-text', vars.badgeText);
    root.style.setProperty('--theme-badge-border', vars.badgeBorder);
    root.style.setProperty('--theme-ticker-bg', vars.tickerBg);
    root.style.setProperty('--theme-ticker-text', vars.tickerText);
    root.style.setProperty('--theme-ticker-border', vars.tickerBorder);
    root.style.setProperty('--theme-border', vars.border);
    root.style.setProperty('--theme-surface-subtle', vars.surfaceSubtle);
  }, [currentTheme, themeConfig]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeConfig,
        setTheme,
        availableThemes: Object.values(THEMES)
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
