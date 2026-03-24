import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getChannels, getMovies, getSeries, getEPG } from '@/lib/mockData';
import { storage } from '@/lib/storage';
import { useApp } from '@/context/AppContext';
import { usePiP } from '@/context/PiPContext';
import { ArrowLeft, Maximize, Volume2, VolumeX, SkipForward, Clock, X, Languages, Subtitles, PictureInPicture2 } from 'lucide-react';
import { useRef, useState, useEffect, useMemo } from 'react';
import { buildLiveStreamUrl, buildVodStreamUrl, buildSeriesStreamUrl } from '@/services/xtreamApi';

const audioTracks = [
  { id: 'tr', label: 'Türkçe', language: 'tr' },
  { id: 'en', label: 'English', language: 'en' },
  { id: 'de', label: 'Deutsch', language: 'de' },
  { id: 'fr', label: 'Français', language: 'fr' },
];

const subtitleTracks = [
  { id: 'off', label: 'Kapalı / Off' },
  { id: 'tr', label: 'Türkçe' },
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'العربية' },
  { id: 'de', label: 'Deutsch' },
];

const PlayerPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, isXtreamMode, xtreamCreds } = useApp();
  const { openPiP } = usePiP();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [epgOpen, setEpgOpen] = useState(type === 'channel');
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [subtitleMenuOpen, setSubtitleMenuOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('tr');
  const [selectedSubtitle, setSelectedSubtitle] = useState('off');
  const controlsTimeout = useRef<NodeJS.Timeout>();

  const allEpg = getEPG();
  const now = new Date();

  let title = '';
  let streamUrl = '';
  let subtitle = '';

  if (isXtreamMode && xtreamCreds && id) {
    const streamId = parseInt(id);
    if (type === 'channel') {
      streamUrl = buildLiveStreamUrl(xtreamCreds, streamId);
      title = `Channel ${id}`;
    } else if (type === 'movie') {
      const ext = searchParams.get('ext') || 'mp4';
      streamUrl = buildVodStreamUrl(xtreamCreds, streamId, ext);
      title = searchParams.get('title') || `Movie ${id}`;
    } else if (type === 'series') {
      const ext = searchParams.get('ext') || 'mp4';
      streamUrl = buildSeriesStreamUrl(xtreamCreds, streamId, ext);
      title = searchParams.get('title') || `Episode`;
      subtitle = `S${searchParams.get('s') || '1'}E${searchParams.get('e') || '1'}`;
    }
  } else {
    // Mock data mode
    if (type === 'channel') {
      const channel = getChannels().find(c => c.id === id);
      title = channel?.name || 'Channel';
      streamUrl = channel?.streamUrl || '';
      subtitle = channel?.nowPlaying || '';
    } else if (type === 'movie') {
      const movie = getMovies().find(m => m.id === id);
      title = movie?.title || 'Movie';
      streamUrl = movie?.streamUrl || '';
      subtitle = movie ? `${movie.year} · ${movie.genre.join(', ')}` : '';
    } else if (type === 'series') {
      const s = getSeries().find(s => s.id === id);
      const sNum = parseInt(searchParams.get('s') || '1');
      const eNum = parseInt(searchParams.get('e') || '1');
      const season = s?.seasons.find(se => se.number === sNum);
      const episode = season?.episodes.find(ep => ep.number === eNum);
      title = s?.title || 'Series';
      streamUrl = episode?.streamUrl || '';
      subtitle = `S${sNum}E${eNum} - ${episode?.title || ''}`;
    }
  }

  if (!streamUrl) {
    streamUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }

  const channelEpg = useMemo(() => {
    if (type !== 'channel' || !id || isXtreamMode) return [];
    return allEpg
      .filter(e => e.channelId === id)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [type, id, allEpg, isXtreamMode]);

  useEffect(() => {
    if (id) storage.addRecentlyWatched(id);
  }, [id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ': e.preventDefault(); togglePlay(); break;
        case 'ArrowLeft': if (videoRef.current) videoRef.current.currentTime -= 10; break;
        case 'ArrowRight': if (videoRef.current) videoRef.current.currentTime += 10; break;
        case 'm': case 'M': setIsMuted(p => !p); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 'Escape': if (epgOpen) setEpgOpen(false); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
      if (id && type) {
        storage.setWatchProgress(id, videoRef.current.currentTime, videoRef.current.duration, type as 'movie' | 'series' | 'channel');
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) { videoRef.current.currentTime = time; setProgress(time); }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
      else { videoRef.current.pause(); setIsPlaying(false); }
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleVideoClick = () => {
    if (type === 'channel') setEpgOpen(prev => !prev);
    togglePlay();
  };

  const changeSpeed = () => {
    const speeds = [0.5, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(playbackRate);
    const next = speeds[(idx + 1) % speeds.length];
    setPlaybackRate(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  const handlePiP = () => {
    openPiP({ streamUrl, title, subtitle, contentType: type || '', contentId: id || '' });
    navigate(-1);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const formatEpgTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex" onMouseMove={handleMouseMove}>
      <div className="flex-1 relative" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          src={streamUrl}
          autoPlay
          muted={isMuted}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
        />

        {/* Controls overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-background/80 to-transparent flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-secondary/50 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h2 className="font-display font-bold">{title}</h2>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            {type === 'channel' && !isXtreamMode && (
              <button
                onClick={() => setEpgOpen(!epgOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  epgOpen ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <Clock className="w-4 h-4" />
                EPG
              </button>
            )}
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
            <input
              type="range" min={0} max={duration || 1} value={progress} onChange={handleSeek}
              className="w-full h-1 mb-3 appearance-none bg-secondary rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="p-2 rounded-full hover:bg-secondary/50">
                  {isPlaying ? '⏸' : '▶️'}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full hover:bg-secondary/50">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <span className="text-xs text-muted-foreground">{formatTime(progress)} / {formatTime(duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => { setAudioMenuOpen(!audioMenuOpen); setSubtitleMenuOpen(false); }}
                    className={`p-2 rounded-full transition-colors ${audioMenuOpen ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/50'}`}
                  >
                    <Languages className="w-5 h-5" />
                  </button>
                  {audioMenuOpen && (
                    <div className="absolute bottom-12 right-0 w-44 glass-card border border-border/50 rounded-lg overflow-hidden shadow-xl z-30">
                      <div className="p-2 border-b border-border/30">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Audio Track</p>
                      </div>
                      {audioTracks.map(track => (
                        <button key={track.id} onClick={() => { setSelectedAudio(track.id); setAudioMenuOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary/50 transition-colors flex items-center justify-between ${selectedAudio === track.id ? 'text-primary font-bold' : ''}`}>
                          {track.label}
                          {selectedAudio === track.id && <span className="text-primary">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => { setSubtitleMenuOpen(!subtitleMenuOpen); setAudioMenuOpen(false); }}
                    className={`p-2 rounded-full transition-colors ${subtitleMenuOpen ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/50'}`}
                  >
                    <Subtitles className="w-5 h-5" />
                  </button>
                  {subtitleMenuOpen && (
                    <div className="absolute bottom-12 right-0 w-44 glass-card border border-border/50 rounded-lg overflow-hidden shadow-xl z-30">
                      <div className="p-2 border-b border-border/30">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Subtitles</p>
                      </div>
                      {subtitleTracks.map(track => (
                        <button key={track.id} onClick={() => { setSelectedSubtitle(track.id); setSubtitleMenuOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary/50 transition-colors flex items-center justify-between ${selectedSubtitle === track.id ? 'text-primary font-bold' : ''}`}>
                          {track.label}
                          {selectedSubtitle === track.id && <span className="text-primary">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={changeSpeed} className="px-2 py-1 rounded text-xs bg-secondary hover:bg-secondary/80">{playbackRate}x</button>
                <button onClick={handlePiP} className="p-2 rounded-full hover:bg-secondary/50" title="PiP">
                  <PictureInPicture2 className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-secondary/50"><SkipForward className="w-5 h-5" /></button>
                <button onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-secondary/50"><Maximize className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              {selectedAudio !== 'tr' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                  🔊 {audioTracks.find(a => a.id === selectedAudio)?.label}
                </span>
              )}
              {selectedSubtitle !== 'off' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                  💬 {subtitleTracks.find(s => s.id === selectedSubtitle)?.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EPG Sidebar - only in mock mode */}
      {type === 'channel' && !isXtreamMode && (
        <div className={`h-full bg-background/95 border-l border-border/50 transition-all duration-300 overflow-hidden ${epgOpen ? 'w-[340px]' : 'w-0'}`}>
          <div className="w-[340px] h-full flex flex-col">
            <div className="p-3 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {language === 'tr' ? 'Program Rehberi' : 'Program Guide'}
              </h3>
              <button onClick={() => setEpgOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {channelEpg.map((prog, i) => {
                const start = new Date(prog.startTime);
                const end = new Date(prog.endTime);
                const isNow = now >= start && now < end;
                const isPast = now >= end;
                const progressPct = isNow ? ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100 : 0;
                return (
                  <div key={i} className={`p-2.5 rounded-lg transition-all ${isNow ? 'bg-primary/15 border border-primary/30' : isPast ? 'bg-secondary/20 opacity-40' : 'bg-secondary/40 hover:bg-secondary/60'}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-mono ${isNow ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {formatEpgTime(prog.startTime)} - {formatEpgTime(prog.endTime)}
                      </span>
                      {isNow && <span className="px-1 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold">LIVE</span>}
                    </div>
                    <p className={`text-xs font-semibold truncate ${isNow ? 'text-primary' : ''}`}>{prog.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{prog.description}</p>
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
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
