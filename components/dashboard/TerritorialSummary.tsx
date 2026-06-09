"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useStore } from "@/lib/store";
import { MapPin, Edit2, Save, X } from "lucide-react";
import departments from "@/scripts/departments.json";

interface TerritorialData {
  shape_id: string;
  name: string;
  poblacion: number;
  censo_electoral: number;
  favorabilidad_cepeda: number;
  favorabilidad_espriella: number;
  sentimiento_predominante: 'Positivo' | 'Negativo' | 'Neutral';
  riesgo_reputacional: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
}

function StatBlock({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="section-title">{label}</div>
      <div
        className="mono-data text-sm font-semibold"
        style={{ color: accent ?? 'var(--color-text-primary)' }}
      >
        {value}
      </div>
    </div>
  );
}

export function TerritorialSummary() {
  const selectedLocationId = useStore((state) => state.selectedLocationId);
  const setCurrentData = useStore((state) => state.setCurrentData);
  const [data, setData] = useState<TerritorialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TerritorialData | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!selectedLocationId) {
        setData(null);
        setCurrentData(null);
        return;
      }
      setLoading(true);
      
      // Look up name dynamically
      const dept = departments.find(d => d.shapeID === selectedLocationId);
      const deptName = dept ? dept.name : 'Desconocido';

      const { data: fetchedData } = await supabase
        .from('territories')
        .select('*')
        .eq('shape_id', selectedLocationId);
      
      if (fetchedData && fetchedData.length > 0) {
        const d = fetchedData[0] as TerritorialData;
        setData(d);
        setFormData(d);
        setCurrentData(d); // Sync store
      } else {
        setData(null);
        setCurrentData(null);
        setFormData({
            shape_id: selectedLocationId,
            name: deptName, // Pre-filled name
            poblacion: 0,
            censo_electoral: 0,
            favorabilidad_cepeda: 0,
            favorabilidad_espriella: 0,
            sentimiento_predominante: 'Neutral',
            riesgo_reputacional: 'Bajo'
        });
      }
      setLoading(false);
    }
    fetchData();
  }, [selectedLocationId, setCurrentData]);

  const handleCreate = async () => {
    if (!formData) return;
    const { error } = await supabase
      .from('territories')
      .insert([formData]);

    if (error) {
      console.error('Error creating data:', error);
    } else {
      setData(formData);
      setCurrentData(formData); // Sync store
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    const { error } = await supabase
      .from('territories')
      .update(formData)
      .eq('shape_id', formData.shape_id);

    if (error) {
      console.error('Error updating data:', error);
    } else {
      setData(formData);
      setCurrentData(formData); // Sync store
      setIsEditing(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-xs" style={{ color: 'rgba(241,240,237,0.3)' }}>Cargando datos...</div>;
  }

  if (!data) {
    if (selectedLocationId && formData) {
        return (
            <div className="p-5 space-y-4 text-white">
                <h3 className="font-bold">Configurar datos de región</h3>
                
                <div className="space-y-1">
                    <label className="text-xs text-white/60">Departamento</label>
                    <div className="text-sm bg-white/5 p-2 rounded text-white">{formData.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-white/60">Población</label>
                        <input type="number" value={formData.poblacion} onChange={e => setFormData({...formData, poblacion: parseInt(e.target.value)})} className="w-full bg-white/10 p-2 rounded" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-white/60">Censo Electoral</label>
                        <input type="number" value={formData.censo_electoral} onChange={e => setFormData({...formData, censo_electoral: parseInt(e.target.value)})} className="w-full bg-white/10 p-2 rounded" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-white/60">Fav. Cepeda (%)</label>
                        <input type="number" value={formData.favorabilidad_cepeda} onChange={e => setFormData({...formData, favorabilidad_cepeda: parseInt(e.target.value)})} className="w-full bg-white/10 p-2 rounded" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-white/60">Fav. Espriella (%)</label>
                        <input type="number" value={formData.favorabilidad_espriella} onChange={e => setFormData({...formData, favorabilidad_espriella: parseInt(e.target.value)})} className="w-full bg-white/10 p-2 rounded" />
                    </div>
                </div>

                <button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold">Crear registro en base de datos</button>
            </div>
        )
    }
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-3 text-center py-8">
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <MapPin size={16} style={{ color: 'rgba(201,168,76,0.4)' }} />
        </div>
        <div>
          <div className="section-label mb-1">Región no seleccionada</div>
          <p className="text-xs" style={{ color: 'rgba(241,240,237,0.3)' }}>
            Haz clic sobre un departamento en el mapa para ver su análisis territorial.
          </p>
        </div>
      </div>
    );
  }

  if (isEditing && formData) {
    return (
      <div className="p-5 space-y-4 text-white">
        <h3 className="font-bold">Editar {data.name}</h3>
        
        <div className="space-y-1">
            <label className="text-xs text-white/60">Departamento</label>
            <div className="text-sm bg-white/5 p-2 rounded text-white">{formData.name}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs text-white/60">Población</label>
                <input type="number" value={formData.poblacion} onChange={e => setFormData({...formData, poblacion: parseInt(e.target.value)})} className="w-full bg-white/10 p-2 rounded" />
            </div>
            <div className="space-y-1">
                <label className="text-xs text-white/60">Censo Electoral</label>
                <input type="number" value={formData.censo_electoral} onChange={e => setFormData({...formData, censo_electoral: parseInt(e.target.value)})} className="w-full bg-white/10 p-2 rounded" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs text-white/60">Fav. Cepeda (%)</label>
                <input type="number" value={formData.favorabilidad_cepeda} onChange={e => setFormData({...formData, favorabilidad_cepeda: parseInt(e.target.value)})} className="w-full bg-white/10 p-2 rounded" />
            </div>
            <div className="space-y-1">
                <label className="text-xs text-white/60">Fav. Espriella (%)</label>
                <input type="number" value={formData.favorabilidad_espriella} onChange={e => setFormData({...formData, favorabilidad_espriella: parseInt(e.target.value)})} className="w-full bg-white/10 p-2 rounded" />
            </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave} className="flex items-center gap-1 bg-green-600 px-3 py-1 rounded text-sm flex-1 justify-center font-bold"><Save size={14}/> Guardar</button>
          <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded text-sm flex-1 justify-center font-bold"><X size={14}/> Cancelar</button>
        </div>
      </div>
    );
  }

  const cepedaLeads = data.favorabilidad_cepeda > data.favorabilidad_espriella;
  const gap = Math.abs(data.favorabilidad_cepeda - data.favorabilidad_espriella);

  return (
    <div className="p-5">
      <div className="flex items-start justify-between mb-4 p-3 rounded-lg bg-white/[0.05] border border-white/[0.1]">
        <div>
          <div className="section-label mb-1">Análisis territorial</div>
          <div className="flex items-center gap-2">
            <h2 className="display-title text-lg text-white leading-tight">{data.name}</h2>
            <button onClick={() => setIsEditing(true)}><Edit2 size={14} className="text-white/50 hover:text-white"/></button>
          </div>
        </div>
        <div
          className={`shrink-0 px-2 py-1 rounded text-[9px] mono-data uppercase tracking-widest border
            ${cepedaLeads ? 'bg-cepeda/[0.08] border-cepeda/[0.2] text-cepeda' : 'bg-espriella/[0.08] border-espriella/[0.2] text-espriella'}
          `}
        >
          {cepedaLeads ? 'Cepeda +' : 'Espriella +'}{gap}pts
        </div>
      </div>

      <div className="gold-divider" />

      <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4">
        <StatBlock
          label="Población"
          value={data.poblacion.toLocaleString('es-CO')}
        />
        <StatBlock
          label="Censo Electoral"
          value={data.censo_electoral.toLocaleString('es-CO')}
        />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="section-title mb-0 text-cepeda/80">
              Cepeda
            </span>
            <span className="mono-data text-sm font-semibold text-cepeda">
              {data.favorabilidad_cepeda}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-1000 ease-out bg-cepeda"
              style={{
                width: `${data.favorabilidad_cepeda}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="section-title mb-0 text-espriella/80">
              De la Espriella
            </span>
            <span className="mono-data text-sm font-semibold text-espriella">
              {data.favorabilidad_espriella}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-1000 ease-out bg-espriella"
              style={{
                width: `${data.favorabilidad_espriella}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
