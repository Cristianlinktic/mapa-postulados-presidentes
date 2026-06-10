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
  const user = useStore((state) => state.user);
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editCandidates, setEditCandidates] = useState<CandidateData[]>([]);

  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';
  const showEditMode = isEditing && isAdmin;

  const fetchCandidates = async (isRefresh = false) => {
    if (!selectedLocationId) {
      setCandidates([]);
      return;
    }
    if (!isRefresh) setLoading(true);
    
    const { data } = await supabase
      .from('candidates')
      .select('*')
      .eq('shape_id', selectedLocationId!);

    if (data && data.length > 0) {
      setCandidates(data as CandidateData[]);
      setEditCandidates(data as CandidateData[]);
    } else {
      const defaultCandidates = [
        { id: crypto.randomUUID(), name: 'Iván Cepeda', shape_id: selectedLocationId!, favorabilidad: 0, negatividad: 0, engagement: 0, alcance: 0, riesgo: 'Medio' },
        { id: crypto.randomUUID(), name: 'Abelardo de la Espriella', shape_id: selectedLocationId!, favorabilidad: 0, negatividad: 0, engagement: 0, alcance: 0, riesgo: 'Medio' }
      ];
      setCandidates(defaultCandidates as CandidateData[]);
      setEditCandidates(defaultCandidates as CandidateData[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, [selectedLocationId]);

  const handleSave = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
        // Usamos onConflict para asegurar que si ya existe un candidato con ese nombre 
        // en esa región, se actualice en lugar de intentar insertar un duplicado.
        const { data: savedData, error } = await supabase
            .from('candidates')
            .upsert(
                editCandidates.map(c => ({ ...c, shape_id: selectedLocationId! })),
                { onConflict: 'shape_id,name' }
            )
            .select();
        
        if (error) {
            console.error("Error saving candidates:", JSON.stringify(error, null, 2));
            // También logeamos el objeto directamente por si el navegador lo muestra mejor
            console.dir(error);
        } else if (savedData) {
            setCandidates(savedData as CandidateData[]);
            setEditCandidates(savedData as CandidateData[]);
            setIsEditing(false);
        }
    } catch (error) {
        console.error("Unexpected error in handleSave:", error);
    } finally {
        setLoading(false);
    }
  };

  const cepeda = candidates.find(c => c.name.includes("Cepeda")) || { name: 'Iván Cepeda', favorabilidad: 0, negatividad: 0 };
  const espriella = candidates.find(c => c.name.includes("Espriella")) || { name: 'Abelardo de la Espriella', favorabilidad: 0, negatividad: 0 };

  if (!selectedLocationId) return <div className="p-5 text-sm text-[--color-text-secondary]">Selecciona una región para ver la comparación.</div>;

  return (
    <div className="intel-panel p-5 rounded-2xl min-h-[200px]">
      {loading && !showEditMode && (
          <div className="absolute inset-0 bg-[--color-surface]/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[--color-accent]"></div>
          </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-label mb-1 text-[--color-text-secondary]">Comparador Presidencial</div>
          <h2 className="display-title text-base text-[--color-text-primary] leading-none">Candidatos 2026</h2>
        </div>
        {isAdmin && (
          <button onClick={() => setIsEditing(!isEditing)} className="text-[--color-text-muted] hover:text-[--color-text-primary] cursor-pointer">
            <Edit2 size={16}/>
          </button>
        )}
      </div>

      <div className="h-px bg-[--color-panel-border] my-4" />

      {showEditMode ? (

        <div className="space-y-4 mt-4">
          {editCandidates.map((c, i) => (
            <div key={c.id} className="bg-[--color-surface-elevated] border border-[--color-panel-border] p-4 rounded-lg space-y-3">
              <label className="text-sm font-bold text-[--color-text-primary] border-b border-[--color-panel-border] pb-2 block">{c.name}</label>
              
              <div className="space-y-1">
                <label className="text-xs text-[--color-text-secondary]">Favorabilidad (%)</label>
                <input type="number" value={c.favorabilidad} onChange={e => {
                    const newC = [...editCandidates];
                    newC[i] = { ...newC[i], favorabilidad: parseInt(e.target.value) || 0 };
                    setEditCandidates(newC);
                }} className="w-full bg-[--color-surface] border border-[--color-panel-border] p-2 text-sm rounded text-[--color-text-primary]"/>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[--color-text-secondary]">Negatividad (%)</label>
                <input type="number" value={c.negatividad} onChange={e => {
                    const newC = [...editCandidates];
                    newC[i] = { ...newC[i], negatividad: parseInt(e.target.value) || 0 };
                    setEditCandidates(newC);
                }} className="w-full bg-[--color-surface] border border-[--color-panel-border] p-2 text-sm rounded text-[--color-text-primary]"/>
              </div>
            </div>
          ))}
          <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 p-2 rounded text-sm font-bold text-white transition-colors cursor-pointer">Guardar cambios</button>
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
  const accent = `var(--color-${color})`;
  const bgAccent = `var(--color-${color}-dim)`;
  
  return (
    <div
      className="rounded-xl p-3.5 flex flex-col gap-3 bg-[--color-surface-elevated] border border-[--color-panel-border]"
    >
      <div>
        <div className="section-title mb-0.5" style={{ color: accent, opacity: 0.8 }}>
          {isCepeda ? 'Candidato A' : 'Candidato B'}
        </div>
        <div className="text-xs font-semibold leading-tight text-[--color-text-primary]">{data.name}</div>
      </div>

      <div>
        <div className="section-title mb-1">Favorabilidad</div>
        <div className="flex items-end gap-1.5">
          <div className="mono-data text-xl font-bold tracking-tight" style={{ color: accent }}>
            {data.favorabilidad || 0}
          </div>
          <div className="mono-data text-[10px] mb-1 text-[--color-text-secondary]">%</div>
          <TrendingUp size={11} className="mb-1 ml-auto text-[--color-text-muted]" />
        </div>
        <div className="h-2.5 w-full bg-[--color-void] rounded-full overflow-hidden mt-1.5 border border-[--color-panel-border]">
          <div className="h-full" style={{ width: `${data.favorabilidad || 0}%`, background: accent }}></div>
        </div>
      </div>

      <div>
        <div className="section-title mb-1">Negatividad</div>
        <div className="flex items-end gap-1.5">
          <div className="mono-data text-sm font-medium text-[--color-alert]">
            {data.negatividad || 0}%
          </div>
          <TrendingDown size={10} className="mb-0.5 ml-auto text-[--color-alert]" style={{ opacity: 0.6 }} />
        </div>
        <div className="h-2.5 w-full bg-[--color-void] rounded-full overflow-hidden mt-1.5 border border-[--color-panel-border]">
          <div className="h-full" style={{ width: `${Math.max(4, data.negatividad || 0)}%`, background: 'var(--color-alert)', opacity: 0.7 + ((data.negatividad || 0) / 100) * 0.3 }}></div>
        </div>
      </div>
    </div>
  );
}
