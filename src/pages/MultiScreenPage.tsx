import { useState } from 'react';
import { getChannels } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { Monitor, Plus, X, Maximize2, Volume2, VolumeX } from 'lucide-react';

const MultiScreenPage = () => {
  const { language } = useApp();
  const channels = getChannels();
  const [screens, setScreens] = useState<string[]>([channels[0]?.id, channels[1]?.id, channels[2]?.id, channels[3]?.id]);
  const [layout, setLayout] = useState<2 | 4 | 6>(4);
  const [mutedScreens, setMutedScreens] = useState<Set<number>>(new Set([1, 2, 3]));
  const [showPicker, setShowPicker] = useState<number | null>(null);

  const toggleMute = (idx: number) => {
    setMutedScreens(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const replaceScreen = (idx: number, channelId: string) => {
    setScreens(prev => {
      const next = [...prev];
      next[idx] = channelId;
      return next;
    });
    setShowPicker(null);
  };

  const gridClass = layout === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : layout === 4
    ? 'grid-cols-2'
    : 'grid-cols-2 md:grid-cols-3';

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Monitor className="w-6 h-6 text-primary" />
          Multi-Screen
        </h1>
        <div className="flex gap-2">
          {([2, 4, 6] as const).map(l => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                layout === l ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {l} {language === 'tr' ? 'Ekran' : 'Screens'}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid ${gridClass} gap-2`}>
        {Array.from({ length: layout }).map((_, idx) => {
          const channelId = screens[idx];
          const channel = channels.find(c => c.id === channelId);
          const isMuted = mutedScreens.has(idx);

          return (
            <div key={idx} className="relative aspect-video bg-card rounded-xl overflow-hidden border border-border group">
              {channel ? (
                <>
                  <video
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    autoPlay
                    muted={isMuted}
                    loop
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={channel.logo} alt={channel.name} className="w-7 h-7 rounded" />
                        <div>
                          <p className="text-xs font-bold">{channel.name}</p>
                          <p className="text-[10px] text-muted-foreground">{channel.nowPlaying}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleMute(idx)} className="p-1.5 rounded-lg bg-secondary/80 hover:bg-secondary">
                          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => setShowPicker(idx)} className="p-1.5 rounded-lg bg-secondary/80 hover:bg-secondary">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setScreens(prev => { const n = [...prev]; n[idx] = ''; return n; })}
                          className="p-1.5 rounded-lg bg-destructive/80 hover:bg-destructive"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowPicker(idx)}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-sm">{language === 'tr' ? 'Kanal Ekle' : 'Add Channel'}</span>
                </button>
              )}

              {/* Channel Picker */}
              {showPicker === idx && (
                <div className="absolute inset-0 bg-background/95 z-10 overflow-y-auto p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm">{language === 'tr' ? 'Kanal Seç' : 'Select Channel'}</h4>
                    <button onClick={() => setShowPicker(null)} className="p-1 rounded bg-secondary">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {channels.slice(0, 20).map(ch => (
                      <button
                        key={ch.id}
                        onClick={() => replaceScreen(idx, ch.id)}
                        className="flex items-center gap-2 p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-left"
                      >
                        <img src={ch.logo} alt={ch.name} className="w-6 h-6 rounded" />
                        <span className="text-xs truncate">{ch.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiScreenPage;
