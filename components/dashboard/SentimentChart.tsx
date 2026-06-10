"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Activity, Edit2, Save, X } from "lucide-react";

interface SentimentRow {
  id: string;
  day: string;
  day_order: number;
  cepeda_value: number;
  espriella_value: number;
}

export function SentimentChart() {
  const [data, setData] = useState<SentimentRow[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<SentimentRow[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase.from('sentiment_data').select('*').order('day_order');
    
    if (data && data.length > 0) {
      setData(data as SentimentRow[]);
      setEditData(data as SentimentRow[]);
    } else {
      const defaultData: SentimentRow[] = [
        { id: crypto.randomUUID(), day: 'Lun', day_order: 1, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Mar', day_order: 2, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Mié', day_order: 3, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Jue', day_order: 4, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Vie', day_order: 5, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Sáb', day_order: 6, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Dom', day_order: 7, cepeda_value: 0, espriella_value: 0 },
      ];
      setData(defaultData);
      setEditData(defaultData);
    }
  }

  const handleSave = async () => {
    for (const row of editData) {
      await supabase.from('sentiment_data').upsert(row);
    }
    setData(editData);
    setIsEditing(false);
  };

  return (
    <div className="intel-panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-[--color-accent] opacity-70" />
          <div className="section-label text-[--color-text-secondary]">Evolución de sentimiento</div>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="text-[--color-text-muted] hover:text-[--color-text-primary] cursor-pointer">
          <Edit2 size={14} />
        </button>
      </div>

      <h2 className="display-title text-base text-[--color-text-primary] mb-3 leading-none">Curva histórica</h2>
      <div className="h-px bg-[--color-panel-border] my-4" />

      {isEditing ? (
        <div className="space-y-2 mt-4">
          <p className="text-[10px] text-[--color-text-muted] italic">Valores de sentimiento (0-100)</p>
          <div className="grid grid-cols-3 gap-2 items-center text-[10px] text-[--color-text-secondary] uppercase tracking-widest mb-2 px-1">
            <span>Día</span>
            <span>Cepeda</span>
            <span>Espriella</span>
          </div>
          {editData.map((row, i) => (
            <div key={row.id} className="grid grid-cols-3 gap-2 items-center text-xs text-[--color-text-primary]">
              <span className="font-bold">{row.day}</span>
              <input type="number" min="0" max="100" placeholder="Cepeda" value={row.cepeda_value} onChange={e => {
                const newData = [...editData];
                newData[i].cepeda_value = parseInt(e.target.value);
                setEditData(newData);
              }} className="bg-[--color-surface] border border-[--color-panel-border] p-1 rounded w-full"/>
              <input type="number" min="0" max="100" placeholder="Espriella" value={row.espriella_value} onChange={e => {
                const newData = [...editData];
                newData[i].espriella_value = parseInt(e.target.value);
                setEditData(newData);
              }} className="bg-[--color-surface] border border-[--color-panel-border] p-1 rounded w-full"/>
            </div>
          ))}
          <button onClick={handleSave} className="w-full bg-emerald-500 hover:bg-emerald-600 p-2 rounded text-xs font-bold text-white flex items-center justify-center gap-2 mt-2 transition-colors cursor-pointer">
            <Save size={12}/> Guardar cambios
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 rounded-full" style={{ background: 'var(--color-cepeda)' }}></div><span className="mono-data text-[9px] uppercase tracking-widest text-[--color-text-muted]">Cepeda</span></div>
            <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 rounded-full" style={{ background: 'var(--color-espriella)' }}></div><span className="mono-data text-[9px] uppercase tracking-widest text-[--color-text-muted]">Espriella</span></div>
          </div>
          <div className="grid grid-cols-7 gap-1 h-32 items-end">
            {data.map(row => (
              <div key={row.id} className="flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5">
                    <div style={{height: `${row.cepeda_value}%`, background: 'var(--color-cepeda)'}} className="rounded-t-sm transition-all duration-500"></div>
                    <div style={{height: `${row.espriella_value}%`, background: 'var(--color-espriella)'}} className="rounded-b-sm transition-all duration-500"></div>
                </div>
                <span className="text-[8px] text-[--color-text-muted] mono-data">{row.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
