export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: ChannelCategory;
  streamUrl: string;
  nowPlaying: string;
  nextUp: string;
  rating: number;
  isHD: boolean;
}

export type ChannelCategory = 'news' | 'sports' | 'movies' | 'kids' | 'international' | 'entertainment' | 'music' | 'documentary';

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  description: string;
  genre: string[];
  rating: number;
  duration: number;
  year: number;
  director: string;
  cast: string[];
  streamUrl: string;
  trailerUrl: string;
}

export interface Series {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  description: string;
  genre: string[];
  rating: number;
  year: number;
  seasons: Season[];
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  streamUrl: string;
}

export interface EPGItem {
  channelId: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  pin?: string;
}

export interface WatchProgress {
  contentId: string;
  contentType: 'movie' | 'series' | 'channel';
  progress: number;
  duration: number;
  timestamp: number;
  episodeId?: string;
  seasonNumber?: number;
}

export type Language = 'en' | 'tr';
