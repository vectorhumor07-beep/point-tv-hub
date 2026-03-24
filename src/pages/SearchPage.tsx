import { useState, useMemo } from 'react';
import { getMovies, getSeries, getChannels } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import ContentCard from '@/components/ContentCard';
import { Search } from 'lucide-react';

const SearchPage = () => {
  const { language } = useApp();
  const [query, setQuery] = useState('');

  const movies = getMovies();
  const series = getSeries();
  const channels = getChannels();

  const results = useMemo(() => {
    if (!query.trim()) return { movies: [], series: [], channels: [] };
    const q = query.toLowerCase();
    return {
      movies: movies.filter(m => m.title.toLowerCase().includes(q) || m.genre.some(g => g.toLowerCase().includes(q))),
      series: series.filter(s => s.title.toLowerCase().includes(q) || s.genre.some(g => g.toLowerCase().includes(q))),
      channels: channels.filter(c => c.name.toLowerCase().includes(q) || c.category.includes(q)),
    };
  }, [query, movies, series, channels]);

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
          <h2 className="font-display text-xl font-bold mb-4">Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.movies.map(m => (
              <ContentCard key={m.id} item={m} type="movie" />
            ))}
          </div>
        </div>
      )}

      {results.series.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold mb-4">Series</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.series.map(s => (
              <ContentCard key={s.id} item={s} type="series" />
            ))}
          </div>
        </div>
      )}

      {results.channels.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-4">Channels</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.channels.map(c => (
              <ContentCard key={c.id} item={c} type="channel" />
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
