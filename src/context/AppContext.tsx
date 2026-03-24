import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language, UserProfile } from '@/lib/types';
import { storage } from '@/lib/storage';

interface AppContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  activeProfile: UserProfile | null;
  setActiveProfileId: (id: string) => void;
  profiles: UserProfile[];
  kidsMode: boolean;
  setKidsMode: (v: boolean) => void;
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLang] = useState<Language>(storage.getLanguage());
  const [profiles] = useState(storage.getProfiles());
  const [activeProfileId, setActiveId] = useState<string | null>(storage.getActiveProfile());
  const [kidsMode, setKids] = useState(storage.isKidsMode());
  const [watchlist, setWatchlist] = useState(storage.getWatchlist());
  const [favorites, setFavorites] = useState(storage.getFavorites());

  const setLanguage = useCallback((l: Language) => {
    setLang(l);
    storage.setLanguage(l);
  }, []);

  const setActiveProfileId = useCallback((id: string) => {
    setActiveId(id);
    storage.setActiveProfile(id);
    const profile = profiles.find(p => p.id === id);
    if (profile?.isKids) {
      setKids(true);
      storage.setKidsMode(true);
    }
  }, [profiles]);

  const setKidsMode = useCallback((v: boolean) => {
    setKids(v);
    storage.setKidsMode(v);
  }, []);

  const toggleWatchlist = useCallback((id: string) => {
    setWatchlist(storage.toggleWatchlist(id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(storage.toggleFavorite(id));
  }, []);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      activeProfile, setActiveProfileId, profiles,
      kidsMode, setKidsMode,
      watchlist, toggleWatchlist,
      favorites, toggleFavorite,
    }}>
      {children}
    </AppContext.Provider>
  );
};
