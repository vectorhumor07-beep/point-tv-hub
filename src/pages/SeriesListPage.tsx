import { getSeries } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import ContentCard from '@/components/ContentCard';
import { MonitorPlay } from 'lucide-react';

const SeriesListPage = () => {
  const { language } = useApp();
  const series = getSeries();

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <h1 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
        <MonitorPlay className="w-8 h-8 text-primary" />
        {t('nav.series', language)}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {series.map(s => (
          <div key={s.id} className="flex justify-center">
            <ContentCard item={s} type="series" size="lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesListPage;
