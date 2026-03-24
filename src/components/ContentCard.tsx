import { Movie, Series, Channel } from '@/lib/types';
import { Play, Plus, Heart, Star, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

interface ContentCardProps {
  item: Movie | Series | Channel;
  type: 'movie' | 'series' | 'channel';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: number;
}

const ContentCard = ({ item, type, size = 'md', showProgress }: ContentCardProps) => {
  const { watchlist, toggleWatchlist, favorites, toggleFavorite } = useApp();
  const navigate = useNavigate();

  const isInWatchlist = watchlist.includes(item.id);
  const isFavorite = favorites.includes(item.id);

  const poster = 'poster' in item ? item.poster : ('logo' in item ? item.logo : '');
  const title = 'title' in item ? item.title : ('name' in item ? item.name : '');
  const rating = item.rating;

  const handleClick = () => {
    if (type === 'channel') navigate(`/player/channel/${item.id}`);
    else if (type === 'movie') navigate(`/player/movie/${item.id}`);
    else navigate(`/series/${item.id}`);
  };

  const sizeClasses = {
    sm: 'w-32 h-48',
    md: 'w-44 h-64',
    lg: 'w-56 h-80',
  };

  return (
    <div className={`content-card group ${sizeClasses[size]} flex-shrink-0`} onClick={handleClick}>
      <img src={poster} alt={title} className="w-full h-full object-cover" loading="lazy" />

      {/* Overlay */}
      <div className="content-card-overlay absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="font-display font-bold text-sm leading-tight mb-1">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-0.5 text-primary">
            <Star className="w-3 h-3 fill-current" /> {rating}
          </span>
          {'duration' in item && <span>{(item as Movie).duration}min</span>}
          {'seasons' in item && <span>{(item as Series).seasons.length} Seasons</span>}
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform">
            <Play className="w-3 h-3 fill-current" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleWatchlist(item.id); }}
            className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {isInWatchlist ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
            className={`p-1.5 rounded-full transition-colors ${isFavorite ? 'bg-red-500/20 text-red-500' : 'bg-secondary hover:bg-secondary/80'}`}
          >
            <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {showProgress !== undefined && showProgress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
          <div className="h-full bg-primary transition-all" style={{ width: `${showProgress}%` }} />
        </div>
      )}

      {/* Live badge for channels */}
      {type === 'channel' && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-xs font-bold">LIVE</div>
      )}
    </div>
  );
};

export default ContentCard;
