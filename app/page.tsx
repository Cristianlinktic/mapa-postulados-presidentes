import MapContainer from "@/components/map/MapContainer";
import { TerritorialSummary } from "@/components/dashboard/TerritorialSummary";
import { PresidentialComparison } from "@/components/dashboard/PresidentialComparison";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { NarrativeRadar } from "@/components/dashboard/NarrativeRadar";
import { ReputationRisk } from "@/components/dashboard/ReputationRisk";
import { TrendPulse } from "@/components/dashboard/TrendPulse";
import { ThemeFilter } from "@/components/dashboard/ThemeFilter";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { CriticalAlerts } from "@/components/dashboard/CriticalAlerts";

export default function Home() {
  return (
    <div className="flex flex-col h-screen p-4 gap-3 overflow-hidden" style={{ background: 'var(--color-void)' }}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="intel-panel rounded-2xl px-6 py-3 flex justify-between items-center shrink-0">
        {/* Left: Branding */}
        <div className="flex items-center gap-5">
          {/* Colombia flag accent */}
          <div className="flex flex-col gap-0.5 shrink-0">
            <div className="w-6 h-1 rounded-full" style={{ background: 'var(--color-gold)' }} />
            <div className="w-6 h-1 rounded-full" style={{ background: 'var(--color-espriella)' }} />
            <div className="w-6 h-1 rounded-full" style={{ background: 'var(--color-alert)' }} />
          </div>

          <div>
            <div className="section-label mb-0.5">Centro de Inteligencia Electoral</div>
            <h1 className="display-title text-xl text-[#F1F0ED] leading-none">
              COLOMBIA{" "}
              <span style={{ color: 'var(--color-gold)' }}>2026</span>
            </h1>
          </div>

          {/* Classified stamp */}
          <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1 border rounded"
            style={{ borderColor: 'rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.04)' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="rgba(201,168,76,0.6)" strokeWidth="1"/>
              <path d="M5 2v3l2 1.5" stroke="rgba(201,168,76,0.6)" strokeWidth="0.8" strokeLinecap="round"/>
            </svg>
            <span className="mono-data text-[9px] uppercase tracking-widest" style={{ color: 'rgba(201,168,76,0.6)' }}>
              Actualización continua
            </span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          <ThemeFilter />

          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ borderColor: 'rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.05)' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: 'var(--color-cepeda)' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ background: 'var(--color-cepeda)' }} />
            </span>
            <span className="mono-data text-[9px] uppercase tracking-widest"
              style={{ color: 'rgba(16,185,129,0.8)' }}>
              Sistema en vivo
            </span>
          </div>
        </div>
      </header>

      {/* ── TREND TICKER ───────────────────────────────────── */}
      <TrendPulse />

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div className="flex flex-1 gap-3 min-h-0">

        {/* MAP */}
        <main className="flex-1 relative intel-panel rounded-2xl overflow-hidden min-h-0">
          <CriticalAlerts />
          <MapContainer />
        </main>

        {/* SIDEBAR */}
        <aside className="w-[340px] flex flex-col gap-3 overflow-y-auto pr-1">
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
