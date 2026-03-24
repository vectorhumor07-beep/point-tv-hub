import { useMemo } from 'react';
import { getChannels, getEPG } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';

const EPGPage = () => {
  const { language } = useApp();
  const navigate = useNavigate();
  const channels = getChannels();
  const allEpg = getEPG();
  const now = new Date();

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const channelEpgMap = useMemo(() => {
    const map: Record<string, typeof allEpg> = {};
    channels.forEach(ch => {
      map[ch.id] = allEpg
        .filter(e => e.channelId === ch.id)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    });
    return map;
  }, [channels, allEpg]);

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <h1 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
        <Clock className="w-8 h-8 text-primary" />
        {language === 'tr' ? 'EPG - Program Rehberi' : 'EPG - Program Guide'}
      </h1>

      <div className="space-y-3">
        {channels.map(channel => {
          const programs = channelEpgMap[channel.id] || [];
          const currentProg = programs.find(p => now >= new Date(p.startTime) && now < new Date(p.endTime));

          return (
            <div key={channel.id} className="glass-card overflow-hidden">
              {/* Channel header */}
              <div className="flex items-center gap-3 p-4 border-b border-border/30">
                <img src={channel.logo} alt={channel.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm">{channel.name}</h3>
                  {currentProg && (
                    <p className="text-xs text-primary truncate">
                      ▶ {currentProg.title}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/player/channel/${channel.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                >
                  <Play className="w-3 h-3 fill-current" />
                  {language === 'tr' ? 'İzle' : 'Watch'}
                </button>
              </div>

              {/* EPG programs horizontal scroll */}
              <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-hide">
                {programs.map((prog, i) => {
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
                      className={`flex-shrink-0 w-48 p-2.5 rounded-lg transition-all ${
                        isNow
                          ? 'bg-primary/15 border border-primary/40'
                          : isPast
                          ? 'bg-secondary/20 opacity-40'
                          : 'bg-secondary/50 hover:bg-secondary/70'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-mono ${isNow ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {formatTime(prog.startTime)} - {formatTime(prog.endTime)}
                        </span>
                        {isNow && (
                          <span className="px-1 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold">LIVE</span>
                        )}
                      </div>
                      <p className={`text-xs font-semibold truncate ${isNow ? 'text-primary' : 'text-foreground'}`}>
                        {prog.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">{prog.description}</p>
                      {isNow && (
                        <div className="mt-1.5 h-0.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${progressPct}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EPGPage;
