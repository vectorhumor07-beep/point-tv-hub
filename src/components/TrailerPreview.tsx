import { useState, useRef, useEffect } from 'react';
import { Play, Star, Plus, Heart, Check, Volume2, VolumeX } from 'lucide-react';
import { Movie, Series } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

interface TrailerPreviewProps {
  item: Movie | Series;
  type: 'movie' | 'series';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: number;
}

const TrailerPreview = ({ item, type, size = 'md', showProgress }: TrailerPreviewProps) => {
  const { watchlist, toggleWatchlist, favorites, toggleFavorite } = useApp();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout>();

  const isInWatchlist = watchlist.includes(item.id);
  const isFavorite = favorites.includes(item.id);

  const poster = item.poster;
  const title = item.title;
  const rating = item.rating;
  const trailerUrl = 'trailerUrl' in item ? item.trailerUrl : '';

  useEffect(() => {
    if (isHovered && trailerUrl) {
      hoverTimeout.current = setTimeout(() => {
        setShowTrailer(true);
      }, 800);
    } else {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setShowTrailer(false);
    }
    return () => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); };
  }, [isHovered, trailerUrl]);

  useEffect(() => {
    if (showTrailer && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [showTrailer]);

  const handleClick = () => {
    if (type === 'movie') navigate(`/movie/${item.id}`);
    else navigate(`/series/${item.id}`);
  };

  const sizeClasses = {
    sm: 'w-32 h-48',
    md: 'w-44 h-64',
    lg: 'w-56 h-80',
  };

  return (
    <div
      className={`content-card group ${sizeClasses[size]} flex-shrink-0 relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Poster / Trailer */}
      <div className="w-full h-full rounded-lg overflow-hidden relative">
        <img src={poster} alt={title} className="w-full h-full object-cover" loading="lazy" />

        {/* Trailer video overlay */}
        {showTrailer && trailerUrl && (
          <div className="absolute inset-0 z-10">
            <video
              ref={videoRef}
              src={trailerUrl}
              muted={isMuted}
              loop
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="absolute bottom-2 right-2 p-1.5 rounded-full bg-background/60 hover:bg-background/80 transition-colors z-20"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </button>
            {/* Trailer badge */}
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-primary/90 text-primary-foreground text-[9px] font-bold z-20">
              TRAILER
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="content-card-overlay absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-3 rounded-lg z-20">
        <h3 className="font-display font-bold text-sm leading-tight mb-1">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-0.5 text-primary">
            <Star className="w-3 h-3 fill-current" /> {rating}
          </span>
          {'duration' in item && <span>{(item as Movie).duration}dk</span>}
          {'seasons' in item && <span>{(item as Series).seasons.length} Sezon</span>}
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
            className={`p-1.5 rounded-full transition-colors ${isFavorite ? 'bg-destructive/20 text-destructive' : 'bg-secondary hover:bg-secondary/80'}`}
          >
            <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {showProgress !== undefined && showProgress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary rounded-b-lg z-30">
          <div className="h-full bg-primary transition-all rounded-b-lg" style={{ width: `${showProgress}%` }} />
        </div>
      )}
    </div>
  );
};

export default TrailerPreview;
