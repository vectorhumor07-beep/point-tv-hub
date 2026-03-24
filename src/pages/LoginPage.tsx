import { useState } from 'react';
import { Tv, Loader2, AlertCircle, Wifi } from 'lucide-react';
import { authenticate, saveCredentials, XtreamCredentials } from '@/services/xtreamApi';
import pointtvLogo from '@/assets/pointtv-logo.jpg';

interface LoginPageProps {
  onLogin: (creds: XtreamCredentials) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host || !username || !password) {
      setError('Tüm alanları doldurun / Fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    const creds: XtreamCredentials = { host, username, password };

    try {
      const result = await authenticate(creds);
      if (result.user_info?.auth === 1) {
        saveCredentials(creds);
        onLogin(creds);
      } else {
        setError('Giriş başarısız. Bilgilerinizi kontrol edin. / Login failed. Check your credentials.');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı. DNS/URL adresini kontrol edin. / Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    onLogin({ host: 'demo', username: 'demo', password: 'demo' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={pointtvLogo} alt="Point TV" className="h-24 w-auto rounded-2xl shadow-2xl ring-2 ring-primary/30 mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground">Point TV</h1>
          <p className="text-muted-foreground text-sm mt-1">IPTV / OTT Platform</p>
        </div>

        {/* Login card */}
        <div className="glass-card p-8 border border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <Wifi className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Xtream Bağlantısı</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                DNS / Server URL
              </label>
              <input
                type="text"
                value={host}
                onChange={e => setHost(e.target.value)}
                placeholder="http://example.com:8080"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                Kullanıcı Adı / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                Şifre / Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-accent"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Bağlanıyor...
                </>
              ) : (
                <>
                  <Tv className="w-5 h-5" />
                  Giriş Yap / Login
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-border/30">
            <button
              onClick={handleDemo}
              className="w-full py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
            >
              🎬 Demo Modu ile Devam Et
            </button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Demo modu sahte verilerle çalışır / Demo mode uses mock data
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-6">
          Point TV © 2024 — All rights reserved
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
