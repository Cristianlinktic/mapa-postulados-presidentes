"use client";

import { TerritorialData, mockTerritorialData } from "@/lib/data/mockData";
import { useStore } from "@/lib/store";

export function TerritorialSummary() {
  const selectedLocationId = useStore((state) => state.selectedLocationId);
  const data: TerritorialData | null = selectedLocationId ? mockTerritorialData[selectedLocationId] : null;

  if (!data) {
    return (
      <div className="p-6 text-zinc-400">
        Selecciona una región para ver el resumen territorial.
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">{data.name}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Población</p>
          <p className="text-lg font-semibold">{data.poblacion.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Censo Electoral</p>
          <p className="text-lg font-semibold">{data.censoElectoral.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Favorabilidad Cepeda</p>
          <p className="text-lg font-semibold text-green-400">{data.favorabilidadCepeda}%</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Favorabilidad Espriella</p>
          <p className="text-lg font-semibold text-blue-400">{data.favorabilidadDeLaEspriella}%</p>
        </div>
      </div>
    </div>
  );
}
