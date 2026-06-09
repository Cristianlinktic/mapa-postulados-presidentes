"use client";

import { reputationRiskData } from "@/lib/data/reputationData";
import { Shield } from "lucide-react";

const riskConfig: Record<string, { badgeClass: string; barColor: string; width: string }> = {
  Bajo: {
    badgeClass: 'risk-low',
    barColor: 'rgba(16,185,129,0.7)',
    width: '25%',
  },
  Medio: {
    badgeClass: 'risk-medium',
    barColor: 'rgba(245,158,11,0.7)',
    width: '50%',
  },
  Alto: {
    badgeClass: 'risk-high',
    barColor: 'rgba(249,115,22,0.7)',
    width: '75%',
  },
  Crítico: {
    badgeClass: 'risk-critical',
    barColor: 'rgba(239,68,68,0.8)',
    width: '100%',
  },
};

export function ReputationRisk() {
  const candidates = Object.keys(reputationRiskData) as Array<keyof typeof reputationRiskData>;

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Shield size={11} style={{ color: 'var(--color-gold)', opacity: 0.7 }} />
        <div className="section-label">Riesgo reputacional</div>
      </div>
      <h2 className="display-title text-base text-[#F1F0ED] mb-4 leading-none">
        Monitor de vulnerabilidad
      </h2>

      <div className="gold-divider" />

      <div className="grid grid-cols-2 gap-4 mt-4">
        {candidates.map((candidate) => {
          const data = reputationRiskData[candidate];
          const config = riskConfig[data.level] ?? riskConfig['Bajo'];
          const isCepeda = candidate.toLowerCase().includes('cepeda');
          const accentColor = isCepeda ? 'var(--color-cepeda)' : 'var(--color-espriella)';
          const borderColor = isCepeda ? 'rgba(16,185,129,0.15)' : 'rgba(96,165,250,0.15)';

          return (
            <div key={candidate} className="space-y-3">
              {/* Candidate name */}
              <div
                className="mono-data text-[9px] font-semibold uppercase tracking-widest pb-1.5"
                style={{ color: accentColor, borderBottom: `1px solid ${borderColor}` }}
              >
                {candidate}
              </div>

              {/* Risk level */}
              <div className="space-y-2">
                <div className="section-title mb-1">Nivel de riesgo</div>
                <span className={`risk-badge ${config.badgeClass}`}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                  {data.level}
                </span>

                {/* Risk bar */}
                <div className="progress-bar mt-2">
                  <div
                    className="progress-fill"
                    style={{
                      width: config.width,
                      background: config.barColor,
                      transition: 'width 1s ease',
                    }}
                  />
                </div>
              </div>

              {/* Top attacks */}
              <div>
                <div className="section-title">Ataques principales</div>
                <div className="flex flex-col gap-1">
                  {data.topAttacks.map((attack, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="mono-data text-[9px] mt-0.5" style={{ color: 'rgba(239,68,68,0.5)' }}>
                        {i + 1}.
                      </span>
                      <span className="text-[10px] leading-tight" style={{ color: 'rgba(241,240,237,0.6)' }}>
                        {attack}
                      </span>
                    </div>
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
