import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import ContentCard from '@/components/ContentCard';
import { Film, LayoutGrid, Loader2 } from 'lucide-react';
import { getMovies } from '@/lib/mockData';
import { useXtreamVod } from '@/hooks/useXtreamData';

const MoviesPage = () => {
  const { language, isXtreamMode, xtreamCreds } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const { categories: xtreamCats, streams: xtreamStreams, loading } = useXtreamVod();

  const movies = isXtreamMode
    ? xtreamStreams.map(s => ({
        id: `vod-${s.stream_id}`,
        title: s.name,
        poster: s.stream_icon || '',
        backdrop: s.stream_icon || '',
        description: '',
        genre: [xtreamCats.find(c => c.category_id === s.category_id)?.category_name || ''].filter(Boolean),
        rating: s.rating_5based ? s.rating_5based * 2 : 0,
        duration: 0,
        year: parseInt(s.added?.substring(0, 4)) || 2024,
        director: '',
        cast: [],
        streamUrl: xtreamCreds ? `${xtreamCreds.host.replace(/\/$/, '')}/movie/${xtreamCreds.username}/${xtreamCreds.password}/${s.stream_id}.${s.container_extension}` : '',
        trailerUrl: '',
        streamId: s.stream_id,
        container_extension: s.container_extension,
        category_id: s.category_id,
      }))
    : getMovies();

  const categories = isXtreamMode
    ? [{ id: 'all', name: language === 'tr' ? 'Tümü' : 'All' }, ...xtreamCats.map(c => ({ id: c.category_id, name: c.category_name }))]
    : [{ id: 'all', name: language === 'tr' ? 'Tümü' : 'All' }];

  const filtered = activeCategory === 'all'
    ? movies
    : isXtreamMode
      ? movies.filter(m => (m as any).category_id === activeCategory)
      : movies;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Film className="w-7 h-7 text-primary" />
          </div>
          {t('nav.movies', language)}
        </h1>
        <div className="text-sm text-muted-foreground">
          <span className="text-primary font-bold">{filtered.length}</span> {language === 'tr' ? 'film' : 'movies'}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-foreground border border-primary/30 shadow-lg shadow-primary/10 scale-105'
                : 'glass-card hover:bg-foreground/5 border border-border/30 hover:border-border/60 hover:scale-[1.02]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
        {filtered.map(movie => (
          <div key={movie.id} className="flex justify-center">
            <ContentCard item={movie as any} type="movie" size="lg" />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Film className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-semibold">{language === 'tr' ? 'Film bulunamadı' : 'No movies found'}</p>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
