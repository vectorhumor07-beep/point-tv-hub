import { Link, useLocation } from 'react-router-dom';
import { Home, Tv, Film, MonitorPlay, Search, Heart, Settings, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import pointtvLogo from '@/assets/pointtv-logo.jpg';

const Header = () => {
  const { language, setLanguage, activeProfile } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: t('nav.home', language) },
    { to: '/live', icon: Tv, label: t('nav.liveTV', language) },
    { to: '/movies', icon: Film, label: t('nav.movies', language) },
    { to: '/series', icon: MonitorPlay, label: t('nav.series', language) },
    { to: '/search', icon: Search, label: t('nav.search', language) },
    { to: '/favorites', icon: Heart, label: t('nav.favorites', language) },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={pointtvLogo} alt="Point TV" className="h-10 w-auto rounded" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Globe className="w-4 h-4" />
            {language.toUpperCase()}
          </button>

          <Link to="/admin" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Settings className="w-4 h-4" />
          </Link>

          <Link to="/profiles" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-lg">
              {activeProfile?.avatar || '👤'}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center justify-around px-2 py-2 border-t border-border/30">
        {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-colors ${
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
