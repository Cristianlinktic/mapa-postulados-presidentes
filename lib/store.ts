import { create } from 'zustand';
import { TerritorialData } from "@/components/dashboard/TerritorialSummary";
import mapboxgl from "mapbox-gl";

interface AppState {
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
  currentData: TerritorialData | null;
  setCurrentData: (data: TerritorialData | null) => void;
  currentTheme: 'General';
  setCurrentTheme: (theme: 'General') => void;
  // Map helpers
  mapInstance: mapboxgl.Map | null;
  setMapInstance: (map: mapboxgl.Map | null) => void;
  activePopup: mapboxgl.Popup | null;
  setActivePopup: (popup: mapboxgl.Popup | null) => void;
  
  // Auth state
  user: { username: string; role: 'admin' | 'reader' } | null;
  setUser: (user: { username: string; role: 'admin' | 'reader' } | null) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedLocationId: '13589884B3780741375954',
  setSelectedLocationId: (id) => set({ selectedLocationId: id }),
  currentData: null,
  setCurrentData: (data) => set({ currentData: data }),
  currentTheme: 'General',
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
  mapInstance: null,
  setMapInstance: (map) => set({ mapInstance: map }),
  activePopup: null,
  setActivePopup: (popup) => set({ activePopup: popup }),
  user: null,
  setUser: (user) => set({ user }),
}));

