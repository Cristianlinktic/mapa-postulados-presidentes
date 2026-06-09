---
name: frontend-premium-ui
description: Guidelines for maintaining a premium dashboard aesthetic, including glassmorphism, color palettes, and typography. Use this when adding new UI components to the electoral platform.
---

# Frontend Premium UI

This skill provides guidelines to maintain a premium, high-end dashboard aesthetic for the Colombia Electoral Intelligence Platform.

## 1. Design Philosophy
- **Dark Mode First:** Always use `bg-zinc-950` as the base canvas.
- **Glassmorphism:** Use `.glass-panel` for all cards and containers to create depth.
- **Contrast & Hierarchy:** Use zinc-scale grays for text to maintain readability while keeping high-contrast whites for focal points.

## 2. Core Utilities
Always use these classes to ensure consistency:

- **Containers:** `.glass-panel` (rounded-2xl, backdrop-blur, subtle gradient background).
- **Headings:** `premium-text` (for candidate names or critical labels).
- **Small Labels:** `.section-title` (uppercase, tracking-widest, text-zinc-500, font-bold, text-xs).

## 3. Typography
- **Primary Font:** Inter (via Next.js font config).
- **Labels:** Always use the `section-title` utility.
- **Values:** Use `premium-text` or standard `font-bold` for metrics.

## 4. Components
- **Dashboard Widgets:** All widgets should be wrapped in a `div` with the `glass-panel` class.
- **Borders:** Use `border-zinc-700/50` or `border-zinc-800`.
- **Charts:** Ensure Recharts use the dark theme (`#18181b` tooltips, `#27272a` grids).

## 5. Workflow
When adding new components:
1. Wrap the root container in `.glass-panel`.
2. Apply `p-6` for standard padding.
3. Use `.section-title` for all sub-labels.
4. Keep the color palette consistent with zinc-950 (backgrounds) and zinc-100 (primary text).
