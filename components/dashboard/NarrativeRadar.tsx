"use client";

import { narrativeData } from "@/lib/data/narrativeData";
import { Radio } from "lucide-react";

export function NarrativeRadar() {
  const candidates = Object.keys(narrativeData) as Array<keyof typeof narrativeData>;

  return (
    <div className="p-5 font-['Satoshi',sans-serif]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Radio size={12} className="text-gold opacity-70" />
        <div className="section-label">Radar de narrativas</div>
      </div>
      <h2 className="display-title text-base text-white mb-4 leading-none">
        Mapa narrativo
      </h2>

      <div className="gold-divider" />

      <div className="grid grid-cols-2 gap-4 mt-4">
        {candidates.map((candidate) => {
          const data = narrativeData[candidate];
          const isCepeda = candidate.toLowerCase().includes('cepeda');
          
          // Tailwind-based accent colors
          const accentClass = isCepeda ? 'text-cepeda' : 'text-espriella';
          const borderClass = isCepeda ? 'border-cepeda/[0.15]' : 'border-espriella/[0.15]';

          return (
            <div key={candidate} className="space-y-4">
              {/* Candidate name */}
              <div
                className={`mono-data text-[10px] font-bold uppercase tracking-widest pb-1.5 border-b ${borderClass} ${accentClass}`}
              >
                {candidate}
              </div>

              {/* Narratives List */}
              <div className="space-y-3">
                <NarrativeList label="↑ Positivo" color="text-emerald-400/80" tags={data.positive} />
                <NarrativeList label="↓ Negativo" color="text-red-400/80" tags={data.negative} />
                <NarrativeList label="◈ Emergente" color="text-amber-400/80" tags={data.emerging} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NarrativeList({ label, color, tags }: { label: string; color: string; tags: string[] }) {
  return (
    <div className="space-y-1.5">
      <div className={`section-title ${color}`}>{label}</div>
      <ul className="space-y-1">
        {tags.map((tag) => (
          <li key={tag} className="flex items-start gap-2 text-xs text-white/80">
            <span className="mt-1 w-1 h-1 rounded-full bg-gold/50 shrink-0" />
            <span className="font-['Satoshi',sans-serif]">{tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
