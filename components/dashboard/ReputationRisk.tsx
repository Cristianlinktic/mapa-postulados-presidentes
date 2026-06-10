"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { Shield, Edit2, Save, X } from "lucide-react";

interface RiskData {
  id: string;
  shape_id: string;
  candidate_name: string;
  risk_level: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  top_attacks: string[];
}

export function ReputationRisk() {
  const selectedLocationId = useStore((state) => state.selectedLocationId);
  const [risks, setRisks] = useState<RiskData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRisks, setEditRisks] = useState<RiskData[]>([]);

  useEffect(() => {
    if (!selectedLocationId) return;
    fetchRisks();
  }, [selectedLocationId]);

  async function fetchRisks() {
    const { data } = await supabase.from('reputation_risks').select('*').eq('shape_id', selectedLocationId!);
    if (data && data.length > 0) {
      setRisks(data as RiskData[]);
      setEditRisks(data as RiskData[]);
    } else {
      // Inicializar con valores por defecto si no existen
      const defaultRisks: RiskData[] = [
        { id: crypto.randomUUID(), shape_id: selectedLocationId!, candidate_name: 'Cepeda', risk_level: 'Medio', top_attacks: [] },
        { id: crypto.randomUUID(), shape_id: selectedLocationId!, candidate_name: 'Espriella', risk_level: 'Medio', top_attacks: [] }
      ];
      setRisks(defaultRisks);
      setEditRisks(defaultRisks);
    }
  }

  const handleSave = async () => {
    for (const risk of editRisks) {
      await supabase.from('reputation_risks').upsert(risk);
    }
    setRisks(editRisks);
    setIsEditing(false);
  };

  const getRiskColor = (level: string) => {
    const base = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border";
    switch (level) {
        case 'Bajo': return `${base} text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800`;
        case 'Medio': return `${base} text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800`;
        case 'Alto': return `${base} text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800`;
        case 'Crítico': return `${base} text-[--color-alert] bg-[--color-alert]/10 border-[--color-alert]/20 animate-pulse`;
        default: return `${base} text-[--color-text-muted] bg-[--color-surface-elevated] border-[--color-panel-border]`;
    }
  };

  return (
    <div className="intel-panel p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <Shield className="text-[--color-accent] opacity-70" size={12}/>
            <div className="section-label">Riesgo reputacional</div>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="text-[--color-text-muted] hover:text-[--color-text-primary] cursor-pointer">
            <Edit2 size={14}/>
        </button>
      </div>
      <h2 className="display-title text-base text-[--color-text-primary] mb-4 leading-none">Monitor de vulnerabilidad</h2>
      <div className="h-px bg-[--color-panel-border] my-4" />

      {isEditing ? (
        <div className="space-y-4 mt-4">
            {editRisks.map((r, i) => (
                <div key={r.candidate_name} className="bg-[--color-surface-elevated] border border-[--color-panel-border] p-4 rounded-lg space-y-2">
                    <label className="text-xs font-bold text-[--color-text-primary] uppercase">{r.candidate_name}</label>
                    <select value={r.risk_level} onChange={e => {
                        const newR = [...editRisks];
                        newR[i].risk_level = e.target.value as any;
                        setEditRisks(newR);
                    }} className="w-full bg-[--color-surface] border border-[--color-panel-border] p-2 text-sm rounded text-[--color-text-primary]">
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                        <option value="Crítico">Crítico</option>
                    </select>
                    <input className="w-full bg-[--color-surface] border border-[--color-panel-border] p-2 text-sm rounded text-[--color-text-primary]" placeholder="Ataques (separados por coma)" value={r.top_attacks.join(', ')} onChange={e => {
                        const newR = [...editRisks];
                        newR[i].top_attacks = e.target.value.split(',').map(s => s.trim());
                        setEditRisks(newR);
                    }}/>
                </div>
            ))}
            <button onClick={handleSave} className="w-full bg-emerald-500 hover:bg-emerald-600 p-2 rounded text-xs font-bold text-white transition-colors cursor-pointer">Guardar cambios</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
            {risks.map(r => (
                <div key={r.candidate_name} className="space-y-4">
                    <div className="mono-data text-[10px] font-bold uppercase tracking-widest pb-1.5 border-b border-[--color-panel-border] text-[--color-text-primary]">{r.candidate_name}</div>
                    <div className="space-y-2">
                        <div className="section-title mb-1">Nivel de riesgo</div>
                        <span className={`${getRiskColor(r.risk_level)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>{r.risk_level}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="section-title">Ataques principales</div>
                        <ul className="space-y-2">
                            {r.top_attacks.map((atk, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-xs text-[--color-text-secondary]">
                                    <span className="mono-data font-bold text-[--color-text-muted] mt-0.5">0{idx + 1}</span>
                                    <span className="leading-snug tracking-normal">{atk}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
