"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Activity, Edit2, Save, X } from "lucide-react";
import { useStore } from "@/lib/store";

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
  const [tooltip, setTooltip] = useState<{ x: number, y: number, text: string, visible: boolean }>({ x: 0, y: 0, text: '', visible: false });
  const user = useStore((state) => state.user);

  const isAdmin = user?.role === 'admin';
  const showEditMode = isEditing && isAdmin;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase.from('sentiment_data').select('*').order('day_order');
    console.log("SentimentChart: Datos recibidos de Supabase:", data);
    
    if (data && data.length > 0) {
      setData(data as SentimentRow[]);
      setEditData(data as SentimentRow[]);
    } else {
      const defaultData: SentimentRow[] = [
        { id: crypto.randomUUID(), day: 'Ene', day_order: 1, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Feb', day_order: 2, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Mar', day_order: 3, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Abr', day_order: 4, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'May', day_order: 5, cepeda_value: 0, espriella_value: 0 },
        { id: crypto.randomUUID(), day: 'Jun', day_order: 6, cepeda_value: 0, espriella_value: 0 },
      ];
      setData(defaultData);
      setEditData(defaultData);
    }
  }

  const handleSave = async () => {
    if (!isAdmin) return;
    try {
        const { data: savedData, error } = await supabase
            .from('sentiment_data')
            .upsert(editData)
            .select();

        if (error) {
            console.error("Error saving sentiment data:", error);
        } else if (savedData) {
            setData(savedData as SentimentRow[]);
            setEditData(savedData as SentimentRow[]);
            setIsEditing(false);
        }
    } catch (error) {
        console.error("Error in handleSave:", error);
    }
  };

  return (
    <div className="intel-panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-[--color-accent] opacity-70" />
          <div className="section-label text-[--color-text-secondary]">Evolución de sentimiento</div>
        </div>
        {isAdmin && (
          <button onClick={() => setIsEditing(!isEditing)} className="cursor-pointer p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-emerald-500">
            <Edit2 size={14} />
          </button>
        )}
      </div>

      <h2 className="display-title text-base text-[--color-text-primary] mb-3 leading-none">Curva histórica</h2>
      <div className="h-px bg-[--color-panel-border] my-4" />

      {showEditMode ? (
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
              <input type="number" min="0" max="100" placeholder="Cepeda" value={row.cepeda_value || 0} onChange={e => {
                const newData = [...editData];
                newData[i].cepeda_value = parseInt(e.target.value) || 0;
                setEditData(newData);
              }} className="bg-[--color-surface] border border-[--color-panel-border] p-1 rounded w-full"/>
              <input type="number" min="0" max="100" placeholder="Espriella" value={row.espriella_value || 0} onChange={e => {
                const newData = [...editData];
                newData[i].espriella_value = parseInt(e.target.value) || 0;
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
          <div className="h-32 w-full relative flex">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[8px] text-[--color-text-muted] mono-data h-full pr-2">
                <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
            </div>
            
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none" onMouseLeave={() => setTooltip({...tooltip, visible: false})}>
              {/* Grid lines */}
              <line x1="0" y1="25" x2="100" y2="25" stroke="var(--color-panel-border)" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="var(--color-panel-border)" strokeWidth="0.5" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="var(--color-panel-border)" strokeWidth="0.5" />

              {/* Lines */}
              <polyline fill="none" stroke="var(--color-cepeda)" strokeWidth="2" points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.cepeda_value}`).join(' ')} />
              <polyline fill="none" stroke="var(--color-espriella)" strokeWidth="2" points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.espriella_value}`).join(' ')} />

              {/* Interactive points */}
              {data.map((d, i) => {
                const x = (i / (data.length - 1)) * 100;
                return (
                  <g key={d.id}>
                    <circle cx={x} cy={100 - d.cepeda_value} r="3" fill="var(--color-cepeda)" className="cursor-pointer hover:r-4 transition-all" 
                      onMouseEnter={(e) => setTooltip({x: x, y: 100 - d.cepeda_value, text: `Cepeda: ${d.cepeda_value}%`, visible: true})} />
                    <circle cx={x} cy={100 - d.espriella_value} r="3" fill="var(--color-espriella)" className="cursor-pointer hover:r-4 transition-all" 
                      onMouseEnter={(e) => setTooltip({x: x, y: 100 - d.espriella_value, text: `Espriella: ${d.espriella_value}%`, visible: true})} />
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {tooltip.visible && (
                <div className="absolute bg-[--color-surface] border border-[--color-panel-border] p-1 rounded text-[10px] mono-data shadow-lg"
                     style={{ left: `${tooltip.x}%`, top: `${tooltip.y}%` }}>
                    {tooltip.text}
                </div>
            )}
          </div>
          <div className="grid grid-cols-6 mt-1 ml-6">
              {data.map(row => (
                  <span key={row.id} className="text-[8px] text-[--color-text-muted] mono-data text-center">{row.day}</span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
