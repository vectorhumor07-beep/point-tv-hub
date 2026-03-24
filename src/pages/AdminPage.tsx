import { useState } from 'react';
import { getMovies, getSeries, getChannels } from '@/lib/mockData';
import { BarChart3, Users, Film, Tv, Eye, Clock, TrendingUp } from 'lucide-react';

const AdminPage = () => {
  const [tab, setTab] = useState<'dashboard' | 'content' | 'analytics'>('dashboard');
  const movies = getMovies();
  const series = getSeries();
  const channels = getChannels();

  const fakeStats = {
    activeUsers: Math.floor(1200 + Math.random() * 800),
    totalWatchTime: Math.floor(4500 + Math.random() * 2000),
    popularMovie: movies[Math.floor(Math.random() * movies.length)]?.title,
    popularChannel: channels[Math.floor(Math.random() * channels.length)]?.name,
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-6">
      <h1 className="font-display text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6">
        {(['dashboard', 'content', 'analytics'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Active Users</span>
            </div>
            <p className="text-3xl font-display font-bold">{fakeStats.activeUsers}</p>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Watch Hours</span>
            </div>
            <p className="text-3xl font-display font-bold">{fakeStats.totalWatchTime}h</p>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <Film className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Content</span>
            </div>
            <p className="text-3xl font-display font-bold">{movies.length + series.length}</p>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <Tv className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Live Channels</span>
            </div>
            <p className="text-3xl font-display font-bold">{channels.length}</p>
          </div>

          <div className="glass-card p-6 sm:col-span-2">
            <h3 className="font-display font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Trending
            </h3>
            <p className="text-sm text-muted-foreground">Most watched movie: <span className="text-foreground font-medium">{fakeStats.popularMovie}</span></p>
            <p className="text-sm text-muted-foreground mt-1">Top channel: <span className="text-foreground font-medium">{fakeStats.popularChannel}</span></p>
          </div>

          <div className="glass-card p-6 sm:col-span-2">
            <h3 className="font-display font-bold mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" /> Real-time
            </h3>
            <p className="text-sm text-muted-foreground">Currently watching: <span className="text-foreground font-medium">{Math.floor(200 + Math.random() * 300)}</span></p>
            <p className="text-sm text-muted-foreground mt-1">Peak today: <span className="text-foreground font-medium">{Math.floor(800 + Math.random() * 400)}</span></p>
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold">Content Library</h2>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground font-medium">Title</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Type</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Rating</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {movies.slice(0, 10).map(m => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="p-3">{m.title}</td>
                    <td className="p-3 text-muted-foreground">Movie</td>
                    <td className="p-3"><span className="text-primary">{m.rating}</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Active</span></td>
                  </tr>
                ))}
                {series.slice(0, 5).map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="p-3">{s.title}</td>
                    <td className="p-3 text-muted-foreground">Series</td>
                    <td className="p-3"><span className="text-primary">{s.rating}</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-6">
            <h3 className="font-display font-bold mb-4">Watch Time Distribution</h3>
            <div className="space-y-3">
              {['Movies', 'Series', 'Live TV'].map((cat, i) => {
                const pct = [45, 35, 20][i];
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-display font-bold mb-4">Top Genres</h3>
            <div className="space-y-2">
              {['Action', 'Drama', 'Sci-Fi', 'Thriller', 'Comedy'].map((genre, i) => (
                <div key={genre} className="flex items-center gap-3">
                  <span className="text-sm w-20">{genre}</span>
                  <div className="flex-1 h-6 rounded bg-secondary overflow-hidden">
                    <div className="h-full bg-primary/80 rounded" style={{ width: `${90 - i * 15}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
