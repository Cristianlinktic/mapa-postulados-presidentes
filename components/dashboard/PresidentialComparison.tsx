import { mockCandidateComparison, CandidateData } from "@/lib/data/candidateData";

export function PresidentialComparison() {
  const cepeda = mockCandidateComparison.cepeda;
  const espriella = mockCandidateComparison.espriella;

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4 text-center tracking-tight">Comparador Presidencial</h2>
      <div className="grid grid-cols-2 gap-4">
        <CandidateCard data={cepeda} color="border-green-500" />
        <CandidateCard data={espriella} color="border-blue-500" />
      </div>
    </div>
  );
}

function CandidateCard({ data, color }: { data: CandidateData; color: string }) {
  return (
    <div className={`p-4 border-t-2 ${color} bg-zinc-950/50 rounded-lg`}>
      <h3 className="text-sm font-semibold mb-3">{data.name}</h3>
      <div className="text-xs space-y-2 text-zinc-300">
        <div className="flex justify-between"><span>Favorabilidad</span> <span className="font-bold text-white">{data.favorabilidad}%</span></div>
        <div className="flex justify-between"><span>Negatividad</span> <span className="font-bold text-white">{data.negatividad}%</span></div>
      </div>
    </div>
  );
}
