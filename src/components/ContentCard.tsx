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
    else if (type === 'movie') navigate(`/movie/${item.id}`);
    else navigate(`/series/${item.id}`);
  };

  const sizeClasses = {
    sm: 'w-32 h-48',
    md: 'w-44 h-64',
    lg: 'w-56 h-80',
  };

  return (
    <div className={`content-card group ${sizeClasses[size]} flex-shrink-0`} onClick={handleClick}>
      <img src={poster} alt={title} className="w-full h-full object-cover rounded-lg" loading="lazy" />

      {/* IMDB Rating badge - always visible */}
      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border/30 z-10">
        <Star className="w-3 h-3 fill-primary text-primary" />
        <span className="text-xs font-bold text-primary">{rating}</span>
      </div>

      {/* Title & gradient - always visible */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-3 pt-10 rounded-b-lg">
        <h3 className="font-display font-bold text-sm leading-tight truncate">{title}</h3>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
          {'duration' in item && <span>{(item as Movie).duration}dk</span>}
          {'seasons' in item && <span>{(item as Series).seasons.length} Sezon</span>}
          {'year' in item && <span>{(item as Movie).year}</span>}
        </div>
      </div>

      {/* Hover overlay with actions */}
      <div className="content-card-overlay absolute inset-0 bg-background/40 opacity-0 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-lg">
        <button className="p-2.5 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform shadow-lg">
          <Play className="w-4 h-4 fill-current" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleWatchlist(item.id); }}
          className="p-2 rounded-full bg-secondary/90 hover:bg-secondary transition-colors"
        >
          {isInWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
          className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-destructive/20 text-destructive' : 'bg-secondary/90 hover:bg-secondary'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Progress bar */}
      {showProgress !== undefined && showProgress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary rounded-b-lg z-20">
          <div className="h-full bg-primary transition-all rounded-b-lg" style={{ width: `${showProgress}%` }} />
        </div>
      )}

      {/* Live badge */}
      {type === 'channel' && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-destructive text-xs font-bold z-10">LIVE</div>
      )}
    </div>
  );
};

export default ContentCard;
