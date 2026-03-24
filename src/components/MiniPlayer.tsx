import { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MiniPlayerProps {
  streamUrl: string;
  title: string;
  subtitle?: string;
  contentType: string;
  contentId: string;
  onClose: () => void;
}

const MiniPlayer = ({ streamUrl, title, subtitle, contentType, contentId, onClose }: MiniPlayerProps) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 380, y: window.innerHeight - 260 });
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 340, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 220, e.clientY - dragOffset.current.y)),
      });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [isDragging]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
      else { videoRef.current.pause(); setIsPlaying(false); }
    }
  };

  const goFullPlayer = () => {
    onClose();
    navigate(`/player/${contentType}/${contentId}`);
  };

  return (
    <div
      className="fixed z-[60] w-[340px] rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-background"
      style={{ left: position.x, top: position.y }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-3 py-1.5 bg-background/95 cursor-move border-b border-border/30"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">{title}</p>
          {subtitle && <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={goFullPlayer} className="p-1 rounded hover:bg-secondary transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video */}
      <div className="relative aspect-video bg-black">
        <video ref={videoRef} src={streamUrl} autoPlay className="w-full h-full object-contain" />

        {/* Controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity">
          <button onClick={togglePlay} className="p-1 rounded hover:bg-white/20">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="p-1 rounded hover:bg-white/20">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
