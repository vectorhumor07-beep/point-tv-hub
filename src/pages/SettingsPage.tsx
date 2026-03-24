import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { storage } from '@/lib/storage';
import {
  User, Shield, Monitor, Palette, History, Wifi, Clock,
  ChevronRight, Lock, Eye, EyeOff, Check, Sun, Moon,
  Globe, Bell, HardDrive, Zap, Download, Info, Trash2, RotateCcw
} from 'lucide-react';

type SettingsTab = 'account' | 'parental' | 'player' | 'theme' | 'history' | 'device' | 'notifications' | 'storage' | 'about';

const SettingsPage = () => {
  const { language, activeProfile, kidsMode, setKidsMode } = useApp();
  const [tab, setTab] = useState<SettingsTab>('account');
  const [pin, setPin] = useState(storage.getParentalPin());
  const [showPin, setShowPin] = useState(false);
  const [parentalEnabled, setParentalEnabled] = useState(kidsMode);
  const [playerEngine, setPlayerEngine] = useState<'html5' | 'hlsjs' | 'shaka'>('html5');
  const [autoplay, setAutoplay] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState<'auto' | '1080p' | '720p' | '480p'>('auto');
  const [bufferSize, setBufferSize] = useState<'low' | 'medium' | 'high'>('medium');
  const [theme, setTheme] = useState<'dark' | 'midnight' | 'amoled' | 'ocean'>('dark');
  const recentlyWatched = storage.getRecentlyWatched();
  const watchProgress = storage.getWatchProgress();

  const macAddress = 'A4:CF:12:B8:56:3E';
  const deviceId = 'PTV-2024-' + (activeProfile?.id || 'GUEST').toUpperCase().slice(0, 8);
  const accountExpiry = '2026-09-24';

  const tabs: { id: SettingsTab; icon: typeof User; label: string }[] = [
    { id: 'account', icon: User, label: language === 'tr' ? 'Hesap Bilgileri' : 'Account Info' },
    { id: 'parental', icon: Shield, label: language === 'tr' ? 'Ebeveyn Kontrolü' : 'Parental Control' },
    { id: 'player', icon: Monitor, label: language === 'tr' ? 'Player Ayarları' : 'Player Settings' },
    { id: 'theme', icon: Palette, label: language === 'tr' ? 'Tema' : 'Theme' },
    { id: 'history', icon: History, label: language === 'tr' ? 'İzleme Geçmişi' : 'Watch History' },
    { id: 'device', icon: Wifi, label: language === 'tr' ? 'Cihaz Bilgileri' : 'Device Info' },
  ];

  const handlePinSave = () => {
    storage.setParentalPin(pin);
  };

  const themeOptions = [
    { id: 'dark', label: 'Dark Gold', colors: ['#0a0a0a', '#1a1a1a', '#fbbf24'] },
    { id: 'midnight', label: 'Midnight Blue', colors: ['#0a0a1a', '#1a1a3e', '#3b82f6'] },
    { id: 'amoled', label: 'AMOLED Black', colors: ['#000000', '#111111', '#fbbf24'] },
    { id: 'ocean', label: 'Ocean', colors: ['#0a1628', '#162a4a', '#06b6d4'] },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <h1 className="font-display text-3xl font-bold mb-6">
        ⚙️ {language === 'tr' ? 'Ayarlar' : 'Settings'}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass-card p-2 space-y-1">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  tab === id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Account Info */}
          {tab === 'account' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-bold mb-4">
                  {language === 'tr' ? 'Kullanıcı Bilgileri' : 'User Information'}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl ring-2 ring-primary/30">
                      {activeProfile?.avatar || '👤'}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{activeProfile?.name || 'Guest'}</p>
                      <p className="text-sm text-muted-foreground">
                        {activeProfile?.isKids ? '🧒 Kids Profile' : '👤 Standard Profile'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <label className="text-xs text-muted-foreground">{language === 'tr' ? 'Hesap Türü' : 'Account Type'}</label>
                      <p className="font-semibold flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">DEMO</span>
                        {language === 'tr' ? 'Deneme Hesabı' : 'Trial Account'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{language === 'tr' ? 'Hesap Bitiş Tarihi' : 'Account Expiry'}</label>
                      <p className="font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {accountExpiry}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{language === 'tr' ? 'Maksimum Ekran' : 'Max Screens'}</label>
                      <p className="font-semibold">2 {language === 'tr' ? 'Ekran' : 'Screens'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">{language === 'tr' ? 'Video Kalitesi' : 'Video Quality'}</label>
                      <p className="font-semibold">Full HD (1080p)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display font-bold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  {language === 'tr' ? 'Abonelik Durumu' : 'Subscription Status'}
                </h3>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex-1">
                    <p className="font-semibold text-primary">
                      {language === 'tr' ? 'Deneme Süresi Aktif' : 'Trial Period Active'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'tr' ? 'Kalan süre: 183 gün' : 'Remaining: 183 days'}
                    </p>
                  </div>
                  <a href="/subscription" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
                    {language === 'tr' ? 'Planları Gör' : 'View Plans'}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Parental Control */}
          {tab === 'parental' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {language === 'tr' ? 'Ebeveyn Kontrolü' : 'Parental Control'}
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                    <div>
                      <p className="font-semibold">{language === 'tr' ? 'Çocuk Modu' : 'Kids Mode'}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'tr' ? 'Sadece çocuk içerikleri göster' : 'Show only kids content'}
                      </p>
                    </div>
                    <button
                      onClick={() => { setParentalEnabled(!parentalEnabled); setKidsMode(!parentalEnabled); }}
                      className={`w-14 h-7 rounded-full transition-colors relative ${parentalEnabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-foreground absolute top-1 transition-all ${parentalEnabled ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      <Lock className="w-4 h-4 inline mr-2" />
                      PIN {language === 'tr' ? 'Kodu' : 'Code'}
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 max-w-xs">
                        <input
                          type={showPin ? 'text' : 'password'}
                          value={pin}
                          onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-lg tracking-[0.5em] font-mono"
                          maxLength={6}
                        />
                        <button onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button onClick={handlePinSave} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      {language === 'tr' ? 'Kısıtlı Kategoriler' : 'Restricted Categories'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Horror', 'Crime', 'Thriller', '18+', 'Violence'].map(cat => (
                        <span key={cat} className="px-3 py-1.5 rounded-full bg-destructive/20 text-destructive text-sm font-medium">
                          🚫 {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Player Settings */}
          {tab === 'player' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  {language === 'tr' ? 'Player Ayarları' : 'Player Settings'}
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      {language === 'tr' ? 'Player Motoru' : 'Player Engine'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'html5' as const, label: 'HTML5 Native', desc: language === 'tr' ? 'Varsayılan' : 'Default' },
                        { id: 'hlsjs' as const, label: 'HLS.js', desc: 'HLS Streams' },
                        { id: 'shaka' as const, label: 'Shaka Player', desc: 'DASH + DRM' },
                      ].map(eng => (
                        <button
                          key={eng.id}
                          onClick={() => setPlayerEngine(eng.id)}
                          className={`p-4 rounded-xl text-left transition-all ${
                            playerEngine === eng.id
                              ? 'bg-primary/20 border-2 border-primary'
                              : 'bg-secondary border-2 border-transparent hover:border-border'
                          }`}
                        >
                          <p className="font-semibold text-sm">{eng.label}</p>
                          <p className="text-xs text-muted-foreground">{eng.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                      <div>
                        <p className="font-semibold text-sm">{language === 'tr' ? 'Otomatik Oynat' : 'Autoplay'}</p>
                      </div>
                      <button
                        onClick={() => setAutoplay(!autoplay)}
                        className={`w-14 h-7 rounded-full transition-colors relative ${autoplay ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-foreground absolute top-1 transition-all ${autoplay ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                      <div>
                        <p className="font-semibold text-sm">{language === 'tr' ? 'Sonraki Bölüm' : 'Auto Next Episode'}</p>
                      </div>
                      <button
                        onClick={() => setAutoNext(!autoNext)}
                        className={`w-14 h-7 rounded-full transition-colors relative ${autoNext ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-foreground absolute top-1 transition-all ${autoNext ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      {language === 'tr' ? 'Varsayılan Kalite' : 'Default Quality'}
                    </label>
                    <div className="flex gap-2">
                      {(['auto', '1080p', '720p', '480p'] as const).map(q => (
                        <button
                          key={q}
                          onClick={() => setDefaultQuality(q)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            defaultQuality === q ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {q === 'auto' ? (language === 'tr' ? 'Otomatik' : 'Auto') : q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      {language === 'tr' ? 'Buffer Boyutu' : 'Buffer Size'}
                    </label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map(b => (
                        <button
                          key={b}
                          onClick={() => setBufferSize(b)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                            bufferSize === b ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {b === 'low' ? (language === 'tr' ? 'Düşük' : 'Low') : b === 'medium' ? (language === 'tr' ? 'Orta' : 'Medium') : (language === 'tr' ? 'Yüksek' : 'High')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Theme */}
          {tab === 'theme' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  {language === 'tr' ? 'Tema Seçimi' : 'Theme Selection'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {themeOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id as typeof theme)}
                      className={`p-4 rounded-xl transition-all text-center ${
                        theme === opt.id
                          ? 'ring-2 ring-primary bg-primary/10'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      <div className="flex justify-center gap-1 mb-3">
                        {opt.colors.map((c, i) => (
                          <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      {theme === opt.id && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Watch History */}
          {tab === 'history' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  {language === 'tr' ? 'İzleme Geçmişi & Log Kayıtları' : 'Watch History & Logs'}
                </h2>
                {watchProgress.length === 0 && recentlyWatched.length === 0 ? (
                  <p className="text-muted-foreground text-sm">{language === 'tr' ? 'Henüz izleme geçmişi yok.' : 'No watch history yet.'}</p>
                ) : (
                  <div className="space-y-2">
                    {watchProgress.map((wp, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-secondary">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-mono text-xs">
                          {wp.contentType === 'movie' ? '🎬' : wp.contentType === 'series' ? '📺' : '📡'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{wp.contentId}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(wp.progress / 60)}:{Math.floor(wp.progress % 60).toString().padStart(2, '0')} / {Math.floor(wp.duration / 60)}:{Math.floor(wp.duration % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{new Date(wp.timestamp).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">{new Date(wp.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <div className="w-16">
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${(wp.progress / wp.duration) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Device Info */}
          {tab === 'device' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-primary" />
                  {language === 'tr' ? 'Cihaz Bilgileri' : 'Device Information'}
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'MAC ' + (language === 'tr' ? 'Adresi' : 'Address'), value: macAddress },
                    { label: language === 'tr' ? 'Cihaz ID' : 'Device ID', value: deviceId },
                    { label: language === 'tr' ? 'Hesap Bitiş Tarihi' : 'Account Expiry', value: accountExpiry },
                    { label: language === 'tr' ? 'Uygulama Sürümü' : 'App Version', value: 'Point TV v2.4.1' },
                    { label: language === 'tr' ? 'Sunucu' : 'Server', value: 'eu-west-1.pointtv.io' },
                    { label: language === 'tr' ? 'Bağlantı' : 'Connection', value: 'HTTPS/TLS 1.3' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-mono text-sm font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
