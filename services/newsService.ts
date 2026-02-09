import { NewsItem, LiveUpdateItem } from '../types';
import { supabase } from './supabaseClient';

interface RawArticle {
  title: string;
  url: string;
  created: string;
  description: string;
  source: string;
  imageUrl?: string;
}

interface DbArticle {
  id: string;
  title: string;
  original_title: string;
  summary: string;
  source: string;
  url: string;
  image_url: string | null;
  published_at: string;
  category: string;
  created_at: string;
}

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function getRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}g`;
  } catch {
    return 'ora';
  }
}

function dbToNewsItem(row: DbArticle, idx: number): NewsItem {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary || '',
    source: row.source,
    url: row.url,
    imagelink: row.image_url || undefined,
    date: row.published_at,
    category: row.category || 'AI',
    isBreaking: idx === 0,
  };
}

export interface FeedData {
  featured: NewsItem[];
  latestDrops: NewsItem[];
  liveFeed: LiveUpdateItem[];
  totalArticles: number;
}

function buildFeedData(allNews: NewsItem[]): FeedData {
  const featured = allNews.slice(0, 2);
  const latestDrops = allNews.slice(2, 6);

  const severities: Array<'critical' | 'major' | 'normal'> = ['critical', 'major', 'major', 'normal', 'normal'];
  const colors = ['#EF4444', '#F59E0B', '#22C55E', '#22C55E', '#22C55E'];
  const liveFeed: LiveUpdateItem[] = allNews.slice(0, 5).map((item, i) => ({
    id: `live-${i}`,
    text: item.title,
    timestamp: getRelativeTime(item.date as string),
    type: severities[i] || 'normal',
    color: colors[i] || '#22C55E',
    source: item.source,
  }));

  return { featured, latestDrops, liveFeed, totalArticles: allNews.length };
}

// --- LOAD from Supabase (page load) ---
export const loadFromDb = async (): Promise<FeedData | null> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) return null;

  const allNews = (data as DbArticle[]).map(dbToNewsItem);
  return buildFeedData(allNews);
};

// --- REFRESH: fetch RSS, process, save to DB, return ---
export const fetchNews = async (): Promise<FeedData> => {
  // 1. Fetch articles from RSS feeds
  const res = await fetch('/api/news');
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const raw = await res.json();
  const articles: RawArticle[] = Array.isArray(raw) ? raw : [];
  if (articles.length === 0) throw new Error('No articles returned');

  // 2. Sort by date, filter invalid dates
  const validArticles = articles.filter(a => !isNaN(new Date(a.created).getTime()));
  validArticles.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  // 3. Filter: only articles from the last 24 hours
  const maxAge = 24 * 60 * 60 * 1000;
  let recent = validArticles.filter(a => {
    const age = Date.now() - new Date(a.created).getTime();
    return age < maxAge;
  });

  // Fallback: if no articles in 24h, take the 10 most recent
  if (recent.length === 0) {
    recent = validArticles.slice(0, 10);
  }

  // 4. Process: translate to Italian + uppercase + extract og:image
  const processRes = await fetch('/api/process-articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articles: recent }),
  });
  if (!processRes.ok) throw new Error('Processing failed');
  const processed: RawArticle[] = await processRes.json();

  // 5. Save to Supabase (upsert by URL to avoid duplicates)
  const rows = processed.map(a => ({
    title: a.title,
    original_title: articles.find(orig => orig.url === a.url)?.title || a.title,
    summary: stripHtml(a.description).slice(0, 500),
    source: a.source,
    url: a.url,
    image_url: a.imageUrl || null,
    published_at: new Date(a.created).toISOString(),
    category: 'AI',
  }));

  await supabase
    .from('articles')
    .upsert(rows, { onConflict: 'url' });

  // 6. Build feed from processed data
  const allNews: NewsItem[] = processed.map((a, i) => ({
    id: `fresh-${i}`,
    title: a.title,
    summary: stripHtml(a.description).slice(0, 200),
    source: a.source,
    url: a.url,
    imagelink: a.imageUrl || undefined,
    date: a.created,
    category: 'AI',
    isBreaking: i === 0,
  }));

  return buildFeedData(allNews);
};
