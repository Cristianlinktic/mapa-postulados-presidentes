"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useStore } from "@/lib/store";
import { TrendingDown, TrendingUp, Edit2, Save, X } from "lucide-react";

interface CandidateData {
  id: string;
  name: string;
  shape_id: string; // Foreign key
  favorabilidad: number;
  negatividad: number;
  engagement: number;
  alcance: number;
  riesgo: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
}

export function PresidentialComparison() {
  const selectedLocationId = useStore((state) => state.selectedLocationId);
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editCandidates, setEditCandidates] = useState<CandidateData[]>([]);

  useEffect(() => {
    async function fetchCandidates() {
      if (!selectedLocationId) {
        setCandidates([]);
        return;
      }
      const { data } = await supabase
        .from('candidates')
        .select('*')
        .eq('shape_id', selectedLocationId);

      if (data && data.length > 0) {
        setCandidates(data as CandidateData[]);
        setEditCandidates(data as CandidateData[]);
      } else {
        // Inicializar con los candidatos por defecto si no existen en la DB para este depto
        const defaultCandidates = [
          { id: crypto.randomUUID(), name: 'Iván Cepeda', shape_id: selectedLocationId, favorabilidad: 0, negatividad: 0, engagement: 0, alcance: 0, riesgo: 'Medio' },
          { id: crypto.randomUUID(), name: 'Abelardo de la Espriella', shape_id: selectedLocationId, favorabilidad: 0, negatividad: 0, engagement: 0, alcance: 0, riesgo: 'Medio' }
        ];
        setCandidates(defaultCandidates as CandidateData[]);
        setEditCandidates(defaultCandidates as CandidateData[]);
      }
    }
    fetchCandidates();
  }, [selectedLocationId]);

  const handleSave = async () => {
    for (const cand of editCandidates) {
      // Ensure shape_id is set when saving
      await supabase.from('candidates').upsert({ ...cand, shape_id: selectedLocationId });
    }
    setCandidates(editCandidates);
    setIsEditing(false);
  };

  const cepeda = candidates.find(c => c.name.includes("Cepeda")) || { name: 'Iván Cepeda', favorabilidad: 0, negatividad: 0 };
  const espriella = candidates.find(c => c.name.includes("Espriella")) || { name: 'Abelardo de la Espriella', favorabilidad: 0, negatividad: 0 };

  if (!selectedLocationId) return <div className="p-5 text-sm text-white/50">Selecciona una región para ver la comparación.</div>;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-label mb-1">Comparador Presidencial</div>
          <h2 className="display-title text-base text-white leading-none">Candidatos 2026</h2>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="text-white/50 hover:text-white">
          <Edit2 size={16}/>
        </button>
      </div>

      <div className="gold-divider" />

      {isEditing ? (
        <div className="space-y-4 mt-4">
          {editCandidates.map((c, i) => (
            <div key={c.id} className="bg-white/5 p-4 rounded-lg space-y-3">
              <label className="text-sm font-bold text-white border-b border-white/10 pb-2 block">{c.name}</label>
              
              <div className="space-y-1">
                <label className="text-xs text-white/60">Favorabilidad (%)</label>
                <input type="number" value={c.favorabilidad} onChange={e => {
                    const newC = [...editCandidates];
                    newC[i].favorabilidad = parseInt(e.target.value);
                    setEditCandidates(newC);
                }} className="w-full bg-white/10 p-2 text-sm rounded text-white"/>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60">Negatividad (%)</label>
                <input type="number" value={c.negatividad} onChange={e => {
                    const newC = [...editCandidates];
                    newC[i].negatividad = parseInt(e.target.value);
                    setEditCandidates(newC);
                }} className="w-full bg-white/10 p-2 text-sm rounded text-white"/>
              </div>
            </div>
          ))}
          <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-green-600 p-2 rounded text-sm font-bold text-white"><Save size={14}/> Guardar cambios</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-4">
            <CandidateCard data={cepeda as any} color="cepeda" />
            <CandidateCard data={espriella as any} color="espriella" />
        </div>
      )}
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
      <div>
        <div className="section-title mb-0.5" style={{ color: accent, opacity: 0.8 }}>
          {isCepeda ? 'Candidato A' : 'Candidato B'}
        </div>
        <div className="text-xs font-semibold leading-tight text-white">{data.name}</div>
      </div>

      <div>
        <div className="section-title mb-1">Favorabilidad</div>
        <div className="flex items-end gap-1.5">
          <div className="mono-data text-xl font-bold tracking-tight" style={{ color: accent }}>
            {data.favorabilidad || 0}
          </div>
          <div className="mono-data text-[10px] mb-1" style={{ color: accent, opacity: 0.6 }}>%</div>
          <TrendingUp size={11} className="mb-1 ml-auto" style={{ color: accent, opacity: 0.6 }} />
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-1.5">
          <div className="h-full" style={{ width: `${data.favorabilidad || 0}%`, background: accent }}></div>
        </div>
      </div>

      <div>
        <div className="section-title mb-1">Negatividad</div>
        <div className="flex items-end gap-1.5">
          <div className="mono-data text-sm font-medium" style={{ color: 'var(--color-alert)' }}>
            {data.negatividad || 0}%
          </div>
          <TrendingDown size={10} className="mb-0.5 ml-auto" style={{ color: 'var(--color-alert)', opacity: 0.5 }} />
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-1.5">
          <div className="h-full" style={{ width: `${data.negatividad || 0}%`, background: 'var(--color-alert)', opacity: 0.6 }}></div>
        </div>
      </div>
    </div>
  );
}
