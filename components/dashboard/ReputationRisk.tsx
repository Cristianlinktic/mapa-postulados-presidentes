"use client";

import { reputationRiskData } from "@/lib/data/reputationData";

const riskColors: Record<string, string> = {
  Bajo: "text-green-400",
  Medio: "text-yellow-400",
  Alto: "text-orange-400",
  Crítico: "text-red-600",
};

export function ReputationRisk() {
  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4 text-center tracking-tight">Riesgo Reputacional</h2>
      <div className="grid grid-cols-2 gap-6">
        {(Object.keys(reputationRiskData) as Array<keyof typeof reputationRiskData>).map((candidate) => {
          const data = reputationRiskData[candidate];
          return (
            <div key={candidate} className="space-y-3">
              <h3 className="font-semibold text-sm text-zinc-300 border-b border-zinc-700 pb-1">{candidate}</h3>
              <p className={`font-bold text-sm ${riskColors[data.level]}`}>Nivel: {data.level}</p>
              <div className="text-xs space-y-1 text-zinc-400">
                <p>Ataques: <span className="text-zinc-200">{data.topAttacks.join(', ')}</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
