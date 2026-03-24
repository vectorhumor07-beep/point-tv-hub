import { useState } from 'react';
import { getChannels } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Radio, Newspaper, Trophy, Clapperboard, Baby, Globe, Tv, Music, BookOpen, LayoutGrid, Signal } from 'lucide-react';
import { ChannelCategory } from '@/lib/types';

const categoryConfig: { id: ChannelCategory | 'all'; icon: typeof Radio; emoji: string }[] = [
  { id: 'all', icon: LayoutGrid, emoji: '📺' },
  { id: 'news', icon: Newspaper, emoji: '📰' },
  { id: 'sports', icon: Trophy, emoji: '⚽' },
  { id: 'movies', icon: Clapperboard, emoji: '🎬' },
  { id: 'kids', icon: Baby, emoji: '🧸' },
  { id: 'international', icon: Globe, emoji: '🌍' },
  { id: 'entertainment', icon: Tv, emoji: '🎭' },
  { id: 'music', icon: Music, emoji: '🎵' },
  { id: 'documentary', icon: BookOpen, emoji: '📚' },
];

const LiveTVPage = () => {
  const { language, kidsMode } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ChannelCategory | 'all'>('all');

  const allChannels = getChannels();
  const channels = kidsMode
    ? allChannels.filter(c => c.category === 'kids')
    : activeCategory === 'all'
    ? allChannels
    : allChannels.filter(c => c.category === activeCategory);

  const getCategoryCount = (cat: ChannelCategory | 'all') =>
    cat === 'all' ? allChannels.length : allChannels.filter(c => c.category === cat).length;

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
            <Radio className="w-7 h-7 text-destructive" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive animate-pulse" />
          </div>
          {t('nav.liveTV', language)}
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Signal className="w-4 h-4 text-primary" />
          <span className="text-primary font-bold">{channels.length}</span> {language === 'tr' ? 'kanal' : 'channels'}
        </div>
      </div>

      {/* Category filters - card style */}
      {!kidsMode && (
        <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {categoryConfig.map(({ id, icon: Icon, emoji }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`group relative flex flex-col items-center gap-2 px-5 py-4 rounded-2xl min-w-[100px] text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeCategory === id
                  ? 'bg-gradient-to-b from-primary/20 to-primary/5 text-foreground border border-primary/30 shadow-lg shadow-primary/10 scale-105'
                  : 'glass-card hover:bg-foreground/5 border border-border/20 hover:border-border/50 hover:scale-[1.02]'
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-xs">
                {id === 'all' ? (language === 'tr' ? 'Tümü' : 'All') : t(`category.${id}`, language)}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeCategory === id ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
              }`}>
                {getCategoryCount(id)}
              </span>
              {activeCategory === id && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Channel grid - enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
        {channels.map((channel, index) => (
          <div
            key={channel.id}
            onClick={() => navigate(`/player/channel/${channel.id}`)}
            className="glass-card group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 border border-border/20 hover:border-primary/30"
          >
            {/* Live indicator */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-destructive/90 text-destructive-foreground text-[10px] font-black">
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              LIVE
            </div>

            <div className="p-5 flex items-center gap-4">
              {/* Channel logo with glow */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-primary/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={channel.logo} alt={channel.name} className="w-16 h-16 rounded-xl object-cover relative z-10 ring-1 ring-border/20 group-hover:ring-primary/30 transition-all" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-sm truncate mb-1 group-hover:text-primary transition-colors">{channel.name}</h3>
                <p className="text-xs text-muted-foreground truncate mb-2">{channel.nowPlaying}</p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                    <Star className="w-3 h-3 fill-current" /> {channel.rating}
                  </span>
                  {channel.isHD && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/15 text-primary font-bold border border-primary/20">HD</span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground capitalize">{channel.category}</span>
                </div>
              </div>

              {/* Play button */}
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/player/channel/${channel.id}`); }}
                className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Bottom gradient line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTVPage;
