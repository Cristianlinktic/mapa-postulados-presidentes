"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useStore } from "@/lib/store";
import { MapPin, Edit2, Save, X } from "lucide-react";
import departments from "@/scripts/departments.json";

export interface TerritorialData {
  shape_id: string;
  name: string;
  poblacion: number;
  censo_electoral: number;
  favorabilidad_cepeda: number;
  favorabilidad_espriella: number;
  sentimiento_predominante: string;
  riesgo_reputacional: string;
}

export function TerritorialSummary() {
  const selectedLocationId = useStore((state) => state.selectedLocationId);
  const currentData = useStore((state) => state.currentData);
  const setCurrentData = useStore((state) => state.setCurrentData);
  const user = useStore((state) => state.user);
  const isAdmin = user?.role === 'admin';
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TerritorialData | null>(null);
  const [loading, setLoading] = useState(false);
  const showEditMode = isEditing && isAdmin;

  const fetchData = async (isRefresh = false) => {
    if (!selectedLocationId) return;
    
    if (!isRefresh) {
        setLoading(true);
        setCurrentData(null);
        setFormData(null);
    }
    
    const { data: fetchedData, error } = await supabase.from('territories').select('*').eq('shape_id', selectedLocationId!).maybeSingle();
    
    if (fetchedData) {
      setCurrentData(fetchedData);
      setFormData(fetchedData);
    } else {
      const dept = departments.find(d => d.shapeID === selectedLocationId);
      const initialFormData = {
          shape_id: selectedLocationId!,
          name: dept?.name || 'Desconocido',
          poblacion: 0,
          censo_electoral: 0,
          favorabilidad_cepeda: 0,
          favorabilidad_espriella: 0,
          sentimiento_predominante: 'Neutral',
          riesgo_reputacional: 'Bajo'
      };
      setFormData(initialFormData);
      setCurrentData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedLocationId]);

  const handleSave = async () => {
    if (!isAdmin || !formData) return;
    setLoading(true);
    const { data: savedData, error } = await supabase
        .from('territories')
        .upsert(formData)
        .select()
        .single();

    if (error) {
        console.error('Error saving territory:', error);
        setLoading(false);
    } else if (savedData) { 
      setCurrentData(savedData);
      setFormData(savedData);
      setIsEditing(false); 
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-accent]"></div>
        <div className="text-xs text-[--color-text-secondary] mono-data uppercase tracking-widest">Procesando...</div>
      </div>
    );
  }

  // Unified Form for Edit and Create
  if (showEditMode || (isAdmin && !currentData && selectedLocationId && formData)) {
    if (!formData) return null;
    const isCreating = !currentData;
    return (
        <div className="p-5 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                 <div className={`w-2 h-2 rounded-full ${isCreating ? 'bg-amber-500 animate-pulse' : 'bg-[--color-accent]'}`} />
                 <h3 className="font-bold text-[--color-text-primary] text-sm uppercase tracking-wider">
                     {isCreating ? 'Configurar región' : `Editar ${currentData?.name}`}
                 </h3>
             </div>
             
             <div className="space-y-1">
                 <label className="text-[10px] uppercase tracking-widest text-[--color-text-secondary] font-bold">Departamento</label>
                 <div className="text-sm bg-[--color-void] p-3 rounded-lg text-[--color-text-primary] border border-[--color-panel-border] font-bold">{formData.name}</div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                     <label className="text-[10px] uppercase tracking-widest text-[--color-text-secondary]">Población</label>
                     <input type="number" value={formData.poblacion} onChange={e => setFormData({...formData, poblacion: parseInt(e.target.value) || 0})} className="w-full bg-[--color-surface] border border-[--color-panel-border] p-2 rounded text-sm text-[--color-text-primary] focus:border-[--color-accent] outline-none transition-colors" />
                 </div>
                 <div className="space-y-1">
                     <label className="text-[10px] uppercase tracking-widest text-[--color-text-secondary]">Censo Electoral</label>
                     <input type="number" value={formData.censo_electoral} onChange={e => setFormData({...formData, censo_electoral: parseInt(e.target.value) || 0})} className="w-full bg-[--color-surface] border border-[--color-panel-border] p-2 rounded text-sm text-[--color-text-primary] focus:border-[--color-accent] outline-none transition-colors" />
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                     <label className="text-[10px] uppercase tracking-widest text-[--color-text-secondary]">Fav. Cepeda (%)</label>
                     <input type="number" value={formData.favorabilidad_cepeda} onChange={e => setFormData({...formData, favorabilidad_cepeda: parseInt(e.target.value) || 0})} className="w-full bg-[--color-surface] border border-[--color-panel-border] p-2 rounded text-sm text-[--color-text-primary] focus:border-[--color-accent] outline-none transition-colors" />
                 </div>
                 <div className="space-y-1">
                     <label className="text-[10px] uppercase tracking-widest text-[--color-text-secondary]">Fav. Espriella (%)</label>
                     <input type="number" value={formData.favorabilidad_espriella} onChange={e => setFormData({...formData, favorabilidad_espriella: parseInt(e.target.value) || 0})} className="w-full bg-[--color-surface] border border-[--color-panel-border] p-2 rounded text-sm text-[--color-text-primary] focus:border-[--color-accent] outline-none transition-colors" />
                 </div>
             </div>

             <div className="flex gap-2 pt-2">
                 <button onClick={handleSave} className="flex-1 cursor-pointer bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg font-bold text-white transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
                     <Save size={16}/> {isCreating ? 'Crear registro' : 'Guardar cambios'}
                 </button>
                 {isEditing && (
                     <button onClick={() => setIsEditing(false)} className="px-4 cursor-pointer bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg font-bold text-red-500 transition-all flex items-center justify-center">
                         <X size={16}/>
                     </button>
                 )}
             </div>
         </div>
     )
   }

   if (!currentData) {
     const hasSelected = !!selectedLocationId;
     return (
       <div className="p-6 flex flex-col items-center justify-center gap-3 text-center py-8">
         <div className="w-10 h-10 rounded-full flex items-center justify-center"
           style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-panel-border)' }}>
           <MapPin size={16} className="text-[--color-accent]" />
         </div>
         <div>
           <div className="section-label mb-1 text-[--color-text-secondary]">
             {hasSelected ? 'Sin datos registrados' : 'Región no seleccionada'}
           </div>
           <p className="text-xs text-[--color-text-muted]">
             {hasSelected 
               ? 'No hay información disponible para este departamento en el sistema.' 
               : 'Haz clic sobre un departamento en el mapa para ver su análisis territorial.'}
           </p>
         </div>
       </div>
     );
   }

   const cepedaLeads = currentData.favorabilidad_cepeda > currentData.favorabilidad_espriella;
   const gap = Math.abs(currentData.favorabilidad_cepeda - currentData.favorabilidad_espriella);

   return (
     <div className="p-5">
       <div className="flex items-start justify-between mb-4 p-3 rounded-lg bg-[--color-surface-elevated] border border-[--color-panel-border]">
         <div>
           <div className="section-label mb-1 text-[--color-text-secondary]">Análisis territorial</div>
           <div className="flex items-center gap-2">
             <h2 className="display-title text-lg text-[--color-text-primary] leading-tight">{currentData.name}</h2>
             {isAdmin && (
               <button className="cursor-pointer p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors" onClick={() => setIsEditing(true)}>
                 <Edit2 size={14} className="text-emerald-500"/>
               </button>
             )}
           </div>
         </div>
         <div
           className={`shrink-0 px-2 py-1 rounded text-[9px] mono-data uppercase tracking-widest border
             ${cepedaLeads ? 'bg-[--color-cepeda]/10 border-[--color-cepeda]/20 text-[--color-cepeda]' : 'bg-[--color-espriella]/10 border-[--color-espriella]/20 text-[--color-espriella]'}
           `}
         >
           {cepedaLeads ? 'Cepeda +' : 'Espriella +'}{gap}pts
         </div>
       </div>

       <div className="h-px bg-[--color-panel-border] my-4" />


      <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4">
        <StatBlock
          label="Población"
          value={currentData.poblacion.toLocaleString('es-CO')}
        />
        <StatBlock
          label="Censo Electoral"
          value={currentData.censo_electoral.toLocaleString('es-CO')}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="section-title mb-0 text-[--color-cepeda]">
              Cepeda
            </span>
            <span className="mono-data text-sm font-black text-[--color-cepeda-text]">
              {currentData.favorabilidad_cepeda}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-[--color-void] rounded-full overflow-hidden relative border border-[--color-panel-border]">
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: `${currentData.favorabilidad_cepeda}%`,
                background: 'linear-gradient(to right, var(--color-cepeda), var(--color-cepeda))',
                boxShadow: '0 0 12px var(--color-cepeda)'
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="section-title mb-0 text-[--color-espriella]">
              De la Espriella
            </span>
            <span className="mono-data text-sm font-black text-[--color-espriella-text]">
              {currentData.favorabilidad_espriella}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-[--color-void] rounded-full overflow-hidden relative border border-[--color-panel-border]">
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: `${currentData.favorabilidad_espriella}%`,
                background: 'linear-gradient(to right, var(--color-espriella), var(--color-espriella))',
                boxShadow: '0 0 12px var(--color-espriella)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <div className="section-label mb-1 text-[--color-text-secondary]">{label}</div>
            <div className="mono-data text-sm font-bold text-[--color-text-primary]">{value}</div>
        </div>
    )
}
