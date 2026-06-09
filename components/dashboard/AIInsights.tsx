"use client";

import { useStore } from "@/lib/store";
import { Cpu } from "lucide-react";

const insightMap: Record<string, { text: string; confidence: number }> = {
  'Seguridad': {
    text: "Alta preocupación por seguridad urbana detectada en la zona norte. Correlación del 78% con regiones de alta densidad poblacional.",
    confidence: 94,
  },
  'Economía': {
    text: "Interés creciente en propuestas de empleo juvenil en municipios del eje cafetero. Incremento de 23 puntos vs semana anterior.",
    confidence: 87,
  },
  'Paz': {
    text: "Narrativa de paz territorial gana tracción en zonas históricamente afectadas. Candidatos con discurso de reconciliación lideran en consultas.",
    confidence: 91,
  },
  'General': {
    text: "La conversación política en esta zona se encuentra altamente polarizada. Índice de fragmentación narrativa en 0.82 sobre 1.0.",
    confidence: 82,
  },
};

export function AIInsights() {
  const theme = useStore((state) => state.currentTheme);
  const locationId = useStore((state) => state.selectedLocationId);

  const insight = insightMap[theme] ?? insightMap['General'];

  return (
    <div className="intel-panel rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gold/[0.1] border border-gold/[0.2]">
            <Cpu size={13} className="text-gold" />
          </div>
          <div>
            <div className="section-label">Análisis de IA</div>
            <div className="mono-data text-[10px] text-gold/50">
              Tema: {theme}
            </div>
          </div>
        </div>
        {/* Confidence */}
        <div className="text-right">
          <div className="section-label mb-0.5">Confianza</div>
          <div className="mono-data text-sm font-semibold text-gold">
            {insight.confidence}%
          </div>
        </div>
      </div>

      <div className="gold-divider" />

      {/* Insight text */}
      <p className="text-sm leading-relaxed italic text-[#f1f0ed]/90 font-['Satoshi',sans-serif]">
        "{insight.text}"
      </p>

      {/* Confidence bar */}
      <div className="mt-4">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-out bg-gold"
            style={{
              width: `${insight.confidence}%`,
            }}
          />
        </div>
      </div>

      {/* Region tag */}
      {locationId && (
        <div className="mt-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-cepeda)' }} />
          <span className="mono-data text-[9px] uppercase tracking-widest"
            style={{ color: 'rgba(241,240,237,0.4)' }}>
            Región seleccionada: {locationId}
          </span>
        </div>
      )}
    </div>
  );
}
