import { create } from 'zustand';
import { TerritorialData } from "@/components/dashboard/TerritorialSummary";

interface AppState {
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
  currentData: TerritorialData | null;
  setCurrentData: (data: TerritorialData | null) => void;
  currentTheme: 'General' | 'Seguridad' | 'Economía' | 'Paz';
  setCurrentTheme: (theme: 'General' | 'Seguridad' | 'Economía' | 'Paz') => void;
}

export const useStore = create<AppState>((set) => ({
  selectedLocationId: '13589884B3780741375954',
  setSelectedLocationId: (id) => set({ selectedLocationId: id }),
  currentData: null,
  setCurrentData: (data) => set({ currentData: data }),
  currentTheme: 'General',
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
}));
