import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import { PiPProvider, usePiP } from "@/context/PiPContext";
import Header from "@/components/Header";
import MiniPlayer from "@/components/MiniPlayer";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import LiveTVPage from "@/pages/LiveTVPage";
import MoviesPage from "@/pages/MoviesPage";
import MovieDetailPage from "@/pages/MovieDetailPage";
import SeriesListPage from "@/pages/SeriesListPage";
import SeriesDetailPage from "@/pages/SeriesDetailPage";
import PlayerPage from "@/pages/PlayerPage";
import SearchPage from "@/pages/SearchPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ProfilesPage from "@/pages/ProfilesPage";
import AdminPage from "@/pages/AdminPage";
import SettingsPage from "@/pages/SettingsPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import MultiScreenPage from "@/pages/MultiScreenPage";
import EPGPage from "@/pages/EPGPage";
import CatchupPage from "@/pages/CatchupPage";
import NotFound from "@/pages/NotFound";
import { XtreamCredentials, saveCredentials } from "@/services/xtreamApi";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isPlayer = location.pathname.startsWith('/player');
  if (isPlayer) return <>{children}</>;
  return (
    <>
      <Header />
      {children}
    </>
  );
};

const PiPOverlay = () => {
  const { pip, closePiP } = usePiP();
  const location = useLocation();
  if (!pip.active || location.pathname.startsWith('/player')) return null;
  return (
    <MiniPlayer
      streamUrl={pip.streamUrl}
      title={pip.title}
      subtitle={pip.subtitle}
      contentType={pip.contentType}
      contentId={pip.contentId}
      onClose={closePiP}
    />
  );
};

const AuthenticatedApp = () => {
  const { xtreamCreds, setXtreamCreds } = useApp();

  const handleLogin = (creds: XtreamCredentials) => {
    if (creds.host === 'demo') {
      // Demo mode - no real xtream, use mock data
      setXtreamCreds({ host: 'demo', username: 'demo', password: 'demo' });
    } else {
      saveCredentials(creds);
      setXtreamCreds(creds);
    }
  };

  if (!xtreamCreds) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <PiPProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/live" element={<LiveTVPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/series" element={<SeriesListPage />} />
            <Route path="/series/:id" element={<SeriesDetailPage />} />
            <Route path="/player/:type/:id" element={<PlayerPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profiles" element={<ProfilesPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/multiscreen" element={<MultiScreenPage />} />
            <Route path="/epg" element={<EPGPage />} />
            <Route path="/catchup" element={<CatchupPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <PiPOverlay />
      </BrowserRouter>
    </PiPProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <AuthenticatedApp />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
