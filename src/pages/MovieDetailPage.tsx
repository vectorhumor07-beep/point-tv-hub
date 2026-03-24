import { useParams, useNavigate } from 'react-router-dom';
import { getMovies } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { Play, Star, Plus, Heart, Clock, Calendar, User, Film, Check, ArrowLeft } from 'lucide-react';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist, favorites, toggleFavorite } = useApp();
  const movies = getMovies();
  const movie = movies.find(m => m.id === id);

  if (!movie) return (
    <div className="min-h-screen pt-20 flex items-center justify-center text-muted-foreground">Film bulunamadı</div>
  );

  const isInWatchlist = watchlist.includes(movie.id);
  const isFavorite = favorites.includes(movie.id);
  const similarMovies = movies.filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g))).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Backdrop hero */}
      <div className="relative h-[65vh] min-h-[450px] overflow-hidden">
        <img src={movie.poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-6 z-20 p-2.5 rounded-full glass-card hover:bg-foreground/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl">
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-52 h-80 rounded-xl object-cover shadow-2xl ring-1 ring-border/20"
                width={208}
                height={320}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.genre.map(g => (
                  <span key={g} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">{g}</span>
                ))}
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
                <span className="flex items-center gap-1.5 text-primary font-semibold text-base">
                  <Star className="w-5 h-5 fill-current" /> {movie.rating}/10
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" /> {movie.year}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {movie.duration} dk
                </span>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold">HD</span>
              </div>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
                {movie.description}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate(`/player/movie/${movie.id}`)}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:scale-105 glow-accent"
                >
                  <Play className="w-5 h-5 fill-current" /> Şimdi İzle
                </button>
                <button
                  onClick={() => toggleWatchlist(movie.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all ${
                    isInWatchlist ? 'bg-primary/20 text-primary' : 'glass-card hover:bg-foreground/10'
                  }`}
                >
                  {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isInWatchlist ? 'Listede' : 'Listeye Ekle'}
                </button>
                <button
                  onClick={() => toggleFavorite(movie.id)}
                  className={`p-3.5 rounded-xl transition-all ${
                    isFavorite ? 'bg-destructive/20 text-destructive' : 'glass-card hover:bg-foreground/10'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="px-6 md:px-12 py-8 max-w-6xl">
        {/* Cast & Crew */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Yönetmen & Oyuncular
            </h3>
            <div className="mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Yönetmen</span>
              <p className="font-semibold">{movie.director}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Oyuncular</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {movie.cast.map(actor => (
                  <span key={actor} className="px-3 py-1.5 rounded-lg bg-secondary text-sm">{actor}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" /> Film Bilgileri
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tür</span>
                <span>{movie.genre.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Süre</span>
                <span>{Math.floor(movie.duration / 60)}s {movie.duration % 60}dk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yıl</span>
                <span>{movie.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kalite</span>
                <span className="text-primary font-semibold">Full HD 1080p</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ses</span>
                <span>Dolby Digital 5.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar movies */}
        {similarMovies.length > 0 && (
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Benzer Filmler</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {similarMovies.map(m => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/movie/${m.id}`)}
                  className="content-card cursor-pointer group rounded-xl overflow-hidden"
                >
                  <img src={m.poster} alt={m.title} className="w-full aspect-[2/3] object-cover" loading="lazy" />
                  <div className="content-card-overlay absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 flex flex-col justify-end p-3 transition-opacity">
                    <h4 className="font-display font-bold text-sm">{m.title}</h4>
                    <span className="text-xs text-primary flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> {m.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
