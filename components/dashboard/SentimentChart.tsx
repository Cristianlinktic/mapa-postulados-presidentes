"use client";

import { sentimentData } from '@/lib/data/sentimentData';
import { Activity } from 'lucide-react';

const CHART_H = 120;
const CHART_W_PERCENT = 100;
const PAD_LEFT = 24;
const PAD_RIGHT = 8;
const PAD_TOP = 8;
const PAD_BOTTOM = 24;

function buildPath(data: typeof sentimentData, key: 'Cepeda' | 'Espriella', width: number) {
  const allValues = data.flatMap((d) => [d.Cepeda, d.Espriella]);
  const minVal = Math.min(...allValues) - 3;
  const maxVal = Math.max(...allValues) + 3;
  const range = maxVal - minVal || 1;

  const innerW = width - PAD_LEFT - PAD_RIGHT;
  const innerH = CHART_H - PAD_TOP - PAD_BOTTOM;

  const points = data.map((d, i) => {
    const x = PAD_LEFT + (i / (data.length - 1)) * innerW;
    const y = PAD_TOP + innerH - ((d[key] - minVal) / range) * innerH;
    return `${x},${y}`;
  });

  return {
    path: `M ${points.join(' L ')}`,
    areaPath: `M ${points.join(' L ')} L ${PAD_LEFT + innerW},${PAD_TOP + innerH} L ${PAD_LEFT},${PAD_TOP + innerH} Z`,
    points: data.map((d, i) => ({
      x: PAD_LEFT + (i / (data.length - 1)) * innerW,
      y: PAD_TOP + innerH - ((d[key] - minVal) / range) * innerH,
      value: d[key],
      day: d.day,
    })),
    minVal,
    maxVal,
    innerH,
    innerW,
  };
}

export function SentimentChart() {
  // Use a fixed width for SSR compatibility; SVG is responsive via viewBox
  const chartWidth = 280;

  const cepedaData = buildPath(sentimentData, 'Cepeda', chartWidth);
  const espriellaData = buildPath(sentimentData, 'Espriella', chartWidth);
  const innerH = CHART_H - PAD_TOP - PAD_BOTTOM;
  const innerW = chartWidth - PAD_LEFT - PAD_RIGHT;

  // Y axis labels
  const yLabels = [cepedaData.maxVal, Math.round((cepedaData.maxVal + cepedaData.minVal) / 2), cepedaData.minVal];

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Activity size={12} style={{ color: 'var(--color-gold)', opacity: 0.7 }} />
        <div className="section-label">Evolución de sentimiento</div>
      </div>
      <h2 className="display-title text-base text-[#F1F0ED] mb-3 leading-none">
        Curva histórica
      </h2>

      <div className="gold-divider" />

      {/* Legend */}
      <div className="flex gap-4 mt-3 mb-3">
        {[
          { name: 'Cepeda', color: 'var(--color-cepeda)' },
          { name: 'Espriella', color: 'var(--color-espriella)' },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded-full" style={{ background: item.color }} />
            <span className="mono-data text-[9px] uppercase tracking-widest"
              style={{ color: 'rgba(241,240,237,0.5)' }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${CHART_H}`}
          width="100%"
          height={CHART_H}
          preserveAspectRatio="none"
          aria-label="Gráfico de evolución de sentimiento"
        >
          <defs>
            <linearGradient id="grad-cepeda" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16,185,129,0.25)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0)" />
            </linearGradient>
            <linearGradient id="grad-espriella" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(96,165,250,0.2)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0)" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.5, 1].map((t) => (
            <line
              key={t}
              x1={PAD_LEFT}
              y1={PAD_TOP + t * innerH}
              x2={PAD_LEFT + innerW}
              y2={PAD_TOP + t * innerH}
              stroke="rgba(201,168,76,0.07)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          ))}

          {/* Y axis labels */}
          {yLabels.map((label, i) => (
            <text
              key={i}
              x={PAD_LEFT - 4}
              y={PAD_TOP + (i * innerH) / 2 + 3}
              textAnchor="end"
              fontSize="7"
              fontFamily="JetBrains Mono, monospace"
              fill="rgba(241,240,237,0.25)"
            >
              {label}
            </text>
          ))}

          {/* Area fills */}
          <path d={cepedaData.areaPath} fill="url(#grad-cepeda)" />
          <path d={espriellaData.areaPath} fill="url(#grad-espriella)" />

          {/* Lines */}
          <path
            d={cepedaData.path}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={espriellaData.path}
            fill="none"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points — Cepeda */}
          {cepedaData.points.map((pt, i) => (
            <circle
              key={`c-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="2.5"
              fill="#10B981"
              stroke="rgba(4,6,13,0.9)"
              strokeWidth="1.5"
            />
          ))}

          {/* Data points — Espriella */}
          {espriellaData.points.map((pt, i) => (
            <circle
              key={`e-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="2.5"
              fill="#60A5FA"
              stroke="rgba(4,6,13,0.9)"
              strokeWidth="1.5"
            />
          ))}

          {/* X axis labels */}
          {sentimentData.map((d, i) => (
            <text
              key={d.day}
              x={PAD_LEFT + (i / (sentimentData.length - 1)) * innerW}
              y={CHART_H - 4}
              textAnchor="middle"
              fontSize="7.5"
              fontFamily="JetBrains Mono, monospace"
              fill="rgba(241,240,237,0.3)"
            >
              {d.day}
            </text>
          ))}
        </svg>
      </div>

      {/* Current values */}
      <div className="flex justify-between mt-2">
        {[
          { name: 'Cepeda', value: sentimentData[sentimentData.length - 1].Cepeda, color: 'var(--color-cepeda)' },
          { name: 'Espriella', value: sentimentData[sentimentData.length - 1].Espriella, color: 'var(--color-espriella)' },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="section-title mb-0">{item.name} hoy:</span>
            <span className="mono-data text-xs font-semibold" style={{ color: item.color }}>
              {item.value}pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
