import { useState, useMemo } from 'react';
import { getChannels, getEPG } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Play, Rewind, Clock, Search } from 'lucide-react';

const CatchupPage = () => {
  const { language } = useApp();
  const navigate = useNavigate();
  const channels = getChannels();
  const allEpg = getEPG();
  const now = new Date();
  const [selectedChannel, setSelectedChannel] = useState(channels[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const pastPrograms = useMemo(() => {
    return allEpg
      .filter(e => e.channelId === selectedChannel && new Date(e.endTime) < now)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [selectedChannel, allEpg, now]);

  const filteredPrograms = searchQuery
    ? pastPrograms.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : pastPrograms;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getDuration = (start: string, end: string) => {
    const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    return `${diff} ${language === 'tr' ? 'dk' : 'min'}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <h1 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
        <Rewind className="w-8 h-8 text-primary" />
        {language === 'tr' ? 'Catch-up TV' : 'Catch-up TV'}
      </h1>

      <p className="text-muted-foreground mb-6 text-sm">
        {language === 'tr'
          ? 'Geçmiş yayınları tekrar izleyin. Son 24 saatin programları burada.'
          : 'Watch past broadcasts again. Programs from the last 24 hours are here.'}
      </p>

      {/* Channel selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {channels.slice(0, 20).map(ch => (
          <button
            key={ch.id}
            onClick={() => setSelectedChannel(ch.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedChannel === ch.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <img src={ch.logo} alt={ch.name} className="w-6 h-6 rounded" />
            {ch.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={language === 'tr' ? 'Program ara...' : 'Search programs...'}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Past programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPrograms.map((prog, i) => (
          <div
            key={i}
            className="glass-card-hover p-4 cursor-pointer flex items-center gap-4"
            onClick={() => navigate(`/player/channel/${selectedChannel}`)}
          >
            <div className="w-12 h-12 rounded-lg bg-secondary/60 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{prog.title}</h3>
              <p className="text-xs text-muted-foreground">
                {formatTime(prog.startTime)} - {formatTime(prog.endTime)} · {getDuration(prog.startTime, prog.endTime)}
              </p>
              <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">{prog.description}</p>
            </div>
            <button className="p-2 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform flex-shrink-0">
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Rewind className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{language === 'tr' ? 'Geçmiş yayın bulunamadı' : 'No past broadcasts found'}</p>
        </div>
      )}
    </div>
  );
};

export default CatchupPage;
