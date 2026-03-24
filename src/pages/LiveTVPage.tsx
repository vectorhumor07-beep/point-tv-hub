import { useState } from 'react';
import { getChannels } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Radio } from 'lucide-react';
import { ChannelCategory } from '@/lib/types';

const categories: ChannelCategory[] = ['news', 'sports', 'movies', 'kids', 'international', 'entertainment', 'music', 'documentary'];

const LiveTVPage = () => {
  const { language, kidsMode } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ChannelCategory | 'all'>('all');

  const allChannels = getChannels();
  const allEpg = getEPG();
  const channels = kidsMode
    ? allChannels.filter(c => c.category === 'kids')
    : activeCategory === 'all'
    ? allChannels
    : allChannels.filter(c => c.category === activeCategory);

  const now = new Date();

  const selectedChannelData = allChannels.find(c => c.id === selectedChannel);
  const selectedChannelEpg = useMemo(() => {
    if (!selectedChannel) return [];
    return allEpg
      .filter(e => e.channelId === selectedChannel)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [selectedChannel, allEpg]);

  const handleChannelClick = (channelId: string) => {
    setSelectedChannel(channelId);
    setEpgOpen(true);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-6 flex">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${epgOpen ? 'mr-[360px]' : ''}`}>
        <h1 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
          <Radio className="w-8 h-8 text-primary" />
          {t('nav.liveTV', language)}
        </h1>

        {/* EPG Timeline */}
        <div className="mb-8">
          <EPGTimeline />
        </div>

        {/* Category filters */}
        {!kidsMode && (
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {language === 'tr' ? 'Tümü' : 'All'}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                  activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {t(`category.${cat}`, language)}
              </button>
            ))}
          </div>
        )}

        {/* Channel grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {channels.map(channel => (
            <div
              key={channel.id}
              onClick={() => handleChannelClick(channel.id)}
              className={`glass-card-hover p-4 cursor-pointer flex items-center gap-4 ${
                selectedChannel === channel.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <img src={channel.logo} alt={channel.name} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{channel.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{channel.nowPlaying}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-xs text-primary">
                    <Star className="w-3 h-3 fill-current" /> {channel.rating}
                  </span>
                  {channel.isHD && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">HD</span>}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/player/channel/${channel.id}`); }}
                  className="p-2.5 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EPG Sidebar */}
      <div
        className={`fixed top-[72px] right-0 bottom-0 w-[360px] glass-card border-l border-border/50 z-40 transition-transform duration-300 overflow-hidden ${
          epgOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedChannelData && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border/50 flex items-center gap-3">
              <img src={selectedChannelData.logo} alt={selectedChannelData.name} className="w-10 h-10 rounded-lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-sm truncate">{selectedChannelData.name}</h3>
                <p className="text-xs text-muted-foreground">{language === 'tr' ? 'Program Rehberi' : 'Program Guide'}</p>
              </div>
              <button
                onClick={() => navigate(`/player/channel/${selectedChannelData.id}`)}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" /> {language === 'tr' ? 'İzle' : 'Watch'}
              </button>
              <button onClick={() => setEpgOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* EPG List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {selectedChannelEpg.map((prog, i) => {
                const start = new Date(prog.startTime);
                const end = new Date(prog.endTime);
                const isNow = now >= start && now < end;
                const isPast = now >= end;
                const progressPct = isNow
                  ? ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
                  : 0;

                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl transition-all ${
                      isNow
                        ? 'bg-primary/15 border border-primary/30'
                        : isPast
                        ? 'bg-secondary/30 opacity-50'
                        : 'bg-secondary/60 hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xs font-mono mt-0.5 w-14 flex-shrink-0">
                        <p className={isNow ? 'text-primary font-bold' : 'text-muted-foreground'}>
                          {formatTime(prog.startTime)}
                        </p>
                        <p className="text-muted-foreground/60">{formatTime(prog.endTime)}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold truncate ${isNow ? 'text-primary' : ''}`}>
                            {prog.title}
                          </p>
                          {isNow && (
                            <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold flex-shrink-0">
                              LIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{prog.description}</p>
                        {isNow && (
                          <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTVPage;
