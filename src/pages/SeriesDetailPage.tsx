import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { getSeries } from '@/lib/mockData';
import { Play, Star, Plus, Heart, ArrowLeft, Clock, Calendar, Check, User, Film, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ContentCard from '@/components/ContentCard';
import { useXtreamSeriesInfo } from '@/hooks/useXtreamData';
import { buildSeriesStreamUrl } from '@/services/xtreamApi';

const TRAILER_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const SeriesDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, watchlist, toggleWatchlist, favorites, toggleFavorite, isXtreamMode, xtreamCreds } = useApp();
  const [activeSeason, setActiveSeason] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [trailerMuted, setTrailerMuted] = useState(true);
  const [trailerLoaded, setTrailerLoaded] = useState(false);

  const isXtreamId = id?.startsWith('ser-');
  const seriesId = isXtreamId ? parseInt(id!.replace('ser-', '')) : null;
  const { info: seriesInfo, loading } = useXtreamSeriesInfo(isXtreamMode && seriesId ? seriesId : null);

  const mockSeries = !isXtreamId ? getSeries().find(s => s.id === id) : null;
  const allSeries = getSeries().filter(s => s.id !== id);

  // Build series data
  const series = isXtreamMode && seriesInfo ? {
    id: id || '',
    title: seriesInfo.info?.name || 'Series',
    poster: seriesInfo.info?.cover || '',
    backdrop: seriesInfo.info?.backdrop_path?.[0] || seriesInfo.info?.cover || '',
    description: seriesInfo.info?.plot || '',
    genre: seriesInfo.info?.genre?.split(',').map(g => g.trim()) || [],
    rating: parseFloat(seriesInfo.info?.rating || '0') || 0,
    year: parseInt(seriesInfo.info?.releaseDate?.substring(0, 4) || '2024'),
    cast: seriesInfo.info?.cast?.split(',').map(c => c.trim()) || [],
    director: seriesInfo.info?.director || '',
    seasons: Object.keys(seriesInfo.episodes || {}).map(seasonNum => ({
      number: parseInt(seasonNum),
      episodes: (seriesInfo.episodes[seasonNum] || []).map(ep => ({
        id: ep.id,
        number: ep.episode_num,
        title: ep.title || ep.info?.name || `Episode ${ep.episode_num}`,
        description: ep.info?.plot || '',
        duration: ep.info?.duration_secs ? Math.floor(ep.info.duration_secs / 60) : parseInt(ep.info?.duration || '0') || 0,
        thumbnail: ep.info?.movie_image || '',
        streamUrl: '',
        container_extension: ep.container_extension,
        epId: ep.id,
      })),
    })).sort((a, b) => a.number - b.number),
  } : mockSeries;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!series) return <div className="min-h-screen pt-20 px-6 text-center text-muted-foreground">{language === 'tr' ? 'Dizi bulunamadı' : 'Series not found'}</div>;

  const season = series.seasons[activeSeason];
  const isInWatchlist = watchlist.includes(series.id);
  const isFavorite = favorites.includes(series.id);
  const totalEpisodes = series.seasons.reduce((acc: number, s: any) => acc + s.episodes.length, 0);
  const similarSeries = !isXtreamMode ? allSeries.filter(s => s.genre.some(g => series.genre.includes(g))).slice(0, 6) : [];

  const handleEpisodePlay = (ep: any, seasonNum: number) => {
    if (isXtreamMode && xtreamCreds) {
      const ext = ep.container_extension || 'mp4';
      const epStreamId = ep.epId || ep.id;
      navigate(`/player/series/${epStreamId}?ext=${ext}&s=${seasonNum}&e=${ep.number}&title=${encodeURIComponent(series.title)}`);
    } else {
      navigate(`/player/series/${series.id}?s=${seasonNum}&e=${ep.number}`);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[60vh] min-h-[450px] overflow-hidden">
        <img src={series.poster} alt={series.title} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${trailerLoaded ? 'opacity-0' : 'opacity-100'}`} />
        {!isXtreamMode && (
          <video ref={videoRef} src={TRAILER_URL} muted={trailerMuted} autoPlay loop playsInline
            onCanPlay={() => setTrailerLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${trailerLoaded ? 'opacity-100' : 'opacity-0'}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

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
              <img src={series.poster} alt={series.title} className="w-52 h-80 rounded-xl object-cover shadow-2xl ring-1 ring-border/20" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {series.genre.map(g => (
                  <span key={g} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">{g}</span>
                ))}
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-semibold">TV Series</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{series.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
                {series.rating > 0 && (
                  <span className="flex items-center gap-1.5 text-primary font-semibold text-base">
                    <Star className="w-5 h-5 fill-current" /> {series.rating}/10
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="w-4 h-4" /> {series.year}</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><Film className="w-4 h-4" /> {series.seasons.length} {language === 'tr' ? 'Sezon' : 'Seasons'}</span>
                <span className="text-muted-foreground">{totalEpisodes} {language === 'tr' ? 'Bölüm' : 'Episodes'}</span>
              </div>

              {series.description && (
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 max-w-2xl">{series.description}</p>
              )}

              {(series as any).cast?.length > 0 && (
                <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{language === 'tr' ? 'Oyuncular' : 'Cast'}: {(series as any).cast?.slice(0, 4).join(', ')}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    if (season?.episodes?.[0]) handleEpisodePlay(season.episodes[0], season.number);
                  }}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:scale-105 glow-accent"
                >
                  <Play className="w-5 h-5 fill-current" /> S1E1 {language === 'tr' ? 'İzle' : 'Watch'}
                </button>
                <button onClick={() => toggleWatchlist(series.id)} className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all ${isInWatchlist ? 'bg-primary/20 text-primary' : 'glass-card hover:bg-foreground/10'}`}>
                  {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isInWatchlist ? (language === 'tr' ? 'Listede' : 'In List') : (language === 'tr' ? 'Listeye Ekle' : 'Add to List')}
                </button>
                <button onClick={() => toggleFavorite(series.id)} className={`p-3.5 rounded-xl transition-all ${isFavorite ? 'bg-destructive/20 text-destructive' : 'glass-card hover:bg-foreground/10'}`}>
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasons & Episodes */}
      <div className="px-6 md:px-12 py-8 max-w-6xl">
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {series.seasons.map((s, i) => (
            <button key={i} onClick={() => setActiveSeason(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeSeason === i ? 'bg-primary text-primary-foreground glow-accent' : 'glass-card hover:bg-foreground/10'}`}>
              {language === 'tr' ? 'Sezon' : 'Season'} {s.number}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {season?.episodes?.map(ep => (
            <div key={ep.id} onClick={() => handleEpisodePlay(ep, season.number)}
              className="glass-card-hover flex items-center gap-5 p-4 cursor-pointer group">
              <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                {ep.thumbnail ? (
                  <img src={ep.thumbnail} alt={ep.title} className="w-40 h-24 object-cover" loading="lazy" />
                ) : (
                  <div className="w-40 h-24 bg-secondary flex items-center justify-center rounded-lg">
                    <Play className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-primary fill-current" />
                </div>
                {ep.duration > 0 && (
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-background/80 text-[10px] font-mono">
                    {ep.duration} {language === 'tr' ? 'dk' : 'min'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-sm mb-1">
                  {language === 'tr' ? 'Bölüm' : 'Episode'} {ep.number}: {ep.title}
                </h4>
                {ep.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{ep.description}</p>}
                {ep.duration > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ep.duration} {language === 'tr' ? 'dk' : 'min'}
                  </span>
                )}
              </div>
              <div className="text-3xl font-display font-bold text-muted-foreground/20">
                {ep.number.toString().padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {similarSeries.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold mb-4">{language === 'tr' ? 'Benzer Diziler' : 'Similar Series'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarSeries.map(s => <ContentCard key={s.id} item={s} type="series" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesDetailPage;
