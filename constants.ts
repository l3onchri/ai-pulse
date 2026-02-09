import { NewsItem, LiveUpdateItem } from './types';

export const COPY = {
  APP_NAME: "AI Pulse",
  HERO: {
    LABEL: "DAILY INTELLIGENCE BRIEFING",
    HEADLINE_1: "Il tuo Daily",
    HEADLINE_2: "Insight",
  },
  STATES: {
    INITIAL: {
      TITLE: "Benvenuto su AI Pulse",
      SUBTITLE: "Il tuo hub per le news sull'Intelligenza Artificiale è pronto."
    },
    EMPTY: {
      TITLE: "Nessuna notizia trovata",
      SUBTITLE: "Sembra che non ci siano aggiornamenti al momento. Riprova più tardi."
    },
    ERROR: {
      TITLE: "Qualcosa è andato storto",
      SUBTITLE: "Non siamo riusciti a caricare le notizie. Controlla la tua connessione."
    }
  },
  FOOTER: "Powered by n8n + AI • Fatto con ⚡ da Christian",
};

export const STATS_DATA = [
  { label: "SOURCES SCANNED", value: "142", sub: "+12%" },
  { label: "ARTICLES FOUND", value: "6", sub: "Today" },
  { label: "READ TIME", value: "12", sub: "Avg" }, // changed to number for animation
  { label: "SYSTEM STATUS", value: "Online", sub: "99.9%", isGreen: true },
];

export const FEATURED_NEWS: NewsItem[] = [
  {
    id: 'f1',
    title: "OpenAI: GPT-5 'Orion' supera ogni benchmark",
    summary: "Il nuovo modello promette capacità di ragionamento mai viste prima.",
    source: "TechCrunch",
    url: "#",
    date: new Date().toISOString(),
    category: "LLM",
    isBreaking: true
  },
  {
    id: 'f2',
    title: "Google DeepMind: Robot che imparano guardando YouTube",
    summary: "Nuova tecnica di training video-to-action per robotica avanzata.",
    source: "The Verge",
    url: "#",
    date: new Date(Date.now() - 42 * 60000).toISOString(),
    category: "Robotics"
  }
];

export const LATEST_DROPS: NewsItem[] = [
  {
    id: 'd1',
    title: "NVIDIA svela il chip H200 per l'inferenza AI",
    source: "REUTERS",
    date: "2h",
    url: "#",
    imagelink: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=200",
    category: "Tech",
    summary: ""
  },
  {
    id: 'd2',
    title: "Meta rilascia Llama 4 Open Source",
    source: "WIRED",
    date: "3h",
    url: "#",
    imagelink: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=200",
    category: "Tech",
    summary: ""
  },
  {
    id: 'd3',
    title: "AI Act: L'UE finalizza la regolamentazione",
    source: "POLITICO",
    date: "5h",
    url: "#",
    imagelink: "https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&q=80&w=200",
    category: "Biz",
    summary: ""
  },
  {
    id: 'd4',
    title: "Midjourney v7 introduce il video generation",
    source: "ARS TECHNICA",
    date: "6h",
    url: "#",
    imagelink: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
    category: "Tech",
    summary: ""
  }
];

export const LIVE_FEED: LiveUpdateItem[] = [
  { id: 'l1', text: "OpenAI: GPT-5 'Orion' supera ogni benchmark", timestamp: "15m", type: 'critical', color: "#EF4444", source: "TechCrunch" },
  { id: 'l2', text: "Google DeepMind: Robot che imparano guardando YouTube", timestamp: "42m", type: 'major', color: "#F59E0B", source: "The Verge" },
  { id: 'l3', text: "NVIDIA svela il chip H200 per l'inferenza AI", timestamp: "2h", type: 'major', color: "#22C55E", source: "Reuters" },
  { id: 'l4', text: "Meta rilascia Llama 4 Open Source", timestamp: "3h", type: 'major', color: "#22C55E", source: "Wired" },
  { id: 'l5', text: "AI Act: L'UE finalizza la regolamentazione", timestamp: "5h", type: 'normal', color: "#22C55E", source: "Politico" },
];

// Fallback for types not used but imported elsewhere
export const MOCK_NEWS_DATA = [...FEATURED_NEWS, ...LATEST_DROPS];
export const MOCK_STATS = [];
export const MOCK_TOPICS = [];
export const MOCK_CATEGORIES = [];
export const MOCK_LIVE_FEED = LIVE_FEED;