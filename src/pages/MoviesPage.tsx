import { useState } from 'react';
import { getMovies } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import ContentCard from '@/components/ContentCard';
import { Film, Flame, Sword, Drama, Rocket, Crosshair, Laugh, HeartHandshake, Skull, Sparkles, Mountain, Scale, LayoutGrid } from 'lucide-react';

const genreConfig = [
  { id: 'All', icon: LayoutGrid, color: 'from-primary/30 to-primary/10' },
  { id: 'Action', icon: Sword, color: 'from-red-500/30 to-red-500/10' },
  { id: 'Drama', icon: Drama, color: 'from-blue-500/30 to-blue-500/10' },
  { id: 'Sci-Fi', icon: Rocket, color: 'from-cyan-500/30 to-cyan-500/10' },
  { id: 'Thriller', icon: Crosshair, color: 'from-orange-500/30 to-orange-500/10' },
  { id: 'Comedy', icon: Laugh, color: 'from-yellow-500/30 to-yellow-500/10' },
  { id: 'Romance', icon: HeartHandshake, color: 'from-pink-500/30 to-pink-500/10' },
  { id: 'Horror', icon: Skull, color: 'from-purple-500/30 to-purple-500/10' },
  { id: 'Fantasy', icon: Sparkles, color: 'from-violet-500/30 to-violet-500/10' },
  { id: 'Adventure', icon: Mountain, color: 'from-emerald-500/30 to-emerald-500/10' },
  { id: 'Crime', icon: Scale, color: 'from-amber-500/30 to-amber-500/10' },
];

const MoviesPage = () => {
  const { language } = useApp();
  const [activeGenre, setActiveGenre] = useState('All');
  const movies = getMovies();

  const filtered = activeGenre === 'All' ? movies : movies.filter(m => m.genre.includes(activeGenre));

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      {/* Header */}
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

      {/* Genre filter - premium style */}
      <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {genreConfig.map(({ id, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setActiveGenre(id)}
            className={`group flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeGenre === id
                ? `bg-gradient-to-r ${color} text-foreground border border-primary/30 shadow-lg shadow-primary/10 scale-105`
                : 'glass-card hover:bg-foreground/5 border border-border/30 hover:border-border/60 hover:scale-[1.02]'
            }`}
          >
            <Icon className={`w-4 h-4 transition-colors ${activeGenre === id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
            {id === 'All' ? (language === 'tr' ? 'Tümü' : 'All') : id}
            {activeGenre === id && (
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-bold">
                {filtered.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
        {filtered.map(movie => (
          <div key={movie.id} className="flex justify-center">
            <ContentCard item={movie} type="movie" size="lg" />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Film className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-semibold">{language === 'tr' ? 'Bu kategoride film bulunamadı' : 'No movies in this category'}</p>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
