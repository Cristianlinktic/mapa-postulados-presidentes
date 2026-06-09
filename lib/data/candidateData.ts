export interface CandidateData {
  name: string;
  favorabilidad: number;
  negatividad: number;
  engagement: number;
  alcance: number;
  riesgo: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
}

export const mockCandidateComparison: Record<string, CandidateData> = {
  cepeda: {
    name: "Iván Cepeda",
    favorabilidad: 45,
    negatividad: 30,
    engagement: 75,
    alcance: 80,
    riesgo: 'Medio'
  },
  espriella: {
    name: "Abelardo de la Espriella",
    favorabilidad: 40,
    negatividad: 45,
    engagement: 85,
    alcance: 70,
    riesgo: 'Alto'
  }
};
