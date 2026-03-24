import { Link, useLocation } from 'react-router-dom';
import { Home, Tv, Film, MonitorPlay, Search, Heart, Settings, Globe, Monitor, CreditCard, Clock, Rewind, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import NotificationSystem from '@/components/NotificationSystem';
import pointtvLogo from '@/assets/pointtv-logo.jpg';

const Header = () => {
  const { language, setLanguage, activeProfile, logout, isXtreamMode } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: t('nav.home', language) },
    { to: '/live', icon: Tv, label: t('nav.liveTV', language) },
    { to: '/movies', icon: Film, label: t('nav.movies', language) },
    { to: '/series', icon: MonitorPlay, label: t('nav.series', language) },
    { to: '/epg', icon: Clock, label: 'EPG' },
    { to: '/catchup', icon: Rewind, label: 'Catch-up' },
    { to: '/multiscreen', icon: Monitor, label: 'Multi-Screen' },
    { to: '/search', icon: Search, label: t('nav.search', language) },
    { to: '/favorites', icon: Heart, label: t('nav.favorites', language) },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="flex items-center justify-between px-6 py-1.5">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src={pointtvLogo} alt="Point TV" className="h-16 w-auto rounded-xl shadow-lg ring-1 ring-primary/20" />
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === to
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Globe className="w-4 h-4" />
            {language.toUpperCase()}
          </button>

          <NotificationSystem />

          <Link to="/subscription" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors" title={language === 'tr' ? 'Abonelik' : 'Subscription'}>
            <CreditCard className="w-4 h-4" />
          </Link>

          <Link to="/settings" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Settings className="w-4 h-4" />
          </Link>

          <button
            onClick={logout}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title={language === 'tr' ? 'Çıkış' : 'Logout'}
          >
            <LogOut className="w-4 h-4" />
          </button>

          <Link to="/profiles" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-lg ring-2 ring-primary/30">
              {activeProfile?.avatar || '👤'}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-border/30">
        {navItems.slice(0, 6).map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors ${
              location.pathname === to ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
