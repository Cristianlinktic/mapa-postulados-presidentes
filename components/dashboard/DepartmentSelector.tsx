"use client";

import { useStore } from "@/lib/store";
import departments from "@/scripts/departments.json";
import { ChevronDown, MapPin } from "lucide-react";

const sorted = [...departments].sort((a, b) =>
  a.name.localeCompare(b.name, "es-CO")
);

export function DepartmentSelector() {
  const selectedLocationId = useStore((s) => s.selectedLocationId);
  const setSelectedLocationId = useStore((s) => s.setSelectedLocationId);
  const setTriggerDeptFlyTo = useStore((s) => s.setTriggerDeptFlyTo);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const shapeID = e.target.value;
    if (!shapeID) return;
    setSelectedLocationId(shapeID);
    setTriggerDeptFlyTo(shapeID);
  };

  return (
    <div className="intel-panel rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[--color-accent-dim] border border-[--color-accent]/20">
          <MapPin size={11} className="text-[--color-accent]" />
        </div>
        <span className="section-label">Departamento</span>
      </div>

      <div className="relative">
        <select
          value={selectedLocationId ?? ""}
          onChange={handleChange}
          className="w-full appearance-none bg-[--color-surface-elevated] border border-[--color-panel-border] text-[--color-text-primary] text-sm p-2.5 pr-8 rounded-lg outline-none focus:border-[--color-accent] transition-colors cursor-pointer"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          <option value="" disabled>
            — Selecciona un departamento —
          </option>
          {sorted.map((d) => (
            <option key={d.shapeID} value={d.shapeID}>
              {d.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[--color-text-secondary] pointer-events-none"
        />
      </div>
    </div>
  );
}
