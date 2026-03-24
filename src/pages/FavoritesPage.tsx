import { getMovies, getSeries } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import ContentCard from '@/components/ContentCard';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const { language, favorites, watchlist } = useApp();
  const movies = getMovies();
  const series = getSeries();

  const favItems = [...movies, ...series].filter(item => favorites.includes(item.id));
  const watchlistItems = [...movies, ...series].filter(item => watchlist.includes(item.id));

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <h1 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-primary" />
        {t('nav.favorites', language)} & {t('home.watchlist', language)}
      </h1>

      {favItems.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold mb-4">{t('nav.favorites', language)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favItems.map(item => (
              <ContentCard key={item.id} item={item} type={'duration' in item ? 'movie' : 'series'} />
            ))}
          </div>
        </div>
      )}

      {watchlistItems.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-4">{t('home.watchlist', language)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {watchlistItems.map(item => (
              <ContentCard key={item.id} item={item} type={'duration' in item ? 'movie' : 'series'} />
            ))}
          </div>
        </div>
      )}

      {favItems.length === 0 && watchlistItems.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No favorites or watchlist items yet</p>
          <p className="text-sm">Add content to your favorites by clicking the heart icon</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
