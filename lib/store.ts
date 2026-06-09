import { create } from 'zustand';

interface AppState {
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedLocationId: '11001', // Default to Bogota
  setSelectedLocationId: (id) => set({ selectedLocationId: id }),
}));
