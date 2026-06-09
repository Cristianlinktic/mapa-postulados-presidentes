"use client";

import { reputationRiskData } from "@/lib/data/reputationData";
import { Shield } from "lucide-react";

const riskConfig: Record<string, { badgeClass: string; barColor: string; width: string }> = {
  Bajo: {
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    barColor: 'bg-emerald-500/70',
    width: '25%',
  },
  Medio: {
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    barColor: 'bg-amber-500/70',
    width: '50%',
  },
  Alto: {
    badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    barColor: 'bg-orange-500/70',
    width: '75%',
  },
  Crítico: {
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
    barColor: 'bg-red-500/80',
    width: '100%',
  },
};

export function ReputationRisk() {
  const candidates = Object.keys(reputationRiskData) as Array<keyof typeof reputationRiskData>;

  return (
    <div className="p-5 font-['Satoshi',sans-serif]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Shield size={12} className="text-gold opacity-70" />
        <div className="section-label">Riesgo reputacional</div>
      </div>
      <h2 className="display-title text-base text-white mb-4 leading-none">
        Monitor de vulnerabilidad
      </h2>

      <div className="gold-divider" />

      <div className="grid grid-cols-2 gap-4 mt-4">
        {candidates.map((candidate) => {
          const data = reputationRiskData[candidate];
          const config = riskConfig[data.level] ?? riskConfig['Bajo'];
          const isCepeda = candidate.toLowerCase().includes('cepeda');
          
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

              {/* Risk level */}
              <div className="space-y-2">
                <div className="section-title mb-1">Nivel de riesgo</div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${config.badgeClass}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {data.level}
                </span>

                {/* Risk bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${config.barColor}`}
                    style={{ width: config.width }}
                  />
                </div>
              </div>

              {/* Top attacks */}
              <div className="space-y-2">
                <div className="section-title">Ataques principales</div>
                <ul className="space-y-2">
                  {data.topAttacks.map((attack, i) => (
                    <li 
                      key={i} 
                      className="flex items-start gap-3 text-xs text-white/80"
                    >
                      <span className="mono-data font-bold text-red-500/60 mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-['Satoshi',sans-serif] leading-snug tracking-normal">
                        {attack}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
