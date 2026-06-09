import MapContainer from "@/components/map/MapContainer";
import { TerritorialSummary } from "@/components/dashboard/TerritorialSummary";
import { PresidentialComparison } from "@/components/dashboard/PresidentialComparison";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { NarrativeRadar } from "@/components/dashboard/NarrativeRadar";
import { ReputationRisk } from "@/components/dashboard/ReputationRisk";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 p-6 gap-6">
      <header className="flex justify-between items-center py-4 px-6 glass-panel rounded-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-white">Colombia Electoral 2026</h1>
        <div className="text-sm text-zinc-400 font-medium">Centro de Monitoreo en Tiempo Real</div>
      </header>
      <div className="flex flex-1 gap-6">
        <main className="flex-1 relative glass-panel rounded-3xl overflow-hidden border-zinc-800">
          <MapContainer />
        </main>
        <aside className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="glass-panel rounded-2xl p-0">
             <TerritorialSummary />
          </div>
          <div className="glass-panel rounded-2xl p-0">
             <PresidentialComparison />
          </div>
          <div className="glass-panel rounded-2xl p-0">
             <SentimentChart />
          </div>
          <div className="glass-panel rounded-2xl p-0">
             <NarrativeRadar />
          </div>
          <div className="glass-panel rounded-2xl p-0">
             <ReputationRisk />
          </div>
        </aside>
      </div>
    </div>
  );
}
