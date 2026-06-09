"use client";

import { narrativeData } from "@/lib/data/narrativeData";

export function NarrativeRadar() {
  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4 text-center tracking-tight">Radar de Narrativas</h2>
      <div className="grid grid-cols-2 gap-6">
        {(Object.keys(narrativeData) as Array<keyof typeof narrativeData>).map((candidate) => (
          <div key={candidate} className="space-y-3">
            <h3 className="font-semibold text-sm text-zinc-300 border-b border-zinc-700 pb-1">{candidate}</h3>
            <div className="text-xs space-y-2">
              <div className="text-green-400"><strong>Positivo:</strong> {narrativeData[candidate].positive.join(', ')}</div>
              <div className="text-red-400"><strong>Negativo:</strong> {narrativeData[candidate].negative.join(', ')}</div>
              <div className="text-yellow-400"><strong>Emergente:</strong> {narrativeData[candidate].emerging.join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
