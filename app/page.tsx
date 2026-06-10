"use client";

import { useStore } from "@/lib/store";
import MapContainer from "@/components/map/MapContainer";
import { TerritorialSummary } from "@/components/dashboard/TerritorialSummary";
import { PresidentialComparison } from "@/components/dashboard/PresidentialComparison";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { NarrativeRadar } from "@/components/dashboard/NarrativeRadar";
import { ReputationRisk } from "@/components/dashboard/ReputationRisk";
import { TrendPulse } from "@/components/dashboard/TrendPulse";
import { ThemeFilter } from "@/components/dashboard/ThemeFilter";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { LogOut } from "lucide-react";

export default function Home() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("intel_user");
  };

  return (
    <div className="flex flex-col h-screen p-4 gap-3 overflow-hidden bg-[--color-void] text-[--color-text-primary]">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="intel-panel rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 relative overflow-hidden">
        {/* Decorative scanline */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[--color-accent] to-transparent opacity-50" />
        
        {/* Brand & Metrics */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="display-title text-4xl">
              COLOMBIA{" "}
              <span className="text-[--color-accent]">2026</span>
            </h1>
            <div className="section-label mt-1 text-[--color-text-secondary]">
              Centro de Inteligencia Electoral — Nodo Central
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-500" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="mono-data text-[9px] uppercase tracking-widest text-emerald-600">
              Sistema en vivo
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-3 border-r border-[--color-panel-border] pr-4">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-[--color-text-primary]">{user.username}</span>
                <span className={`text-[9px] uppercase tracking-widest font-extrabold ${user.role === 'admin' ? 'text-[--color-accent]' : 'text-[--color-text-muted]'}`}>
                  {user.role === 'admin' ? 'Administrador' : 'Lector'}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="cursor-pointer p-2 rounded-lg bg-[--color-surface-elevated] border border-[--color-panel-border] text-[--color-text-secondary] hover:text-[--color-alert] hover:bg-[--color-alert]/5 transition-all"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ThemeFilter />
          </div>
        </div>
      </header>


      {/* ── TREND TICKER ───────────────────────────────────── */}
      <TrendPulse />

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div className="flex flex-1 gap-3 min-h-0">

        {/* MAP */}
        <main className="flex-1 relative intel-panel rounded-2xl overflow-hidden min-h-0">
          <MapContainer />
        </main>

        {/* SIDEBAR */}
        <aside className="w-[340px] flex flex-col gap-3 overflow-y-auto pr-2 pb-4">
          <AIInsights />

          <div className="intel-panel rounded-2xl">
            <TerritorialSummary />
          </div>

          <div className="intel-panel rounded-2xl">
            <PresidentialComparison />
          </div>

          <div className="intel-panel rounded-2xl">
            <SentimentChart />
          </div>

          <div className="intel-panel rounded-2xl">
            <NarrativeRadar />
          </div>

          <div className="intel-panel rounded-2xl pb-2">
            <ReputationRisk />
          </div>
        </aside>
      </div>
    </div>
  );
}
