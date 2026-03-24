import { useState, useEffect } from 'react';
import { Loader2, Wifi, Signal } from 'lucide-react';

interface BufferingScreenProps {
  loading: boolean;
  minDuration?: number; // minimum display time in ms
  maxDuration?: number; // max wait time in ms (default 45s)
  onTimeout?: () => void;
  type?: 'live' | 'movie' | 'series';
}

const BufferingScreen = ({ loading, minDuration = 1500, maxDuration = 45000, onTimeout, type = 'live' }: BufferingScreenProps) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const statusMessages = type === 'live'
    ? ['Kanallar yükleniyor...', 'Sunucuya bağlanılıyor...', 'EPG verileri alınıyor...', 'Kanal listesi hazırlanıyor...', 'Neredeyse hazır...']
    : type === 'movie'
    ? ['Filmler yükleniyor...', 'Katalog taranıyor...', 'Afişler hazırlanıyor...', 'Film bilgileri alınıyor...', 'Neredeyse hazır...']
    : ['Diziler yükleniyor...', 'Katalog taranıyor...', 'Sezon bilgileri alınıyor...', 'Dizi bilgileri hazırlanıyor...', 'Neredeyse hazır...'];

  useEffect(() => {
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / maxDuration) * 100, 99);
      setProgress(pct);

      const msgIndex = Math.min(Math.floor((pct / 100) * statusMessages.length), statusMessages.length - 1);
      setStatusText(statusMessages[msgIndex]);
    }, 200);

    const timeout = setTimeout(() => {
      onTimeout?.();
    }, maxDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [maxDuration]);

  useEffect(() => {
    if (!loading && progress > 0) {
      setProgress(100);
      setStatusText('Hazır!');
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${!loading && progress >= 100 ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-destructive/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse scale-150" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
            {type === 'live' ? (
              <Signal className="w-10 h-10 text-primary animate-pulse" />
            ) : (
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            )}
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-primary" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
            <div className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
          </div>
        </div>

        {/* Buffering text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Buffering
            <span className="inline-flex ml-1">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </h2>
          <p className="text-sm text-muted-foreground animate-pulse">{statusText}</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 space-y-2">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center font-mono">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  );
};

export default BufferingScreen;
