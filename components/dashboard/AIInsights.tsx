"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { Cpu, Edit2, Save, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import departments from "@/scripts/departments.json";

export function AIInsights() {
  const theme = useStore((state) => state.currentTheme);
  const locationId = useStore((state) => state.selectedLocationId);
  const [narrative, setNarrative] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Look up region name
  const dept = departments.find(d => d.shapeID === locationId);
  const regionName = locationId ? (dept ? dept.name : 'Región desconocida') : 'General';

  useEffect(() => {
    async function fetchNarrative() {
      setLoading(true);

      // Construimos la consulta base
      let query = supabase.from('narratives').select('*').eq('theme', theme);

      if (locationId) {
        query = query.eq('shape_id', locationId);
      } else {
        query = query.is('shape_id', null);
      }

      const { data } = await query.maybeSingle();

      if (data) {
        setNarrative(data.text);
        setEditValue(data.text);
      } else {
        setNarrative(`No hay análisis disponible para ${locationId ? 'esta región y ' : ''}temática.`);
        setEditValue("");
      }
      setLoading(false);
    }
    fetchNarrative();
  }, [locationId, theme]);

  const handleSave = async () => {
    // Upsert usando la región actual (puede ser null) y el tema
    const { error: saveError } = await supabase
        .from('narratives')
        .upsert({ 
            shape_id: locationId || null, 
            theme: theme, 
            text: editValue 
        }); 

    if (!saveError) {
        setNarrative(editValue);
        setIsEditing(false);
    } else {
        if (saveError.code === '23503') {
            setError("Error: Primero debes configurar los datos básicos de este departamento.");
            setTimeout(() => setError(null), 5000);
        } else {
            console.error("Error guardando:", saveError);
        }
    }
  };

  return (
    <div className="intel-panel rounded-2xl p-5 relative">
      <AnimatePresence>
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-2 right-2 z-50 bg-[--color-alert] text-white text-xs p-3 rounded-lg flex items-center gap-2 shadow-xl border border-[--color-panel-border]"
            >
                <AlertCircle size={16} />
                {error}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[--color-accent-dim] border border-[--color-accent]/20">
            <Cpu size={13} className="text-[--color-accent]" />
          </div>
          <div>
            <div className="section-label">Análisis de IA</div>
            <div className="mono-data text-[10px] text-[--color-text-secondary]">Tema: {theme}</div>
          </div>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="text-[--color-text-muted] hover:text-[--color-text-primary]">
            <Edit2 size={14} />
        </button>
      </div>

      <div className="h-px bg-[--color-panel-border] my-4" />

      {loading ? (
        <p className="text-sm italic text-[--color-text-secondary] mt-2">Cargando...</p>
      ) : isEditing ? (
        <div className="space-y-3 mt-4">
            <div className="flex justify-between text-xs text-[--color-text-secondary]">
                <span>{regionName}</span>
                <span>Tema: {theme}</span>
            </div>
            <textarea value={editValue} onChange={e => setEditValue(e.target.value)} className="w-full bg-[--color-surface] p-2 text-sm text-[--color-text-primary] border border-[--color-panel-border] rounded min-h-[100px]"/>
            <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 px-3 py-1 rounded text-sm text-white font-bold"><Save size={14}/> Guardar</button>
                <button onClick={() => setIsEditing(false)} className="flex-1 flex items-center justify-center gap-1 bg-red-600 px-3 py-1 rounded text-sm text-white font-bold"><X size={14}/> Cancelar</button>
            </div>
        </div>
      ) : (
        <p className="tech-border text-sm leading-relaxed italic text-[--color-text-secondary] mt-2">
            "{narrative}"
        </p>
      )}
    </div>
  );
}
