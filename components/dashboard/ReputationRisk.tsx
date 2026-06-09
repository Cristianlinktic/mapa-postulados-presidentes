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
    const { data } = await supabase.from('reputation_risks').select('*').eq('shape_id', selectedLocationId);
    if (data && data.length > 0) {
      setRisks(data as RiskData[]);
      setEditRisks(data as RiskData[]);
    } else {
      // Inicializar con valores por defecto si no existen
      const defaultRisks: RiskData[] = [
        { id: crypto.randomUUID(), shape_id: selectedLocationId, candidate_name: 'Cepeda', risk_level: 'Medio', top_attacks: [] },
        { id: crypto.randomUUID(), shape_id: selectedLocationId, candidate_name: 'Espriella', risk_level: 'Medio', top_attacks: [] }
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
    if (level === 'Bajo') return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (level === 'Medio') return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
  };

  return (
    <div className="p-5 font-['Satoshi',sans-serif]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <Shield className="text-gold opacity-70" size={12}/>
            <div className="section-label">Riesgo reputacional</div>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="text-white/50 hover:text-white">
            <Edit2 size={14}/>
        </button>
      </div>
      <h2 className="display-title text-base text-white mb-4 leading-none">Monitor de vulnerabilidad</h2>
      <div className="gold-divider" />

      {isEditing ? (
        <div className="space-y-4 mt-4">
            {editRisks.map((r, i) => (
                <div key={r.candidate_name} className="bg-white/5 p-4 rounded-lg space-y-2">
                    <label className="text-xs font-bold text-white uppercase">{r.candidate_name}</label>
                    <select value={r.risk_level} onChange={e => {
                        const newR = [...editRisks];
                        newR[i].risk_level = e.target.value as any;
                        setEditRisks(newR);
                    }} className="w-full bg-white/10 p-2 text-sm rounded text-white">
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                        <option value="Crítico">Crítico</option>
                    </select>
                    <input className="w-full bg-white/10 p-2 text-sm rounded text-white" placeholder="Ataques (separados por coma)" value={r.top_attacks.join(', ')} onChange={e => {
                        const newR = [...editRisks];
                        newR[i].top_attacks = e.target.value.split(',').map(s => s.trim());
                        setEditRisks(newR);
                    }}/>
                </div>
            ))}
            <button onClick={handleSave} className="w-full bg-green-600 p-2 rounded text-xs font-bold text-white">Guardar cambios</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
            {risks.map(r => (
                <div key={r.candidate_name} className="space-y-4">
                    <div className={`mono-data text-[10px] font-bold uppercase tracking-widest pb-1.5 border-b border-${r.candidate_name === 'Cepeda' ? 'cepeda' : 'espriella'}/[0.15] text-${r.candidate_name === 'Cepeda' ? 'cepeda' : 'espriella'}`}>{r.candidate_name}</div>
                    <div className="space-y-2">
                        <div className="section-title mb-1">Nivel de riesgo</div>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${getRiskColor(r.risk_level)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>{r.risk_level}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="section-title">Ataques principales</div>
                        <ul className="space-y-2">
                            {r.top_attacks.map((atk, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-xs text-white/80">
                                    <span className="mono-data font-bold text-red-500/60 mt-0.5">0{idx + 1}</span>
                                    <span className="font-['Satoshi',sans-serif] leading-snug tracking-normal">{atk}</span>
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
