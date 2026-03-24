import { Channel, Movie, Series, EPGItem, ChannelCategory } from './types';

const SAMPLE_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const channelCategories: ChannelCategory[] = ['news', 'sports', 'movies', 'kids', 'international', 'entertainment', 'music', 'documentary'];

const channelNames: Record<ChannelCategory, string[]> = {
  news: ['CNN International', 'BBC World', 'Al Jazeera', 'Sky News', 'Euronews', 'France 24', 'DW News'],
  sports: ['ESPN', 'beIN Sports', 'Sky Sports', 'Eurosport', 'Fox Sports', 'NBC Sports'],
  movies: ['HBO', 'Cinemax', 'Showtime', 'AMC', 'TCM', 'FX Movies'],
  kids: ['Cartoon Network', 'Nickelodeon', 'Disney Channel', 'Baby TV', 'Nick Jr'],
  international: ['TRT World', 'NHK World', 'CGTN', 'RT', 'Arirang'],
  entertainment: ['Netflix Live', 'Comedy Central', 'E! Entertainment', 'MTV', 'VH1', 'Bravo'],
  music: ['MTV Music', 'VH1 Classic', 'TRACE Urban', 'Mezzo', 'Stingray Music'],
  documentary: ['National Geographic', 'Discovery', 'History Channel', 'Animal Planet', 'BBC Earth'],
};

export const generateChannels = (): Channel[] => {
  const channels: Channel[] = [];
  let id = 1;
  for (const category of channelCategories) {
    for (const name of channelNames[category]) {
      channels.push({
        id: `ch-${id}`,
        name,
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFD700&color=000&size=64&bold=true`,
        category,
        streamUrl: SAMPLE_STREAM,
        nowPlaying: `Live: ${name} Special`,
        nextUp: `Coming Up: ${name} Evening Show`,
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        isHD: Math.random() > 0.3,
      });
      id++;
    }
  }
  return channels;
};

// Poster image map for movies that have generated images
const posterMap: Record<string, string> = {};

// We'll dynamically import posters
const loadPosters = () => {
  const modules = import.meta.glob('/src/assets/posters/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;
  const map: Record<string, string> = {};
  for (const [path, url] of Object.entries(modules)) {
    const filename = path.split('/').pop()?.replace('.jpg', '') || '';
    map[filename] = url;
  }
  return map;
};

let _posterCache: Record<string, string> | null = null;
const getPosters = () => {
  if (!_posterCache) _posterCache = loadPosters();
  return _posterCache;
};

const movieTitles = [
  { title: 'The Dark Horizon', genre: ['Action', 'Thriller'], year: 2024, posterKey: 'dark-horizon' },
  { title: 'Whispers in the Wind', genre: ['Drama', 'Romance'], year: 2023, posterKey: '' },
  { title: 'Neon Nights', genre: ['Sci-Fi', 'Action'], year: 2024, posterKey: 'neon-nights' },
  { title: 'The Last Garden', genre: ['Drama'], year: 2023, posterKey: '' },
  { title: 'Quantum Break', genre: ['Sci-Fi', 'Thriller'], year: 2024, posterKey: 'quantum-break' },
  { title: 'Silent Waters', genre: ['Horror', 'Mystery'], year: 2023, posterKey: '' },
  { title: 'Golden Age', genre: ['Drama', 'History'], year: 2024, posterKey: 'golden-age' },
  { title: 'Velocity', genre: ['Action', 'Sport'], year: 2024, posterKey: 'velocity' },
  { title: 'The Forgotten Kingdom', genre: ['Fantasy', 'Adventure'], year: 2023, posterKey: 'forgotten-kingdom' },
  { title: 'Midnight Express', genre: ['Thriller', 'Crime'], year: 2024, posterKey: 'midnight-express' },
  { title: 'Starlight Symphony', genre: ['Sci-Fi', 'Drama'], year: 2023, posterKey: '' },
  { title: 'Wild Hearts', genre: ['Romance', 'Comedy'], year: 2024, posterKey: '' },
  { title: 'Iron Will', genre: ['Action', 'Drama'], year: 2023, posterKey: '' },
  { title: 'The Art of Silence', genre: ['Drama', 'Mystery'], year: 2024, posterKey: '' },
  { title: 'Crimson Tide', genre: ['Action', 'Thriller'], year: 2023, posterKey: '' },
  { title: 'Electric Dreams', genre: ['Sci-Fi'], year: 2024, posterKey: 'electric-dreams' },
  { title: 'Ocean\'s Echo', genre: ['Adventure', 'Drama'], year: 2023, posterKey: '' },
  { title: 'Phantom Protocol', genre: ['Action', 'Spy'], year: 2024, posterKey: '' },
  { title: 'The Mirror', genre: ['Horror', 'Psychological'], year: 2023, posterKey: 'the-mirror' },
  { title: 'Sunrise Boulevard', genre: ['Drama', 'Romance'], year: 2024, posterKey: '' },
  { title: 'Steel Mountain', genre: ['Action', 'Adventure'], year: 2023, posterKey: '' },
  { title: 'Lost in Translation', genre: ['Comedy', 'Drama'], year: 2024, posterKey: '' },
  { title: 'The Red Door', genre: ['Thriller', 'Mystery'], year: 2023, posterKey: '' },
  { title: 'Galactic Storm', genre: ['Sci-Fi', 'Action'], year: 2024, posterKey: '' },
  { title: 'Ember Falls', genre: ['Drama', 'Fantasy'], year: 2023, posterKey: '' },
  { title: 'Code Zero', genre: ['Thriller', 'Tech'], year: 2024, posterKey: '' },
  { title: 'Northern Lights', genre: ['Drama', 'Romance'], year: 2023, posterKey: '' },
  { title: 'The Alchemist', genre: ['Fantasy', 'Adventure'], year: 2024, posterKey: '' },
  { title: 'Shadow Ops', genre: ['Action', 'Spy'], year: 2023, posterKey: 'shadow-ops' },
  { title: 'Crystal Lake', genre: ['Horror'], year: 2024, posterKey: '' },
];

const directors = ['Christopher Nolan', 'Denis Villeneuve', 'Greta Gerwig', 'Martin Scorsese', 'Ridley Scott', 'Taika Waititi', 'Jordan Peele', 'David Fincher'];
const actors = ['Tom Hardy', 'Florence Pugh', 'Oscar Isaac', 'Zendaya', 'Timothée Chalamet', 'Ana de Armas', 'John David Washington', 'Margot Robbie', 'Pedro Pascal', 'Anya Taylor-Joy'];

const posterColors = ['2C3E50', '8E44AD', '2980B9', '27AE60', 'D35400', 'C0392B', '16A085', 'F39C12', '1ABC9C', '34495E'];

export const generateMovies = (): Movie[] => {
  const posters = getPosters();
  return movieTitles.map((m, i) => {
    const realPoster = m.posterKey ? posters[m.posterKey] : undefined;
    const fallbackPoster = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.title)}&background=${posterColors[i % posterColors.length]}&color=fff&size=300&font-size=0.25&bold=true`;
    return {
      id: `movie-${i + 1}`,
      title: m.title,
      poster: realPoster || fallbackPoster,
      backdrop: realPoster || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.title)}&background=${posterColors[i % posterColors.length]}&color=fff&size=1200&font-size=0.15`,
      description: `A gripping ${m.genre[0].toLowerCase()} film that takes audiences on an unforgettable journey. ${m.title} pushes the boundaries of cinema with stunning visuals and powerful performances.`,
      genre: m.genre,
      rating: Math.round((6.5 + Math.random() * 3) * 10) / 10,
      duration: 90 + Math.floor(Math.random() * 60),
      year: m.year,
      director: directors[i % directors.length],
      cast: [actors[i % actors.length], actors[(i + 1) % actors.length], actors[(i + 2) % actors.length]],
      streamUrl: SAMPLE_VIDEO,
      trailerUrl: SAMPLE_VIDEO,
    };
  });
};

const seriesTitles = [
  { title: 'The Empire', genre: ['Drama', 'History'], year: 2023, seasons: 3 },
  { title: 'Cyber City', genre: ['Sci-Fi', 'Thriller'], year: 2024, seasons: 2 },
  { title: 'Family Matters', genre: ['Comedy', 'Drama'], year: 2023, seasons: 4 },
  { title: 'Dark Waters', genre: ['Crime', 'Mystery'], year: 2024, seasons: 2 },
  { title: 'The Healer', genre: ['Drama', 'Medical'], year: 2023, seasons: 3 },
  { title: 'Frontier', genre: ['Western', 'Action'], year: 2024, seasons: 2 },
  { title: 'Mind Games', genre: ['Psychological', 'Thriller'], year: 2023, seasons: 1 },
  { title: 'Rising Stars', genre: ['Drama', 'Music'], year: 2024, seasons: 2 },
  { title: 'The Bureau', genre: ['Spy', 'Thriller'], year: 2023, seasons: 5 },
  { title: 'Legends of Tomorrow', genre: ['Sci-Fi', 'Adventure'], year: 2024, seasons: 3 },
  { title: 'Street Kings', genre: ['Crime', 'Action'], year: 2023, seasons: 2 },
  { title: 'The Colony', genre: ['Sci-Fi', 'Drama'], year: 2024, seasons: 1 },
];

export const generateSeries = (): Series[] => {
  return seriesTitles.map((s, i) => ({
    id: `series-${i + 1}`,
    title: s.title,
    poster: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.title)}&background=${posterColors[i % posterColors.length]}&color=fff&size=300&font-size=0.25&bold=true`,
    backdrop: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.title)}&background=${posterColors[i % posterColors.length]}&color=fff&size=1200&font-size=0.15`,
    description: `An acclaimed ${s.genre[0].toLowerCase()} series that has captivated audiences worldwide. ${s.title} delivers compelling storytelling across ${s.seasons} seasons.`,
    genre: s.genre,
    rating: Math.round((7 + Math.random() * 2.5) * 10) / 10,
    year: s.year,
    seasons: Array.from({ length: s.seasons }, (_, si) => ({
      number: si + 1,
      episodes: Array.from({ length: 8 + Math.floor(Math.random() * 5) }, (_, ei) => ({
        id: `series-${i + 1}-s${si + 1}-e${ei + 1}`,
        number: ei + 1,
        title: `Episode ${ei + 1}`,
        description: `Season ${si + 1}, Episode ${ei + 1} of ${s.title}.`,
        duration: 25 + Math.floor(Math.random() * 40),
        thumbnail: `https://ui-avatars.com/api/?name=S${si + 1}E${ei + 1}&background=${posterColors[(i + ei) % posterColors.length]}&color=fff&size=320&font-size=0.3`,
        streamUrl: SAMPLE_VIDEO,
      })),
    })),
  }));
};

export const generateEPG = (channels: Channel[]): EPGItem[] => {
  const items: EPGItem[] = [];
  const now = new Date();
  const showNames = ['Morning News', 'Live Coverage', 'Documentary Special', 'Movie Night', 'Late Show', 'Sports Center', 'Kids Hour', 'Music Hits', 'Talk Show', 'Evening News'];

  for (const channel of channels) {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    for (let h = 0; h < 24; h += 2) {
      const start = new Date(startOfDay);
      start.setHours(h);
      const end = new Date(start);
      end.setHours(h + 2);

      items.push({
        channelId: channel.id,
        title: showNames[Math.floor(Math.random() * showNames.length)],
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        description: `A special program on ${channel.name}`,
        category: channel.category,
      });
    }
  }
  return items;
};

let _channels: Channel[] | null = null;
let _movies: Movie[] | null = null;
let _series: Series[] | null = null;
let _epg: EPGItem[] | null = null;

export const getChannels = (): Channel[] => {
  if (!_channels) _channels = generateChannels();
  return _channels;
};

export const getMovies = (): Movie[] => {
  if (!_movies) _movies = generateMovies();
  return _movies;
};

export const getSeries = (): Series[] => {
  if (!_series) _series = generateSeries();
  return _series;
};

export const getEPG = (): EPGItem[] => {
  if (!_epg) _epg = generateEPG(getChannels());
  return _epg;
};
