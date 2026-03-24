import { useState, useEffect, useCallback } from 'react';
import { Bell, X, Tv, Film, Star, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getChannels, getMovies } from '@/lib/mockData';

interface Notification {
  id: string;
  type: 'new_content' | 'live_start' | 'recommendation' | 'system';
  title: string;
  message: string;
  icon: 'tv' | 'film' | 'star' | 'clock';
  time: Date;
  read: boolean;
}

const generateNotifications = (lang: string): Notification[] => {
  const channels = getChannels();
  const movies = getMovies();
  const now = new Date();

  return [
    {
      id: 'n1',
      type: 'new_content',
      title: lang === 'tr' ? 'Yeni Film Eklendi' : 'New Movie Added',
      message: `${movies[0]?.title} ${lang === 'tr' ? 'şimdi izlenebilir!' : 'is now available!'}`,
      icon: 'film',
      time: new Date(now.getTime() - 5 * 60000),
      read: false,
    },
    {
      id: 'n2',
      type: 'live_start',
      title: lang === 'tr' ? 'Canlı Yayın Başladı' : 'Live Broadcast Started',
      message: `${channels[0]?.name}: ${channels[0]?.nowPlaying}`,
      icon: 'tv',
      time: new Date(now.getTime() - 15 * 60000),
      read: false,
    },
    {
      id: 'n3',
      type: 'recommendation',
      title: lang === 'tr' ? 'Sizin İçin Öneri' : 'Recommended for You',
      message: `${movies[3]?.title} - ${lang === 'tr' ? 'Beğenebileceğiniz bir film' : 'A movie you might like'}`,
      icon: 'star',
      time: new Date(now.getTime() - 30 * 60000),
      read: true,
    },
    {
      id: 'n4',
      type: 'system',
      title: lang === 'tr' ? 'Yayın Güncellendi' : 'Schedule Updated',
      message: lang === 'tr' ? 'EPG verileri güncellendi' : 'EPG data has been updated',
      icon: 'clock',
      time: new Date(now.getTime() - 60 * 60000),
      read: true,
    },
    {
      id: 'n5',
      type: 'new_content',
      title: lang === 'tr' ? 'Yeni Dizi Sezonu' : 'New Series Season',
      message: lang === 'tr' ? 'The Empire - Sezon 4 eklendi!' : 'The Empire - Season 4 added!',
      icon: 'film',
      time: new Date(now.getTime() - 2 * 3600000),
      read: true,
    },
  ];
};

const iconMap = {
  tv: Tv,
  film: Film,
  star: Star,
  clock: Clock,
};

const NotificationSystem = () => {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(generateNotifications(language));
  }, [language]);

  // Simulate new notification every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const movies = getMovies();
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      const newNotif: Notification = {
        id: `n-${Date.now()}`,
        type: 'recommendation',
        title: language === 'tr' ? 'Trend İçerik' : 'Trending Content',
        message: `${randomMovie.title} ${language === 'tr' ? 'şu an çok izleniyor!' : 'is trending now!'}`,
        icon: 'star',
        time: new Date(),
        read: false,
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 10));
    }, 45000);
    return () => clearInterval(interval);
  }, [language]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diff < 1) return language === 'tr' ? 'Az önce' : 'Just now';
    if (diff < 60) return `${diff} ${language === 'tr' ? 'dk önce' : 'min ago'}`;
    const hours = Math.floor(diff / 60);
    return `${hours} ${language === 'tr' ? 'saat önce' : 'hr ago'}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-10 w-80 max-h-96 z-50 glass-card border border-border/50 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-display font-bold text-sm">
                {language === 'tr' ? 'Bildirimler' : 'Notifications'}
              </h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
                  {language === 'tr' ? 'Tümünü okundu işaretle' : 'Mark all read'}
                </button>
              )}
            </div>
            <div className="overflow-y-auto max-h-72">
              {notifications.map(n => {
                const Icon = iconMap[n.icon];
                return (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-border/20 flex gap-3 transition-colors hover:bg-secondary/30 ${
                      !n.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      !n.read ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{n.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{n.message}</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5">{timeAgo(n.time)}</p>
                    </div>
                    <button onClick={() => removeNotification(n.id)} className="p-1 hover:bg-secondary rounded opacity-0 group-hover:opacity-100">
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
