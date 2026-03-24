import { useNavigate } from 'react-router-dom';
import { Tv, Film, MonitorPlay, Shuffle, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { getChannels, getMovies, getSeries } from '@/lib/mockData';
import { storage } from '@/lib/storage';
import ContentCard from '@/components/ContentCard';
import TrailerPreview from '@/components/TrailerPreview';
import ContentRow from '@/components/ContentRow';
import HeroSlider from '@/components/HeroSlider';

const HomePage = () => {
  const { language, kidsMode } = useApp();
  const navigate = useNavigate();

  const channels = getChannels();
  const movies = getMovies();
  const series = getSeries();
  const progress = storage.getWatchProgress();
  const recentIds = storage.getRecentlyWatched();

  const kidsChannels = channels.filter(c => c.category === 'kids');
  const filteredChannels = kidsMode ? kidsChannels : channels;
  const filteredMovies = kidsMode ? movies.filter(m => m.genre.some(g => ['Comedy', 'Fantasy', 'Adventure'].includes(g))) : movies;

  const trending = [...movies].sort(() => Math.random() - 0.5).slice(0, 10);
  const recommended = [...movies].sort(() => Math.random() - 0.5).slice(0, 10);
  const continueWatching = progress.filter(p => p.progress > 0 && p.progress < p.duration * 0.9);

  const continueMovies = continueWatching
    .map(p => movies.find(m => m.id === p.contentId))
    .filter(Boolean);

  const recentMovies = recentIds
    .map(id => movies.find(m => m.id === id) || series.find(s => s.id === id))
    .filter(Boolean);

  const handleSurprise = () => {
    const allContent = [...movies.map(m => ({ id: m.id, type: 'movie' as const })), ...series.map(s => ({ id: s.id, type: 'series' as const }))];
    const random = allContent[Math.floor(Math.random() * allContent.length)];
    if (random.type === 'movie') navigate(`/player/movie/${random.id}`);
    else navigate(`/series/${random.id}`);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen pb-8">
      <HeroSlider movies={filteredMovies} />

      <section className="px-6 mt-8 relative z-10 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          <div onClick={() => navigate('/live')} className="glass-card-hover p-6 cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-lg" />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-primary mb-3">{t('home.liveTV', language)}</h3>
                <p className="text-2xl font-bold">+{filteredChannels.length} {t('home.channels', language)}</p>
                <p className="text-xs text-muted-foreground line-through mt-1">{filteredChannels.length + 20} {t('home.channels', language)}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tv className="w-7 h-7 text-primary" />
              </div>
            </div>
          </div>

          <div onClick={() => navigate('/movies')} className="glass-card-hover p-6 cursor-pointer relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold mb-3">{t('home.movies', language)}</h3>
                <p className="text-2xl font-bold">+{filteredMovies.length} Movies</p>
                <p className="text-xs text-muted-foreground line-through mt-1">{filteredMovies.length + 30} Movies</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Film className="w-7 h-7 text-primary" />
              </div>
            </div>
          </div>

          <div onClick={() => navigate('/series')} className="glass-card-hover p-6 cursor-pointer relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold mb-3">{t('home.series', language)}</h3>
                <p className="text-2xl font-bold">+{series.length} Series</p>
                <p className="text-xs text-muted-foreground line-through mt-1">{series.length + 15} Series</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MonitorPlay className="w-7 h-7 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between px-6 mb-8 max-w-6xl mx-auto text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/60 animate-pulse" />
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t('timeshift', language)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{timeStr}</span>
          <span className="text-border">|</span>
          <span>Istanbul</span>
          <span>☁️ 21°</span>
        </div>
      </div>

      <div className="px-6 mb-10 max-w-6xl mx-auto">
        <button
          onClick={handleSurprise}
          className="w-full glass-card-hover flex items-center justify-center gap-3 py-4 text-primary font-display font-bold text-lg hover:glow-accent"
        >
          <Shuffle className="w-5 h-5" />
          {t('home.surprise', language)}
        </button>
      </div>

      {continueMovies.length > 0 && (
        <ContentRow title={t('home.continueWatching', language)}>
          {continueMovies.map(m => m && (
            <ContentCard
              key={m.id}
              item={m}
              type="movie"
              showProgress={((continueWatching.find(p => p.contentId === m.id)?.progress || 0) / (continueWatching.find(p => p.contentId === m.id)?.duration || 1)) * 100}
            />
          ))}
        </ContentRow>
      )}

      {/* Trending - with trailer preview */}
      <ContentRow title={t('home.trending', language)} onSeeAll={() => navigate('/movies')}>
        {trending.map(m => <TrailerPreview key={m.id} item={m} type="movie" size="lg" />)}
      </ContentRow>

      {/* Recommended - with trailer preview */}
      <ContentRow title={t('home.recommended', language)}>
        {recommended.map(m => <TrailerPreview key={m.id} item={m} type="movie" />)}
      </ContentRow>

      <ContentRow title={t('home.series', language)} onSeeAll={() => navigate('/series')}>
        {series.map(s => <TrailerPreview key={s.id} item={s} type="series" />)}
      </ContentRow>

      {recentMovies.length > 0 && (
        <ContentRow title={t('home.recentlyWatched', language)}>
          {recentMovies.map(m => m && (
            <ContentCard key={m.id} item={m} type={'duration' in m ? 'movie' : 'series'} size="sm" />
          ))}
        </ContentRow>
      )}
    </div>
  );
};

export default HomePage;
