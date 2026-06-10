"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { Radio, Edit2, Save, X, Plus, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NarrativeItem {
  id: string;
  shape_id: string;
  candidate_name: string;
  category: 'positive' | 'negative' | 'emerging';
  text: string;
}

export function NarrativeRadar() {
  const selectedLocationId = useStore((state) => state.selectedLocationId);
  const user = useStore((state) => state.user);
  const [items, setItems] = useState<NarrativeItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';
  const showEditMode = isEditing && isAdmin;

  useEffect(() => {
    if (!selectedLocationId) return;
    fetchNarrativeItems();
  }, [selectedLocationId]);

  async function fetchNarrativeItems() {
    const { data } = await supabase.from('narrative_radar_items').select('*').eq('shape_id', selectedLocationId!);
    setItems(data || []);
  }

  const addItem = async (candidate: string, category: NarrativeItem['category']) => {
    if (!isAdmin) return;
    const newItem = { 
        id: crypto.randomUUID(),
        shape_id: selectedLocationId!, 
        candidate_name: candidate, 
        category, 
        text: 'Nuevo ítem' 
    };
    const { error } = await supabase.from('narrative_radar_items').insert(newItem);
    
    if (error) {
        if (error.code === '23503') {
            setError("Error: Primero debes configurar los datos básicos de este departamento.");
            setTimeout(() => setError(null), 5000);
        } else {
            console.error("Error al agregar:", error);
        }
    } else {
        fetchNarrativeItems();
    }
  };

  const updateItem = async (id: string, text: string) => {
    if (!isAdmin) return;
    const newItems = items.map(item => item.id === id ? { ...item, text } : item);
    setItems(newItems);
    await supabase.from('narrative_radar_items').update({ text }).eq('id', id);
  };

  const deleteItem = async (id: string) => {
    if (!isAdmin) return;
    await supabase.from('narrative_radar_items').delete().eq('id', id);
    fetchNarrativeItems();
  };

  if (!selectedLocationId) return <div className="p-5 text-sm text-white/50">Selecciona una región.</div>;

  const renderCategory = (candidate: string, category: NarrativeItem['category'], title: string, colorVar: string) => {
    const filtered = items.filter(i => i.candidate_name === candidate && i.category === category);
    return (
      <div className="space-y-1.5">
        <div className="section-title" style={{ color: `var(${colorVar})` }}>{showEditMode ? '' : '◈'} {title}</div>
        <ul className="space-y-1">
          {filtered.map(item => (
            <li key={item.id} className="flex items-start gap-2 text-xs text-[--color-text-secondary]">
              {showEditMode ? (
                <div className="flex items-center gap-2 w-full">
                  <input value={item.text} onChange={(e) => updateItem(item.id, e.target.value)} className="bg-[--color-surface] p-1 rounded flex-1 text-[--color-text-primary] text-xs border border-[--color-panel-border]"/>
                  <button onClick={() => deleteItem(item.id)} className="text-[--color-alert] p-1 shrink-0 cursor-pointer"><Trash2 size={14}/></button>
                </div>
              ) : (
                <><span className="mt-1 w-1 h-1 rounded-full bg-[--color-text-muted] shrink-0"></span><span>{item.text}</span></>
              )}
            </li>
          ))}
          {showEditMode && <button onClick={() => addItem(candidate, category)} className="text-xs text-[--color-accent] flex items-center gap-1 cursor-pointer"><Plus size={12}/> Agregar</button>}
        </ul>
      </div>
    );
  };

  return (
    <div className="intel-panel p-5 relative rounded-lg">
      <AnimatePresence>
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-2 right-2 z-50 bg-[--color-surface] text-[--color-alert] text-xs p-3 rounded-lg flex items-center gap-2 shadow-xl border border-[--color-alert]/20"
            >
                <AlertCircle size={16} />
                {error}
            </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Radio className="text-[--color-accent] opacity-70" size={12}/><div className="section-label">Radar de narrativas</div></div>
        {isAdmin && (
          <button className="cursor-pointer p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors" onClick={() => setIsEditing(!isEditing)}><Edit2 size={14} className="text-emerald-500"/></button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {['Cepeda', 'Espriella'].map(cand => (
          <div key={cand} className="space-y-4">
            <div className="mono-data text-[10px] font-bold uppercase tracking-widest pb-1.5 border-b border-[--color-panel-border] text-[--color-accent]">{cand}</div>
            {renderCategory(cand, 'positive', '↑ Positivo', '--color-cepeda')}
            {renderCategory(cand, 'negative', '↓ Negativo', '--color-alert')}
            {renderCategory(cand, 'emerging', 'Emergente', '--color-warning')}
            </div>
            ))}
      </div>
      {showEditMode && <button onClick={() => setIsEditing(false)} className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 p-2 rounded text-xs font-bold text-white transition-colors cursor-pointer">Guardar</button>}
    </div>
  );
}
