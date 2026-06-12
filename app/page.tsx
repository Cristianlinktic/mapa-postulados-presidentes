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
import { DepartmentSelector } from "@/components/dashboard/DepartmentSelector";
import { LogOut } from "lucide-react";

export default function Home() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("intel_user");
  };

  return (
    <div className="flex flex-col p-3 md:p-4 gap-3 bg-[--color-void] text-[--color-text-primary] md:h-screen md:overflow-hidden">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="intel-panel rounded-2xl px-4 py-3 md:px-6 md:py-5 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[--color-accent] to-transparent opacity-50" />

        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex flex-col min-w-0">
            <h1 className="display-title text-2xl md:text-4xl leading-none">
              COLOMBIA{" "}
              <span className="text-[--color-accent]">2026</span>
            </h1>
            <div className="section-label mt-1 text-[--color-text-secondary]">
              Centro de Inteligencia Electoral
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-500" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="mono-data text-[9px] uppercase tracking-widest text-emerald-600 hidden sm:inline">
                En vivo
              </span>
            </div>

            <ThemeToggle />

            {/* ThemeFilter solo en desktop */}
            <div className="hidden md:block">
              <ThemeFilter />
            </div>

            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-[--color-text-primary]">
                    {user.username}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-extrabold ${
                      user.role === "admin"
                        ? "text-[--color-accent]"
                        : "text-[--color-text-muted]"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "Lector"}
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
          </div>
        </div>
      </header>

      {/* ── TREND TICKER ───────────────────────────────────── */}
      <TrendPulse />

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      {/*
        Mobile:  columna — mapa arriba (altura fija), info abajo (scroll de página)
        Desktop: fila   — mapa flex-1, sidebar fija con su propio scroll
      */}
      <div className="flex flex-col md:flex-row gap-3 md:flex-1 md:min-h-0 md:overflow-hidden">

        {/* MAP */}
        <main className="h-[45vh] md:h-auto md:flex-1 relative intel-panel rounded-2xl overflow-hidden shrink-0">
          <MapContainer />
        </main>

        {/* INFO */}
        <aside className="flex flex-col gap-3 pb-6 md:pb-4 md:w-[340px] md:overflow-y-auto md:pr-2">
          <DepartmentSelector />
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
