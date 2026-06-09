import { create } from 'zustand';

interface AppState {
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
  currentTheme: 'General' | 'Seguridad' | 'Economía' | 'Paz';
  setCurrentTheme: (theme: 'General' | 'Seguridad' | 'Economía' | 'Paz') => void;
}

export const useStore = create<AppState>((set) => ({
  selectedLocationId: '13589884B3780741375954', // Antioquia (Example ID)
  setSelectedLocationId: (id) => set({ selectedLocationId: id }),
  currentTheme: 'General',
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
}));
