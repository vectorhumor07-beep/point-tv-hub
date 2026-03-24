import { useState, useEffect, useCallback } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '@/lib/types';

// Hero images
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
  const navigate = useNavigate();

  const featured = movies.slice(0, 5);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % featured.length);
  }, [current, featured.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + featured.length) % featured.length);
  }, [current, featured.length, goTo]);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const movie = featured[current];
  if (!movie) return null;

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background image */}
      {featured.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={heroBackgrounds[i % heroBackgrounds.length]}
            alt=""
            className="w-full h-full object-cover"
            width={1920}
            height={800}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-24 px-6 md:px-12 z-10">
        <div
          className={`max-w-2xl transition-all duration-500 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
              {movie.genre[0]}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-primary text-primary" /> {movie.rating}
            </span>
            <span className="text-sm text-muted-foreground">{movie.year}</span>
            <span className="text-sm text-muted-foreground">{movie.duration} min</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {movie.title}
          </h1>

          <p className="text-muted-foreground text-sm md:text-base mb-6 line-clamp-2">
            {movie.description}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/player/movie/${movie.id}`)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" /> İzle
            </button>
            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass-card text-foreground font-semibold hover:bg-foreground/10 transition-all"
            >
              <Info className="w-5 h-5" /> Detaylar
            </button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-card hover:bg-foreground/10 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-card hover:bg-foreground/10 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2 bg-primary' : 'w-2 h-2 bg-foreground/30 hover:bg-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
