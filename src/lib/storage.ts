import { UserProfile, WatchProgress, Language } from './types';

const KEYS = {
  PROFILES: 'pointtv_profiles',
  ACTIVE_PROFILE: 'pointtv_active_profile',
  WATCHLIST: 'pointtv_watchlist',
  FAVORITES: 'pointtv_favorites',
  WATCH_PROGRESS: 'pointtv_progress',
  RECENTLY_WATCHED: 'pointtv_recently',
  LANGUAGE: 'pointtv_language',
  PARENTAL_PIN: 'pointtv_pin',
  KIDS_MODE: 'pointtv_kids_mode',
};

const defaultProfiles: UserProfile[] = [
  { id: 'profile-1', name: 'User', avatar: '😎', isKids: false },
  { id: 'profile-2', name: 'Kids', avatar: '🧒', isKids: true },
];

const getItem = <T>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const setItem = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export const storage = {
  getProfiles: (): UserProfile[] => getItem(KEYS.PROFILES, defaultProfiles),
  setProfiles: (p: UserProfile[]) => setItem(KEYS.PROFILES, p),
  getActiveProfile: (): string | null => getItem(KEYS.ACTIVE_PROFILE, null),
  setActiveProfile: (id: string) => setItem(KEYS.ACTIVE_PROFILE, id),

  getWatchlist: (): string[] => getItem(KEYS.WATCHLIST, []),
  toggleWatchlist: (id: string) => {
    const list = storage.getWatchlist();
    const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
    setItem(KEYS.WATCHLIST, next);
    return next;
  },

  getFavorites: (): string[] => getItem(KEYS.FAVORITES, []),
  toggleFavorite: (id: string) => {
    const list = storage.getFavorites();
    const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
    setItem(KEYS.FAVORITES, next);
    return next;
  },

  getWatchProgress: (): WatchProgress[] => getItem(KEYS.WATCH_PROGRESS, []),
  setWatchProgress: (contentId: string, progress: number, duration: number, contentType: 'movie' | 'series' | 'channel', episodeId?: string) => {
    const all = storage.getWatchProgress();
    const idx = all.findIndex(w => w.contentId === contentId && (!episodeId || w.episodeId === episodeId));
    const entry: WatchProgress = { contentId, contentType, progress, duration, timestamp: Date.now(), episodeId };
    if (idx >= 0) all[idx] = entry; else all.push(entry);
    setItem(KEYS.WATCH_PROGRESS, all.slice(-50));
  },

  getRecentlyWatched: (): string[] => getItem(KEYS.RECENTLY_WATCHED, []),
  addRecentlyWatched: (id: string) => {
    const list = storage.getRecentlyWatched().filter(x => x !== id);
    list.unshift(id);
    setItem(KEYS.RECENTLY_WATCHED, list.slice(0, 20));
  },

  getLanguage: (): Language => getItem(KEYS.LANGUAGE, 'en'),
  setLanguage: (l: Language) => setItem(KEYS.LANGUAGE, l),

  getParentalPin: (): string => getItem(KEYS.PARENTAL_PIN, '1234'),
  setParentalPin: (pin: string) => setItem(KEYS.PARENTAL_PIN, pin),

  isKidsMode: (): boolean => getItem(KEYS.KIDS_MODE, false),
  setKidsMode: (v: boolean) => setItem(KEYS.KIDS_MODE, v),
};
