import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Film, MonitorPlay, Tv, Star } from 'lucide-react';
import { getMovies, getSeries, getChannels } from '@/lib/mockData';
import ContentCard from '@/components/ContentCard';
import { useXtreamLive, useXtreamVod, useXtreamSeries } from '@/hooks/useXtreamData';
import { t } from '@/lib/i18n';

const SearchPage = () => {
  const { language, isXtreamMode, xtreamCreds } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { streams: liveStreams } = useXtreamLive();
  const { streams: vodStreams } = useXtreamVod();
  const { streams: seriesStreams } = useXtreamSeries();

  const mockMovies = getMovies();
  const mockSeries = getSeries();
  const mockChannels = getChannels();

  const results = useMemo(() => {
    if (!query.trim()) return { movies: [] as any[], series: [] as any[], channels: [] as any[] };
    const q = query.toLowerCase();

    if (isXtreamMode) {
      return {
        movies: vodStreams.filter(s => s.name.toLowerCase().includes(q)).slice(0, 30).map(s => ({
          id: `vod-${s.stream_id}`, title: s.name, poster: s.stream_icon || '', rating: s.rating_5based * 2,
          genre: [], year: 0, duration: 0, description: '', backdrop: '', director: '', cast: [], streamUrl: '', trailerUrl: '',
        })),
        series: seriesStreams.filter(s => s.name.toLowerCase().includes(q)).slice(0, 30).map(s => ({
          id: `ser-${s.series_id}`, title: s.name, poster: s.cover || '', rating: s.rating_5based * 2,
          genre: [], year: 0, description: '', backdrop: '', seasons: [],
        })),
        channels: liveStreams.filter(s => s.name.toLowerCase().includes(q)).slice(0, 30).map(s => ({
          id: `xt-${s.stream_id}`, name: s.name, logo: s.stream_icon || '', category: 'live' as any,
          streamUrl: '', nowPlaying: '', nextUp: '', rating: 0, isHD: s.name.toLowerCase().includes('hd'),
          streamId: s.stream_id,
        })),
      };
    }

    return {
      movies: mockMovies.filter(m => m.title.toLowerCase().includes(q) || m.genre.some(g => g.toLowerCase().includes(q))),
      series: mockSeries.filter(s => s.title.toLowerCase().includes(q) || s.genre.some(g => g.toLowerCase().includes(q))),
      channels: mockChannels.filter(c => c.name.toLowerCase().includes(q) || c.category.includes(q)),
    };
  }, [query, isXtreamMode, liveStreams, vodStreams, seriesStreams, mockMovies, mockSeries, mockChannels]);

  const hasResults = results.movies.length + results.series.length + results.channels.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('search.placeholder', language)}
          className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
          autoFocus
        />
      </div>

      {query && !hasResults && (
        <p className="text-center text-muted-foreground py-20">{t('search.noResults', language)}</p>
      )}

      {results.movies.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Film className="w-5 h-5 text-primary" /> Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.movies.map(m => <ContentCard key={m.id} item={m as any} type="movie" />)}
          </div>
        </div>
      )}

      {results.series.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><MonitorPlay className="w-5 h-5 text-primary" /> Series</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.series.map(s => <ContentCard key={s.id} item={s as any} type="series" />)}
          </div>
        </div>
      )}

      {results.channels.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Tv className="w-5 h-5 text-primary" /> Channels</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.channels.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  if (isXtreamMode) navigate(`/player/channel/${(c as any).streamId}`);
                  else navigate(`/player/channel/${c.id}`);
                }}
                className="glass-card p-3 cursor-pointer hover:border-primary/30 transition-all rounded-xl"
              >
                <img
                  src={c.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=128`}
                  alt={c.name}
                  className="w-16 h-16 rounded-lg object-cover mx-auto mb-2"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=128`; }}
                />
                <p className="text-xs font-semibold text-center truncate">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!query && (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Start typing to search</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
