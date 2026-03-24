import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Star, Plus, Check, Heart, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Movie } from '@/lib/types';

// Hero images as fallback
import heroAction from '@/assets/hero/hero-action.jpg';
import heroScifi from '@/assets/hero/hero-scifi.jpg';
import heroDrama from '@/assets/hero/hero-drama.jpg';

interface HeroSliderProps {
  movies: Movie[];
}

const heroBackgrounds = [heroAction, heroScifi, heroDrama];

const HeroSlider = ({ movies }: HeroSliderProps) => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState<Record<number, boolean>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist, favorites, toggleFavorite } = useApp();

  const featured = movies.slice(0, 5);
  const SLIDE_DURATION = 15000;

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % featured.length);
  }, [current, featured.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + featured.length) % featured.length);
  }, [current, featured.length, goTo]);

  // Auto-play with progress
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          next();
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  // Manage video playback per slide
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === current) {
        // Random start point between 10% and 70% of duration
        const setRandomStart = () => {
          if (video.duration && video.duration > 10) {
            const minStart = video.duration * 0.1;
            const maxStart = video.duration * 0.7;
            video.currentTime = minStart + Math.random() * (maxStart - minStart);
          }
          video.muted = isMuted;
          video.play().catch(() => {});
        };
        if (video.readyState >= 1) {
          setRandomStart();
        } else {
          video.addEventListener('loadedmetadata', setRandomStart, { once: true });
        }
      } else {
        video.pause();
      }
    });
  }, [current, isMuted]);

  const movie = featured[current];
  if (!movie) return null;

  const isInWatchlist = watchlist.includes(movie.id);
  const isFavorite = favorites.includes(movie.id);

  return (
    <div
      className="relative w-full h-[75vh] min-h-[550px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background trailers with fallback images */}
      {featured.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {/* Fallback poster image */}
          <img
            src={heroBackgrounds[i % heroBackgrounds.length]}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
              videoLoaded[i] && i === current ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {/* Trailer video */}
          {m.trailerUrl && (
            <video
              ref={el => { videoRefs.current[i] = el; }}
              src={m.trailerUrl}
              muted={isMuted}
              loop
              playsInline
              onCanPlay={() => setVideoLoaded(prev => ({ ...prev, [i]: true }))}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                videoLoaded[i] && i === current ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>
      ))}

      {/* Top gradient vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/60 to-transparent z-[5]" />

      {/* Mute toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 z-30 p-2.5 rounded-full glass-card hover:bg-foreground/10 transition-all border border-border/30"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-28 px-6 md:px-12 z-10">
        <div
          className={`max-w-2xl transition-all duration-700 ${
            isTransitioning ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          {/* Top 10 Badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-destructive/90 text-destructive-foreground">
              <span className="text-xs font-black tracking-wider">TOP 10</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
              {movie.genre[0]}
            </span>
            {movie.genre[1] && (
              <span className="px-3 py-1 rounded-full bg-secondary/80 text-xs font-semibold">
                {movie.genre[1]}
              </span>
            )}
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-3 leading-[1.1] drop-shadow-lg">
            {movie.title}
          </h1>

          {/* Rating & Meta row */}
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center gap-1.5 text-primary font-bold text-lg">
              <Star className="w-5 h-5 fill-current" /> {movie.rating}
            </span>
            <span className="text-sm text-muted-foreground font-medium">{movie.year}</span>
            <span className="text-sm text-muted-foreground font-medium">{movie.duration} dk</span>
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-black tracking-wider">4K UHD</span>
            <span className="px-2 py-0.5 rounded bg-secondary text-[10px] font-bold">Dolby Atmos</span>
          </div>

          <p className="text-muted-foreground text-sm md:text-base mb-6 line-clamp-2 max-w-xl leading-relaxed">
            {movie.description}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/player/movie/${movie.id}`)}
              className="flex items-center gap-2.5 px-10 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/30"
            >
              <Play className="w-6 h-6 fill-current" /> İzle
            </button>
            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl glass-card text-foreground font-semibold hover:bg-foreground/10 transition-all border border-border/50"
            >
              <Info className="w-5 h-5" /> Detaylar
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleWatchlist(movie.id); }}
              className={`p-3.5 rounded-xl transition-all ${
                isInWatchlist ? 'bg-primary/20 text-primary border border-primary/30' : 'glass-card hover:bg-foreground/10 border border-border/50'
              }`}
            >
              {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(movie.id); }}
              className={`p-3.5 rounded-xl transition-all ${
                isFavorite ? 'bg-destructive/20 text-destructive border border-destructive/30' : 'glass-card hover:bg-foreground/10 border border-border/50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Right side: Thumbnail strip */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
        {featured.map((m, i) => (
          <button
            key={m.id}
            onClick={() => goTo(i)}
            className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
              i === current
                ? 'w-28 h-16 ring-2 ring-primary shadow-lg shadow-primary/20 scale-110'
                : 'w-24 h-14 opacity-50 hover:opacity-80 hover:scale-105'
            }`}
          >
            <img
              src={heroBackgrounds[i % heroBackgrounds.length]}
              alt={m.title}
              className="w-full h-full object-cover"
            />
            {i === current && (
              <div className="absolute inset-0 border-2 border-primary rounded-lg" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-1">
              <p className="text-[9px] font-bold truncate">{m.title}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-card hover:bg-foreground/10 transition-all hover:scale-110 border border-border/30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 lg:right-40 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-card hover:bg-foreground/10 transition-all hover:scale-110 border border-border/30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom progress bar + dots */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Slide progress bars */}
        <div className="flex gap-1 px-6 md:px-12 mb-4">
          {featured.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full bg-foreground/10 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{
                  width: i === current ? `${progress}%` : i < current ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom info bar */}
        <div className="flex items-center justify-between px-6 md:px-12 pb-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {current + 1} / {featured.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-foreground/20 hover:bg-foreground/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
