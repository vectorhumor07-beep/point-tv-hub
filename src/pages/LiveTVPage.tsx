import { useState } from 'react';
import { getChannels } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Radio } from 'lucide-react';
import { ChannelCategory } from '@/lib/types';
import EPGTimeline from '@/components/EPGTimeline';

const categories: ChannelCategory[] = ['news', 'sports', 'movies', 'kids', 'international', 'entertainment', 'music', 'documentary'];

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

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
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
            Tümü
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
            onClick={() => navigate(`/player/channel/${channel.id}`)}
            className="glass-card-hover p-4 cursor-pointer flex items-center gap-4"
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
            <button className="p-2.5 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTVPage;
