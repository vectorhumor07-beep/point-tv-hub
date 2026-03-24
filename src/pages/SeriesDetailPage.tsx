import { useParams, useNavigate } from 'react-router-dom';
import { getSeries } from '@/lib/mockData';
import { Play, Star, Plus, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

const SeriesDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist, favorites, toggleFavorite } = useApp();
  const series = getSeries().find(s => s.id === id);
  const [activeSeason, setActiveSeason] = useState(0);

  if (!series) return <div className="min-h-screen pt-20 px-6 text-center text-muted-foreground">Series not found</div>;

  const season = series.seasons[activeSeason];

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      {/* Hero */}
      <div className="relative glass-card overflow-hidden mb-8 p-6 flex flex-col md:flex-row gap-6">
        <img src={series.poster} alt={series.title} className="w-48 h-72 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold mb-2">{series.title}</h1>
          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-primary"><Star className="w-4 h-4 fill-current" /> {series.rating}</span>
            <span>{series.year}</span>
            <span>{series.seasons.length} Seasons</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{series.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {series.genre.map(g => (
              <span key={g} className="px-3 py-1 rounded-full bg-secondary text-xs">{g}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/player/series/${series.id}?s=1&e=1`)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4 fill-current" /> Play S1E1
            </button>
            <button onClick={() => toggleWatchlist(series.id)} className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80">
              <Plus className="w-5 h-5" />
            </button>
            <button onClick={() => toggleFavorite(series.id)} className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80">
              <Heart className={`w-5 h-5 ${favorites.includes(series.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Season selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {series.seasons.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveSeason(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSeason === i ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Season {s.number}
          </button>
        ))}
      </div>

      {/* Episodes */}
      <div className="space-y-3">
        {season.episodes.map(ep => (
          <div
            key={ep.id}
            onClick={() => navigate(`/player/series/${series.id}?s=${season.number}&e=${ep.number}`)}
            className="glass-card-hover flex items-center gap-4 p-4 cursor-pointer"
          >
            <img src={ep.thumbnail} alt={ep.title} className="w-28 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">E{ep.number}. {ep.title}</h4>
              <p className="text-xs text-muted-foreground">{ep.duration} min</p>
            </div>
            <Play className="w-5 h-5 text-primary" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesDetailPage;
