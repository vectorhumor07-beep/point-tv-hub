import { useState } from 'react';
import { getMovies } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import ContentCard from '@/components/ContentCard';
import { Film } from 'lucide-react';

const allGenres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Comedy', 'Romance', 'Horror', 'Fantasy', 'Adventure', 'Crime'];

const MoviesPage = () => {
  const { language } = useApp();
  const [activeGenre, setActiveGenre] = useState('All');
  const movies = getMovies();

  const filtered = activeGenre === 'All' ? movies : movies.filter(m => m.genre.includes(activeGenre));

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <h1 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
        <Film className="w-8 h-8 text-primary" />
        {t('nav.movies', language)}
      </h1>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {allGenres.map(genre => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeGenre === genre ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filtered.map(movie => (
          <div key={movie.id} className="flex justify-center">
            <ContentCard item={movie} type="movie" size="lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
