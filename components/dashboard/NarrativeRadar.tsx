"use client";

import { narrativeData } from "@/lib/data/narrativeData";
import { Radio } from "lucide-react";

export function NarrativeRadar() {
  const candidates = Object.keys(narrativeData) as Array<keyof typeof narrativeData>;

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Radio size={11} style={{ color: 'var(--color-gold)', opacity: 0.7 }} />
        <div className="section-label">Radar de narrativas</div>
      </div>
      <h2 className="display-title text-base text-[#F1F0ED] mb-4 leading-none">
        Mapa narrativo
      </h2>

      <div className="gold-divider" />

      <div className="grid grid-cols-2 gap-4 mt-4">
        {candidates.map((candidate) => {
          const data = narrativeData[candidate];
          const isCepeda = candidate.toLowerCase().includes('cepeda');
          const accent = isCepeda ? 'var(--color-cepeda)' : 'var(--color-espriella)';

          return (
            <div key={candidate} className="space-y-3">
              {/* Candidate name */}
              <div
                className="mono-data text-[9px] font-semibold uppercase tracking-widest pb-1.5"
                style={{
                  color: accent,
                  borderBottom: `1px solid ${isCepeda ? 'rgba(16,185,129,0.15)' : 'rgba(96,165,250,0.15)'}`,
                }}
              >
                {candidate}
              </div>

              {/* Positivo */}
              <div className="space-y-1.5">
                <div className="section-title" style={{ color: 'rgba(52,211,153,0.6)' }}>
                  ↑ Positivo
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.positive.map((tag) => (
                    <span key={tag} className="narrative-tag tag-positive">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Negativo */}
              <div className="space-y-1.5">
                <div className="section-title" style={{ color: 'rgba(248,113,113,0.6)' }}>
                  ↓ Negativo
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.negative.map((tag) => (
                    <span key={tag} className="narrative-tag tag-negative">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Emergente */}
              <div className="space-y-1.5">
                <div className="section-title" style={{ color: 'rgba(252,211,77,0.6)' }}>
                  ◈ Emergente
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.emerging.map((tag) => (
                    <span key={tag} className="narrative-tag tag-emerging">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
