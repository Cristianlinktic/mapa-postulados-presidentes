import { mockCandidateComparison, CandidateData } from "@/lib/data/candidateData";
import { TrendingDown, TrendingUp } from "lucide-react";

export function PresidentialComparison() {
  const cepeda = mockCandidateComparison.cepeda;
  const espriella = mockCandidateComparison.espriella;

  return (
    <div className="p-5">
      {/* Header */}
      <div className="section-label mb-1">Comparador Presidencial</div>
      <h2 className="display-title text-base text-white mb-4 leading-none">
        Candidatos 2026
      </h2>

      <div className="gold-divider" />

      {/* VS Layout */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <CandidateCard data={cepeda} color="cepeda" />
        <CandidateCard data={espriella} color="espriella" />
      </div>

      {/* Gap indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-px" style={{ background: 'rgba(16, 185, 129, 0.1)' }} />
        <div className="mono-data text-[9px] uppercase tracking-widest px-2"
          style={{ color: 'rgba(241, 240, 237, 0.2)' }}>
          Brecha: {Math.abs(cepeda.favorabilidad - espriella.favorabilidad).toFixed(1)} pts
        </div>
        <div className="flex-1 h-px" style={{ background: 'rgba(59, 130, 246, 0.1)' }} />
      </div>
    </div>
  );
}

function CandidateCard({ data, color }: { data: CandidateData; color: 'cepeda' | 'espriella' }) {
  const isCepeda = color === 'cepeda';
  const accent = isCepeda ? 'var(--color-cepeda)' : 'var(--color-espriella)';
  const bgAccent = isCepeda ? 'rgba(16, 185, 129, 0.04)' : 'rgba(59, 130, 246, 0.04)';
  const borderAccent = isCepeda ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)';

  return (
    <div
      className="rounded-xl p-3.5 flex flex-col gap-3"
      style={{ background: bgAccent, border: `1px solid ${borderAccent}` }}
    >
      {/* Name */}
      <div>
        <div className="section-title mb-0.5"
          style={{ color: accent, opacity: 0.8 }}>
          {isCepeda ? 'Candidato A' : 'Candidato B'}
        </div>
        <div className="text-xs font-semibold leading-tight text-white">
          {data.name}
        </div>
      </div>

      {/* Favorabilidad */}
      <div>
        <div className="section-title mb-1">Favorabilidad</div>
        <div className="flex items-end gap-1.5">
          <div className="mono-data text-xl font-bold tracking-tight" style={{ color: accent }}>
            {data.favorabilidad}
          </div>
          <div className="mono-data text-[10px] mb-1" style={{ color: accent, opacity: 0.6 }}>%</div>
          <TrendingUp size={11} className="mb-1 ml-auto" style={{ color: accent, opacity: 0.6 }} />
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-1.5">
          <div
            className="h-full"
            style={{
              width: `${data.favorabilidad}%`,
              background: accent,
            }}
          />
        </div>
      </div>

      {/* Negatividad */}
      <div>
        <div className="section-title mb-1">Negatividad</div>
        <div className="flex items-end gap-1.5">
          <div className="mono-data text-sm font-medium" style={{ color: 'var(--color-alert)' }}>
            {data.negatividad}%
          </div>
          <TrendingDown size={10} className="mb-0.5 ml-auto" style={{ color: 'var(--color-alert)', opacity: 0.5 }} />
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-1.5">
          <div
            className="h-full"
            style={{
              width: `${data.negatividad}%`,
              background: 'var(--color-alert)',
              opacity: 0.6
            }}
          />
        </div>
      </div>
    </div>
  );
}
