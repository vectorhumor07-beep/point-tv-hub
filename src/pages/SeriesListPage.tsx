import { useState } from 'react';
import { getSeries } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import ContentCard from '@/components/ContentCard';
import { MonitorPlay, LayoutGrid, Sword, Drama as DramaIcon, Rocket, Crosshair, Laugh, Sparkles, Mountain, Scale } from 'lucide-react';

const genreConfig = [
  { id: 'All', icon: LayoutGrid },
  { id: 'Action', icon: Sword },
  { id: 'Drama', icon: DramaIcon },
  { id: 'Sci-Fi', icon: Rocket },
  { id: 'Thriller', icon: Crosshair },
  { id: 'Comedy', icon: Laugh },
  { id: 'Fantasy', icon: Sparkles },
  { id: 'Adventure', icon: Mountain },
  { id: 'Crime', icon: Scale },
];

const SeriesListPage = () => {
  const { language } = useApp();
  const series = getSeries();
  const [activeGenre, setActiveGenre] = useState('All');

  const allGenres = Array.from(new Set(series.flatMap(s => s.genre)));
  const activeConfigs = genreConfig.filter(g => g.id === 'All' || allGenres.includes(g.id));

  const filtered = activeGenre === 'All' ? series : series.filter(s => s.genre.includes(activeGenre));

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <MonitorPlay className="w-7 h-7 text-primary" />
          </div>
          {t('nav.series', language)}
        </h1>
        <div className="text-sm text-muted-foreground">
          <span className="text-primary font-bold">{filtered.length}</span> {language === 'tr' ? 'dizi' : 'series'}
        </div>
      </div>

      {/* Genre filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {activeConfigs.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveGenre(id)}
            className={`group flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeGenre === id
                ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-foreground border border-primary/30 shadow-lg shadow-primary/10 scale-105'
                : 'glass-card hover:bg-foreground/5 border border-border/30 hover:border-border/60 hover:scale-[1.02]'
            }`}
          >
            <Icon className={`w-4 h-4 transition-colors ${activeGenre === id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
            {id === 'All' ? (language === 'tr' ? 'Tümü' : 'All') : id}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
        {filtered.map(s => (
          <div key={s.id} className="flex justify-center">
            <ContentCard item={s} type="series" size="lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesListPage;
