import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Radio, Signal, LayoutGrid } from 'lucide-react';
import BufferingScreen from '@/components/BufferingScreen';
import { ChannelCategory } from '@/lib/types';
import { getChannels } from '@/lib/mockData';
import { useXtreamLive } from '@/hooks/useXtreamData';
import { buildLiveStreamUrl } from '@/services/xtreamApi';

const LiveTVPage = () => {
  const { language, kidsMode, isXtreamMode, xtreamCreds } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { categories: xtreamCats, streams: xtreamStreams, loading } = useXtreamLive();

  // Build channel list based on mode
  const channels = isXtreamMode
    ? xtreamStreams.map(s => ({
        id: `xt-${s.stream_id}`,
        name: s.name,
        logo: s.stream_icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1a1a2e&color=fff&size=128`,
        category: s.category_id,
        categoryName: xtreamCats.find(c => c.category_id === s.category_id)?.category_name || '',
        streamUrl: xtreamCreds ? buildLiveStreamUrl(xtreamCreds, s.stream_id) : '',
        streamId: s.stream_id,
        isHD: s.name.toLowerCase().includes('hd') || s.name.toLowerCase().includes('fhd'),
        hasArchive: s.tv_archive === 1,
      }))
    : getChannels().map(c => ({
        id: c.id,
        name: c.name,
        logo: c.logo,
        category: c.category,
        categoryName: c.category,
        streamUrl: c.streamUrl,
        streamId: 0,
        isHD: c.isHD,
        hasArchive: false,
      }));

  const categories = isXtreamMode
    ? [{ id: 'all', name: language === 'tr' ? 'Tümü' : 'All' }, ...xtreamCats.map(c => ({ id: c.category_id, name: c.category_name }))]
    : [
        { id: 'all', name: language === 'tr' ? 'Tümü' : 'All' },
        { id: 'news', name: 'News' }, { id: 'sports', name: 'Sports' }, { id: 'movies', name: 'Movies' },
        { id: 'kids', name: 'Kids' }, { id: 'entertainment', name: 'Entertainment' },
        { id: 'music', name: 'Music' }, { id: 'documentary', name: 'Documentary' },
      ];

  const filtered = activeCategory === 'all'
    ? channels
    : channels.filter(c => c.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
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
          <span className="text-primary font-bold">{filtered.length}</span> {language === 'tr' ? 'kanal' : 'channels'}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-b from-primary/20 to-primary/5 text-foreground border border-primary/30 shadow-lg shadow-primary/10 scale-105'
                : 'glass-card hover:bg-foreground/5 border border-border/20 hover:border-border/50 hover:scale-[1.02]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Channel grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
        {filtered.map(channel => (
          <div
            key={channel.id}
            onClick={() => {
              if (isXtreamMode) {
                navigate(`/player/channel/${channel.streamId}`)
              } else {
                navigate(`/player/channel/${channel.id}`)
              }
            }}
            className="glass-card group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 border border-border/20 hover:border-primary/30"
          >
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-destructive/90 text-destructive-foreground text-[10px] font-black">
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              LIVE
            </div>

            <div className="p-5 flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-primary/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-16 h-16 rounded-xl object-cover relative z-10 ring-1 ring-border/20 group-hover:ring-primary/30 transition-all"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.name)}&background=1a1a2e&color=fff&size=128`; }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-sm truncate mb-1 group-hover:text-primary transition-colors">{channel.name}</h3>
                <p className="text-xs text-muted-foreground truncate mb-2">{channel.categoryName}</p>
                <div className="flex items-center gap-2">
                  {channel.isHD && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/15 text-primary font-bold border border-primary/20">HD</span>
                  )}
                  {channel.hasArchive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">Archive</span>
                  )}
                </div>
              </div>

              <button className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                <Play className="w-5 h-5 fill-current" />
              </button>
            </div>

            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Radio className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-semibold">{language === 'tr' ? 'Kanal bulunamadı' : 'No channels found'}</p>
        </div>
      )}
    </div>
  );
};

export default LiveTVPage;
