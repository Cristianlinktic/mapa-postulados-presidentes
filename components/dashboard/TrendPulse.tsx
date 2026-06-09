"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { TrendingUp, TrendingDown, Edit2, Save, X } from "lucide-react";

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
    // Basic upsert logic
    for (const trend of editTrends) {
      await supabase.from('trends').upsert(trend);
    }
    setTrends(editTrends);
    setIsEditing(false);
  };

  return (
    <div className="intel-panel rounded-xl px-5 py-3 w-full overflow-hidden shrink-0 border border-gold/20 relative">
      <button 
        onClick={() => setIsEditing(!isEditing)} 
        className="absolute top-2 right-2 text-white/30 hover:text-white z-10"
      >
        <Edit2 size={12}/>
      </button>

      {isEditing ? (
        <div className="space-y-2 p-2 bg-black/40 rounded mt-4">
            {editTrends.map((t, i) => (
                <div key={i} className="flex gap-2 text-xs items-center">
                    <input className="bg-black/50 p-1 rounded flex-1 text-white border border-white/10" value={t.tag} onChange={e => {
                        const newTrends = [...editTrends];
                        newTrends[i].tag = e.target.value;
                        setEditTrends(newTrends);
                    }}/>
                    <button onClick={() => {
                        const newTrends = editTrends.filter((_, idx) => idx !== i);
                        setEditTrends(newTrends);
                    }} className="bg-red-900/50 px-2 py-1 rounded text-red-300"><X size={12}/></button>
                </div>
            ))}
            <button onClick={() => setEditTrends([...editTrends, { id: crypto.randomUUID(), tag: '#NuevaTendencia', velocity: 0, direction: 'stable' } as any])} className="w-full text-xs bg-gold/20 p-1 rounded text-gold">+ Agregar tendencia</button>
            <button onClick={handleSave} className="w-full flex items-center justify-center gap-1 bg-green-600 px-3 py-1 rounded text-sm text-white font-bold"><Save size={14}/> Guardar todos</button>
        </div>
      ) : (
        <div className="flex items-center gap-6 mt-1">
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-1 h-4 rounded-full bg-gold/70" />
                <span className="section-label">Tendencias en vivo</span>
            </div>
            <div className="flex-1 overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
            <motion.div className="flex gap-10 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }}>
                {[...trends, ...trends].map((trend, index) => (
                <div key={index} className="flex items-center gap-2.5">
                    <span className="mono-data text-[10px] text-gold/30">//</span>
                    <span className="mono-data text-xs text-[#F1F0ED]">{trend.tag}</span>
                    <span className={`flex items-center gap-0.5 mono-data text-[10px] ${trend.direction === 'up' ? 'text-cepeda' : 'text-red-500'}`}>
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
