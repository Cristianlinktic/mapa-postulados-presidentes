"use client";

import { useStore } from "@/lib/store";

const themes = ['General', 'Seguridad', 'Economía', 'Paz'] as const;

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
      className="flex gap-1 p-1 rounded-lg"
      style={{
        background: 'rgba(4,6,13,0.6)',
        border: '1px solid rgba(201,168,76,0.1)',
      }}
    >
      {themes.map((theme) => {
        const isActive = currentTheme === theme;
        return (
          <button
            key={theme}
            id={`theme-filter-${theme.toLowerCase()}`}
            onClick={() => setCurrentTheme(theme)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200"
            style={{
              background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
              color: isActive ? 'var(--color-gold)' : 'rgba(241,240,237,0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <span style={{ opacity: isActive ? 1 : 0.5, fontSize: '9px' }}>
              {themeIcons[theme]}
            </span>
            {theme}
          </button>
        );
      })}
    </div>
  );
}
