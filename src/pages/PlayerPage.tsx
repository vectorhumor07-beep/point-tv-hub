import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getChannels, getMovies, getSeries } from '@/lib/mockData';
import { storage } from '@/lib/storage';
import { ArrowLeft, Maximize, Volume2, VolumeX, SkipForward, Settings } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const PlayerPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  let title = '';
  let streamUrl = '';
  let subtitle = '';

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

  // Fallback
  if (!streamUrl) {
    streamUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }

  useEffect(() => {
    if (id) {
      storage.addRecentlyWatched(id);
    }
  }, [id]);

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
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setProgress(time);
    }
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

  const changeSpeed = () => {
    const speeds = [0.5, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(playbackRate);
    const next = speeds[(idx + 1) % speeds.length];
    setPlaybackRate(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-background z-50" onMouseMove={handleMouseMove} onClick={togglePlay}>
      <video
        ref={videoRef}
        src={streamUrl}
        autoPlay
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
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
          <div>
            <h2 className="font-display font-bold">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
          {/* Progress */}
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={progress}
            onChange={handleSeek}
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
            <div className="flex items-center gap-3">
              <button onClick={changeSpeed} className="px-2 py-1 rounded text-xs bg-secondary hover:bg-secondary/80">
                {playbackRate}x
              </button>
              <button className="p-2 rounded-full hover:bg-secondary/50">
                <SkipForward className="w-5 h-5" />
              </button>
              <button onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-secondary/50">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
