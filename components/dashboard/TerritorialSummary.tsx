"use client";

import { TerritorialData, mockTerritorialData } from "@/lib/data/mockData";
import { useStore } from "@/lib/store";
import { MapPin } from "lucide-react";

function StatBlock({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="section-title">{label}</div>
      <div
        className="mono-data text-sm font-semibold"
        style={{ color: accent ?? 'var(--color-text-primary)' }}
      >
        {value}
      </div>
    </div>
  );
}

export function TerritorialSummary() {
  const selectedLocationId = useStore((state) => state.selectedLocationId);
  const data: TerritorialData | null = selectedLocationId
    ? mockTerritorialData[selectedLocationId]
    : null;

  if (!data) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-3 text-center py-8">
        {/* Crosshair icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <MapPin size={16} style={{ color: 'rgba(201,168,76,0.4)' }} />
        </div>
        <div>
          <div className="section-label mb-1">Región no seleccionada</div>
          <p className="text-xs" style={{ color: 'rgba(241,240,237,0.3)' }}>
            Haz clic sobre un departamento en el mapa para ver su análisis territorial.
          </p>
        </div>
      </div>
    );
  }

  const cepedaLeads = data.favorabilidadCepeda > data.favorabilidadDeLaEspriella;
  const gap = Math.abs(data.favorabilidadCepeda - data.favorabilidadDeLaEspriella);

  return (
    <div className="p-5">
      {/* Region header with gold highlight */}
      <div className="flex items-start justify-between mb-4 p-3 rounded-lg bg-white/[0.05] border border-white/[0.1]">
        <div>
          <div className="section-label mb-1">Análisis territorial</div>
          <h2
            className="display-title text-lg text-white leading-tight"
          >
            {data.name}
          </h2>
        </div>
        <div
          className={`shrink-0 px-2 py-1 rounded text-[9px] mono-data uppercase tracking-widest border
            ${cepedaLeads ? 'bg-cepeda/[0.08] border-cepeda/[0.2] text-cepeda' : 'bg-espriella/[0.08] border-espriella/[0.2] text-espriella'}
          `}
        >
          {cepedaLeads ? 'Cepeda +' : 'Espriella +'}{gap}pts
        </div>
      </div>

      <div className="gold-divider" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4">
        <StatBlock
          label="Población"
          value={data.poblacion.toLocaleString('es-CO')}
        />
        <StatBlock
          label="Censo Electoral"
          value={data.censoElectoral.toLocaleString('es-CO')}
        />
      </div>

      {/* Favorability bars */}
      <div className="space-y-3">
        {/* Cepeda */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="section-title mb-0 text-cepeda/80">
              Cepeda
            </span>
            <span className="mono-data text-sm font-semibold text-cepeda">
              {data.favorabilidadCepeda}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-1000 ease-out bg-cepeda"
              style={{
                width: `${data.favorabilidadCepeda}%`,
              }}
            />
          </div>
        </div>

        {/* Espriella */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="section-title mb-0 text-espriella/80">
              De la Espriella
            </span>
            <span className="mono-data text-sm font-semibold text-espriella">
              {data.favorabilidadDeLaEspriella}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-1000 ease-out bg-espriella"
              style={{
                width: `${data.favorabilidadDeLaEspriella}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
