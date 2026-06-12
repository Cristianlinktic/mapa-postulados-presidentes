"use client";

import { useStore } from "@/lib/store";

const themes = ['General'] as const;

const themeIcons: Record<string, string> = {
  General: '◈',
  Seguridad: '⬡',
  Economía: '◇',
  Paz: '◯',
};

export function ThemeFilter() {
  const currentTheme = useStore((state) => state.currentTheme);
  const setCurrentTheme = useStore((state) => state.setCurrentTheme);

  return (
    <div
      className="flex gap-1 p-1 rounded-lg bg-[--color-surface-elevated] border border-[--color-panel-border]"
    >
      {themes.map((theme) => {
        const isActive = currentTheme === theme;
        return (
          <button
            key={theme}
            id={`theme-filter-${theme.toLowerCase()}`}
            onClick={() => setCurrentTheme(theme)}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-300 border
              ${isActive ? 'bg-[--color-surface] border-[--color-panel-border] text-[--color-accent] font-bold shadow-sm' : 'bg-transparent border-transparent text-[--color-text-secondary] font-normal hover:text-[--color-text-primary]'}
            `}
            style={{
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {isActive && <div className="w-2 h-2 rounded-full bg-[--color-accent] animate-pulse" />}
            <span className={`transition-all duration-300 ${isActive ? 'text-[--color-accent] scale-110' : 'text-current opacity-50'} `} style={{ fontSize: '10px' }}>
              {themeIcons[theme]}
            </span>
            {theme}
          </button>
        );
      })}
    </div>
  );
}
