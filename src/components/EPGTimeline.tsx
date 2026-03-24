import { useMemo, useRef } from 'react';
import { getChannels, getEPG } from '@/lib/mockData';
import { Channel, EPGItem } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EPGTimeline = () => {
  const channels = getChannels().slice(0, 15);
  const allEpg = getEPG();
  const scrollRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const startHour = Math.max(0, now.getHours() - 1);

  const hours = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const h = (startHour + i) % 24;
      return `${h.toString().padStart(2, '0')}:00`;
    });
  }, [startHour]);

  const getChannelPrograms = (channelId: string): EPGItem[] => {
    return allEpg
      .filter(e => e.channelId === channelId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const getTimePosition = (time: Date): number => {
    const startOfRange = new Date(now);
    startOfRange.setHours(startHour, 0, 0, 0);
    const diff = (time.getTime() - startOfRange.getTime()) / (1000 * 60);
    return (diff / (8 * 60)) * 100;
  };

  const nowPosition = getTimePosition(now);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="glass-card p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-lg">📺 TV Rehberi (EPG)</h3>
        <div className="flex gap-1">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
        <div style={{ minWidth: '900px' }}>
          {/* Time header */}
          <div className="flex border-b border-border pb-2 mb-2">
            <div className="w-36 flex-shrink-0" />
            <div className="flex-1 relative">
              <div className="flex">
                {hours.map(h => (
                  <div key={h} className="flex-1 text-xs text-muted-foreground font-medium">{h}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Channels */}
          <div className="space-y-1 relative">
            {/* Now indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-20"
              style={{ left: `calc(144px + (100% - 144px) * ${nowPosition / 100})` }}
            >
              <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary" />
            </div>

            {channels.map(channel => {
              const programs = getChannelPrograms(channel.id);
              return (
                <div key={channel.id} className="flex items-center h-12">
                  {/* Channel info */}
                  <div className="w-36 flex-shrink-0 flex items-center gap-2 pr-3">
                    <img src={channel.logo} alt={channel.name} className="w-8 h-8 rounded" />
                    <span className="text-xs font-medium truncate">{channel.name}</span>
                  </div>

                  {/* Programs */}
                  <div className="flex-1 relative h-full">
                    {programs.map((prog, i) => {
                      const start = new Date(prog.startTime);
                      const end = new Date(prog.endTime);
                      const leftPct = getTimePosition(start);
                      const rightPct = getTimePosition(end);
                      const widthPct = rightPct - leftPct;

                      if (leftPct > 100 || rightPct < 0 || widthPct <= 0) return null;

                      const isNow = now >= start && now < end;

                      return (
                        <div
                          key={i}
                          className={`absolute top-0.5 bottom-0.5 rounded-md px-2 flex items-center overflow-hidden text-xs cursor-pointer transition-colors ${
                            isNow
                              ? 'bg-primary/20 border border-primary/40 text-foreground'
                              : 'bg-secondary/60 border border-border/30 text-muted-foreground hover:bg-secondary'
                          }`}
                          style={{
                            left: `${Math.max(0, leftPct)}%`,
                            width: `${Math.min(widthPct, 100 - Math.max(0, leftPct))}%`,
                          }}
                        >
                          <span className="truncate font-medium">{prog.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPGTimeline;
