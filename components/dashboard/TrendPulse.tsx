"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { TrendingUp, TrendingDown, Edit2, Save, X } from "lucide-react";
import { useStore } from "@/lib/store";

interface Trend {
  id: string;
  tag: string;
  velocity: number;
  direction: 'up' | 'down' | 'stable';
}

export function TrendPulse() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTrends, setEditTrends] = useState<Trend[]>([]);
  const user = useStore((state) => state.user);

  const isAdmin = user?.role === 'admin';
  const showEditMode = isEditing && isAdmin;

  useEffect(() => {
    async function fetchTrends() {
      const { data } = await supabase.from('trends').select('*');
      if (data) {
        setTrends(data as Trend[]);
        setEditTrends(data as Trend[]);
      }
    }
    fetchTrends();
  }, []);

  const handleSave = async () => {
    if (!isAdmin) return;
    // Basic upsert logic
    for (const trend of editTrends) {
      await supabase.from('trends').upsert(trend);
    }
    setTrends(editTrends);
    setIsEditing(false);
  };

  return (
    <div className="intel-panel rounded-xl px-5 py-3 w-full overflow-hidden shrink-0 shadow-sm relative font-['Satoshi',sans-serif]">
      {isAdmin && (
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="cursor-pointer absolute top-2 right-2 p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-emerald-500 z-10"
        >
          <Edit2 size={12}/>
        </button>
      )}

      {showEditMode ? (

        <div className="space-y-2 p-2 bg-[--color-surface-elevated] border border-[--color-panel-border] rounded mt-4">
            {editTrends.map((t, i) => (
                <div key={i} className="flex gap-2 text-xs items-center">
                    <input className="bg-[--color-surface] border border-[--color-panel-border] p-1 rounded flex-1 text-[--color-text-primary]" value={t.tag} onChange={e => {
                        const newTrends = [...editTrends];
                        newTrends[i].tag = e.target.value;
                        setEditTrends(newTrends);
                    }}/>
                    <button onClick={() => {
                        const newTrends = editTrends.filter((_, idx) => idx !== i);
                        setEditTrends(newTrends);
                    }} className="cursor-pointer bg-[--color-alert]/10 border border-[--color-alert]/20 px-2 py-1 rounded text-[--color-alert]"><X size={12}/></button>
                </div>
            ))}
            <button onClick={() => setEditTrends([...editTrends, { id: crypto.randomUUID(), tag: '#NuevaTendencia', velocity: 0, direction: 'stable' } as any])} className="cursor-pointer w-full text-xs bg-[--color-surface-elevated] p-1 rounded text-[--color-text-secondary]">+ Agregar tendencia</button>
            <button onClick={handleSave} className="cursor-pointer w-full flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded text-sm text-white font-bold transition-colors"><Save size={14}/> Guardar todos</button>
        </div>
      ) : (
        <div className="flex items-center gap-6 mt-1">
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-1 h-4 rounded-full bg-[--color-accent]" />
                <span className="section-label text-[--color-text-secondary]">Tendencias en vivo</span>
            </div>
            <div className="flex-1 overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
            <motion.div className="flex gap-10 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }}>
                {[...trends, ...trends].map((trend, index) => (
                <div key={index} className="flex items-center gap-2.5">
                    <span className="mono-data text-[10px] text-[--color-text-muted]">//</span>
                    <span className="mono-data text-xs text-[--color-text-primary]">{trend.tag}</span>
                    <span className={`flex items-center gap-0.5 mono-data text-[10px] ${trend.direction === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {trend.direction === 'up' ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {Math.abs(trend.velocity)}%
                    </span>
                </div>
                ))}
            </motion.div>
            </div>
        </div>
      )}
    </div>
  );
}
