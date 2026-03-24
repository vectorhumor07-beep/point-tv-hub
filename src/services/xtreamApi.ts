// Xtream Codes API Service
export interface XtreamCredentials {
  host: string;
  username: string;
  password: string;
}

export interface XtreamUserInfo {
  username: string;
  password: string;
  message: string;
  auth: number;
  status: string;
  exp_date: string;
  is_trial: string;
  active_cons: string;
  created_at: string;
  max_connections: string;
  allowed_output_formats: string[];
}

export interface XtreamServerInfo {
  url: string;
  port: string;
  https_port: string;
  server_protocol: string;
  rtmp_port: string;
  timezone: string;
  timestamp_now: number;
  time_now: string;
}

export interface XtreamCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface XtreamLiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
}

export interface XtreamVodStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  rating: string;
  rating_5based: number;
  added: string;
  category_id: string;
  container_extension: string;
  custom_sid: string;
  direct_source: string;
}

export interface XtreamVodInfo {
  info: {
    movie_image: string;
    plot: string;
    cast: string;
    director: string;
    genre: string;
    releasedate: string;
    duration: string;
    duration_secs: number;
    rating: string;
    name: string;
    backdrop_path?: string[];
    tmdb_id?: string;
    youtube_trailer?: string;
  };
  movie_data: {
    stream_id: number;
    name: string;
    added: string;
    category_id: string;
    container_extension: string;
  };
}

export interface XtreamSeriesItem {
  num: number;
  name: string;
  series_id: number;
  cover: string;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  last_modified: string;
  rating: string;
  rating_5based: number;
  backdrop_path: string[];
  youtube_trailer: string;
  episode_run_time: string;
  category_id: string;
}

export interface XtreamSeriesInfo {
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    season_number: number;
    cover: string;
    cover_big: string;
  }[];
  info: {
    name: string;
    cover: string;
    plot: string;
    cast: string;
    director: string;
    genre: string;
    releaseDate: string;
    rating: string;
    rating_5based: number;
    backdrop_path: string[];
    youtube_trailer: string;
    episode_run_time: string;
    category_id: string;
  };
  episodes: Record<string, {
    id: string;
    episode_num: number;
    title: string;
    container_extension: string;
    info: {
      movie_image: string;
      plot: string;
      duration_secs: number;
      duration: string;
      rating: number;
      name: string;
    };
    custom_sid: string;
    added: string;
    season: number;
    direct_source: string;
  }[]>;
}

export interface XtreamEPGItem {
  id: string;
  epg_id: string;
  title: string;
  lang: string;
  start: string;
  end: string;
  description: string;
  channel_id: string;
  start_timestamp: string;
  stop_timestamp: string;
}

// Storage helpers
const CREDS_KEY = 'xtream_credentials';

export const saveCredentials = (creds: XtreamCredentials) => {
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
};

export const getCredentials = (): XtreamCredentials | null => {
  const raw = localStorage.getItem(CREDS_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const clearCredentials = () => {
  localStorage.removeItem(CREDS_KEY);
};

// Normalize host URL
const normalizeHost = (host: string): string => {
  let h = host.trim();
  if (!h.startsWith('http://') && !h.startsWith('https://')) {
    h = 'http://' + h;
  }
  if (h.endsWith('/')) h = h.slice(0, -1);
  return h;
};

// Use Supabase edge function as CORS proxy
const proxyFetch = async (targetUrl: string): Promise<any> => {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const proxyUrl = `${supabaseUrl}/functions/v1/xtream-proxy`;

  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ url: targetUrl }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Proxy error: ${res.status} - ${errText}`);
  }

  return res.json();
};

// Base API call via proxy
const apiCall = async (creds: XtreamCredentials, params: Record<string, string> = {}) => {
  const host = normalizeHost(creds.host);
  const url = new URL(`${host}/player_api.php`);
  url.searchParams.set('username', creds.username);
  url.searchParams.set('password', creds.password);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const targetUrl = url.toString();

  // Try direct fetch first (works if same protocol or CORS enabled)
  try {
    const res = await fetch(targetUrl, { signal: AbortSignal.timeout(5000) });
    if (res.ok) return res.json();
  } catch {
    // Direct failed, use proxy
  }

  // Use edge function proxy
  return proxyFetch(targetUrl);
};

// Auth & info
export const authenticate = async (creds: XtreamCredentials): Promise<{ user_info: XtreamUserInfo; server_info: XtreamServerInfo }> => {
  return apiCall(creds);
};

// Live TV
export const getLiveCategories = async (creds: XtreamCredentials): Promise<XtreamCategory[]> => {
  return apiCall(creds, { action: 'get_live_categories' });
};

export const getLiveStreams = async (creds: XtreamCredentials, categoryId?: string): Promise<XtreamLiveStream[]> => {
  const params: Record<string, string> = { action: 'get_live_streams' };
  if (categoryId) params.category_id = categoryId;
  return apiCall(creds, params);
};

// VOD (Movies)
export const getVodCategories = async (creds: XtreamCredentials): Promise<XtreamCategory[]> => {
  return apiCall(creds, { action: 'get_vod_categories' });
};

export const getVodStreams = async (creds: XtreamCredentials, categoryId?: string): Promise<XtreamVodStream[]> => {
  const params: Record<string, string> = { action: 'get_vod_streams' };
  if (categoryId) params.category_id = categoryId;
  return apiCall(creds, params);
};

export const getVodInfo = async (creds: XtreamCredentials, vodId: number): Promise<XtreamVodInfo> => {
  return apiCall(creds, { action: 'get_vod_info', vod_id: vodId.toString() });
};

// Series
export const getSeriesCategories = async (creds: XtreamCredentials): Promise<XtreamCategory[]> => {
  return apiCall(creds, { action: 'get_series_categories' });
};

export const getSeriesStreams = async (creds: XtreamCredentials, categoryId?: string): Promise<XtreamSeriesItem[]> => {
  const params: Record<string, string> = { action: 'get_series' };
  if (categoryId) params.category_id = categoryId;
  return apiCall(creds, params);
};

export const getSeriesInfo = async (creds: XtreamCredentials, seriesId: number): Promise<XtreamSeriesInfo> => {
  return apiCall(creds, { action: 'get_series_info', series_id: seriesId.toString() });
};

// EPG
export const getShortEPG = async (creds: XtreamCredentials, streamId: number, limit?: number): Promise<{ epg_listings: XtreamEPGItem[] }> => {
  const params: Record<string, string> = { action: 'get_short_epg', stream_id: streamId.toString() };
  if (limit) params.limit = limit.toString();
  return apiCall(creds, params);
};

export const getFullEPG = async (creds: XtreamCredentials, streamId: number): Promise<{ epg_listings: XtreamEPGItem[] }> => {
  return apiCall(creds, { action: 'get_simple_data_table', stream_id: streamId.toString() });
};

// Stream URL builders
export const buildLiveStreamUrl = (creds: XtreamCredentials, streamId: number, extension = 'm3u8'): string => {
  const host = normalizeHost(creds.host);
  return `${host}/live/${creds.username}/${creds.password}/${streamId}.${extension}`;
};

export const buildVodStreamUrl = (creds: XtreamCredentials, streamId: number, extension: string): string => {
  const host = normalizeHost(creds.host);
  return `${host}/movie/${creds.username}/${creds.password}/${streamId}.${extension}`;
};

export const buildSeriesStreamUrl = (creds: XtreamCredentials, streamId: number | string, extension: string): string => {
  const host = normalizeHost(creds.host);
  return `${host}/series/${creds.username}/${creds.password}/${streamId}.${extension}`;
};
