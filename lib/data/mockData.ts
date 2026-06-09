export interface TerritorialData {
  id: string;
  name: string;
  poblacion: number;
  censoElectoral: number;
  favorabilidadCepeda: number;
  favorabilidadDeLaEspriella: number;
  sentimientoPredominante: 'Positivo' | 'Negativo' | 'Neutral';
  riesgoReputacional: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
}

// Function to generate pseudo-random data for demonstration
const generateRandomData = (id: string, name: string): TerritorialData => ({
  id,
  name,
  poblacion: Math.floor(Math.random() * 2000000) + 100000,
  censoElectoral: Math.floor(Math.random() * 1000000) + 50000,
  favorabilidadCepeda: Math.floor(Math.random() * 100),
  favorabilidadDeLaEspriella: Math.floor(Math.random() * 100),
  sentimientoPredominante: ['Positivo', 'Negativo', 'Neutral'][Math.floor(Math.random() * 3)] as 'Positivo' | 'Negativo' | 'Neutral',
  riesgoReputacional: ['Bajo', 'Medio', 'Alto', 'Crítico'][Math.floor(Math.random() * 4)] as 'Bajo' | 'Medio' | 'Alto' | 'Crítico',
});

const departments = [
  {"shapeID": "13589884B36646919284035", "name": "Caldas"},
  {"shapeID": "13589884B76063723503478", "name": "Amazonas"},
  {"shapeID": "13589884B75246552958907", "name": "Meta"},
  {"shapeID": "13589884B23733272568917", "name": "Cundinamarca"},
  {"shapeID": "13589884B56780975975491", "name": "Tolima"},
  {"shapeID": "13589884B3780741375954", "name": "Antioquia"},
  {"shapeID": "13589884B77991835419453", "name": "Atlántico"},
  {"shapeID": "13589884B96168520946689", "name": "Bolívar"},
  {"shapeID": "13589884B76435085510886", "name": "Cesar"},
  {"shapeID": "13589884B85940101840667", "name": "Magdalena"},
  {"shapeID": "13589884B67390718500375", "name": "Sucre"},
  {"shapeID": "13589884B54743798138783", "name": "Córdoba"},
  {"shapeID": "13589884B66570655136682", "name": "La Guajira"},
  {"shapeID": "13589884B53668371411224", "name": "Chocó"},
  {"shapeID": "13589884B83777567082486", "name": "Valle del Cauca"},
  {"shapeID": "13589884B27060143959141", "name": "Norte de Santander"},
  {"shapeID": "13589884B61455559641217", "name": "Quindío"},
  {"shapeID": "13589884B14692588923622", "name": "Vichada"},
  {"shapeID": "13589884B22408468869829", "name": "Vaupés"},
  {"shapeID": "13589884B55612798068582", "name": "Santander"},
  {"shapeID": "13589884B85526028135750", "name": "Risaralda"},
  {"shapeID": "13589884B42325644495938", "name": "Putumayo"},
  {"shapeID": "13589884B81785725414319", "name": "Nariño"},
  {"shapeID": "13589884B51885004571697", "name": "Guaviare"},
  {"shapeID": "13589884B67034552102836", "name": "Guainía"},
  {"shapeID": "13589884B40908771570386", "name": "Bogota Capital District"},
  {"shapeID": "13589884B25788978851461", "name": "Arauca"},
  {"shapeID": "13589884B62290921297491", "name": "Boyacá"},
  {"shapeID": "13589884B21818736641406", "name": "Casanare"},
  {"shapeID": "13589884B79790550435280", "name": "Cauca"},
  {"shapeID": "13589884B16144547040567", "name": "Caquetá"},
  {"shapeID": "13589884B32024052187233", "name": "Huila"},
  {"shapeID": "13589884B18807997781037", "name": "Archipiélago de San Andrés, Providencia y Santa Catalina"}
];

export const mockTerritorialData: Record<string, TerritorialData> = departments.reduce((acc, dept) => {
  acc[dept.shapeID] = generateRandomData(dept.shapeID, dept.name);
  return acc;
}, {} as Record<string, TerritorialData>);
