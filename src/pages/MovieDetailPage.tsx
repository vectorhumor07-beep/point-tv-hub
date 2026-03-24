import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { getMovies } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { Play, Star, Plus, Heart, Clock, Calendar, User, Film, Check, ArrowLeft, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useXtreamVodInfo } from '@/hooks/useXtreamData';
import { buildVodStreamUrl } from '@/services/xtreamApi';

const TRAILER_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { watchlist, toggleWatchlist, favorites, toggleFavorite, isXtreamMode, xtreamCreds } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [trailerMuted, setTrailerMuted] = useState(true);
  const [trailerLoaded, setTrailerLoaded] = useState(false);

  // Determine if xtream mode
  const isXtreamId = id?.startsWith('vod-');
  const streamId = isXtreamId ? parseInt(id!.replace('vod-', '')) : null;
  const { info: vodInfo, loading: vodLoading } = useXtreamVodInfo(isXtreamMode && streamId ? streamId : null);

  // Get movie data
  const movies = getMovies();
  const mockMovie = !isXtreamId ? movies.find(m => m.id === id) : null;

  // Build movie object
  const movie = isXtreamMode && vodInfo ? {
    id: id || '',
    title: vodInfo.info?.name || vodInfo.movie_data?.name || 'Movie',
    poster: vodInfo.info?.movie_image || '',
    backdrop: vodInfo.info?.backdrop_path?.[0] || vodInfo.info?.movie_image || '',
    description: vodInfo.info?.plot || '',
    genre: vodInfo.info?.genre?.split(',').map(g => g.trim()) || [],
    rating: parseFloat(vodInfo.info?.rating || '0') || 0,
    duration: vodInfo.info?.duration_secs ? Math.floor(vodInfo.info.duration_secs / 60) : parseInt(vodInfo.info?.duration || '0') || 0,
    year: parseInt(vodInfo.info?.releasedate?.substring(0, 4) || '2024'),
    director: vodInfo.info?.director || '',
    cast: vodInfo.info?.cast?.split(',').map(c => c.trim()) || [],
    streamUrl: xtreamCreds && streamId ? buildVodStreamUrl(xtreamCreds, streamId, vodInfo.movie_data?.container_extension || 'mp4') : '',
    trailerUrl: vodInfo.info?.youtube_trailer ? `https://www.youtube.com/watch?v=${vodInfo.info.youtube_trailer}` : '',
    streamId,
    container_extension: vodInfo.movie_data?.container_extension || 'mp4',
  } : mockMovie;

  if (vodLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!movie) return (
    <div className="min-h-screen pt-20 flex items-center justify-center text-muted-foreground">Film bulunamadı</div>
  );

  const isInWatchlist = watchlist.includes(movie.id);
  const isFavorite = favorites.includes(movie.id);
  const similarMovies = !isXtreamMode ? movies.filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g))).slice(0, 6) : [];

  const handlePlay = () => {
    if (isXtreamMode && streamId) {
      navigate(`/player/movie/${streamId}?ext=${(movie as any).container_extension || 'mp4'}&title=${encodeURIComponent(movie.title)}`);
    } else {
      navigate(`/player/movie/${movie.id}`);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[65vh] min-h-[450px] overflow-hidden">
        <img src={movie.poster} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${trailerLoaded ? 'opacity-0' : 'opacity-100'}`} />
        {!isXtreamMode && (
          <video
            ref={videoRef}
            src={TRAILER_URL}
            muted={trailerMuted}
            autoPlay
            loop
            playsInline
            onCanPlay={() => setTrailerLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${trailerLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

        {!isXtreamMode && (
          <button onClick={() => setTrailerMuted(!trailerMuted)} className="absolute top-20 right-6 z-20 p-2.5 rounded-full glass-card hover:bg-foreground/10 transition-colors">
            {trailerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}

        <button onClick={() => navigate(-1)} className="absolute top-20 left-6 z-20 p-2.5 rounded-full glass-card hover:bg-foreground/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl">
            <div className="hidden md:block flex-shrink-0">
              <img src={movie.poster} alt={movie.title} className="w-52 h-80 rounded-xl object-cover shadow-2xl ring-1 ring-border/20" width={208} height={320} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.genre.map(g => (
                  <span key={g} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">{g}</span>
                ))}
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
                {movie.rating > 0 && (
                  <span className="flex items-center gap-1.5 text-primary font-semibold text-base">
                    <Star className="w-5 h-5 fill-current" /> {movie.rating}/10
                  </span>
                )}
                {movie.year > 0 && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" /> {movie.year}
                  </span>
                )}
                {movie.duration > 0 && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" /> {movie.duration} dk
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold">HD</span>
              </div>

              {movie.description && (
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 max-w-2xl">{movie.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button onClick={handlePlay} className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:scale-105 glow-accent">
                  <Play className="w-5 h-5 fill-current" /> Şimdi İzle
                </button>
                <button onClick={() => toggleWatchlist(movie.id)} className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all ${isInWatchlist ? 'bg-primary/20 text-primary' : 'glass-card hover:bg-foreground/10'}`}>
                  {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isInWatchlist ? 'Listede' : 'Listeye Ekle'}
                </button>
                <button onClick={() => toggleFavorite(movie.id)} className={`p-3.5 rounded-xl transition-all ${isFavorite ? 'bg-destructive/20 text-destructive' : 'glass-card hover:bg-foreground/10'}`}>
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {(movie.director || movie.cast.length > 0) && (
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Yönetmen & Oyuncular
              </h3>
              {movie.director && (
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Yönetmen</span>
                  <p className="font-semibold">{movie.director}</p>
                </div>
              )}
              {movie.cast.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Oyuncular</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.cast.map(actor => (
                      <span key={actor} className="px-3 py-1.5 rounded-lg bg-secondary text-sm">{actor}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" /> Film Bilgileri
            </h3>
            <div className="space-y-3 text-sm">
              {movie.genre.length > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Tür</span><span>{movie.genre.join(', ')}</span></div>
              )}
              {movie.duration > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Süre</span><span>{Math.floor(movie.duration / 60)}s {movie.duration % 60}dk</span></div>
              )}
              {movie.year > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Yıl</span><span>{movie.year}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">Kalite</span><span className="text-primary font-semibold">Full HD 1080p</span></div>
            </div>
          </div>
        </div>

        {similarMovies.length > 0 && (
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Benzer Filmler</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {similarMovies.map(m => (
                <div key={m.id} onClick={() => navigate(`/movie/${m.id}`)} className="content-card cursor-pointer group rounded-xl overflow-hidden">
                  <img src={m.poster} alt={m.title} className="w-full aspect-[2/3] object-cover" loading="lazy" />
                  <div className="content-card-overlay absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 flex flex-col justify-end p-3 transition-opacity">
                    <h4 className="font-display font-bold text-sm">{m.title}</h4>
                    <span className="text-xs text-primary flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {m.rating}</span>
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
