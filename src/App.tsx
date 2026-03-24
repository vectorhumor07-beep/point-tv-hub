import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
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
import NotFound from "@/pages/NotFound";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
