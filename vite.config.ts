import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';

// --- RSS FEEDS ---
const RSS_FEEDS = [
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch' },
  { url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', name: 'MIT Tech Review' },
  { url: 'https://venturebeat.com/category/ai/feed/', name: 'VentureBeat' },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', name: 'The Verge' },
  { url: 'https://www.wired.com/feed/tag/ai/latest/rss', name: 'Wired' },
  { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', name: 'Ars Technica' },
  { url: 'https://www.artificialintelligence-news.com/feed/', name: 'AI News' },
  { url: 'https://the-decoder.com/feed/', name: 'The Decoder' },
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=19854910', name: 'CNBC' },
];

interface RssArticle {
  title: string;
  url: string;
  created: string;
  description: string;
  source: string;
}

function parseRssItems(xml: string, sourceName: string): RssArticle[] {
  const items: RssArticle[] = [];
  // Handle both <item> (RSS) and <entry> (Atom)
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>|<entry[\s>]([\s\S]*?)<\/entry>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1] || match[2] || '';
    const title = block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s)?.[1]?.trim() || '';
    const link = block.match(/<link[^>]*href="([^"]+)"/)?.[1]
              || block.match(/<link[^>]*>([^<]+)<\/link>/)?.[1]?.trim() || '';
    const pubDate = block.match(/<pubDate[^>]*>(.*?)<\/pubDate>/)?.[1]?.trim()
                 || block.match(/<published[^>]*>(.*?)<\/published>/)?.[1]?.trim()
                 || block.match(/<updated[^>]*>(.*?)<\/updated>/)?.[1]?.trim() || '';
    const desc = block.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.trim()
              || block.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/)?.[1]?.trim() || '';

    if (title && link) {
      items.push({ title, url: link, created: pubDate, description: desc, source: sourceName });
    }
  }
  return items;
}

async function fetchAllFeeds(): Promise<RssArticle[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(feed.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AIPulseBot/1.0)' },
        });
        clearTimeout(timeout);
        const xml = await res.text();
        return parseRssItems(xml, feed.name);
      } catch {
        clearTimeout(timeout);
        return [];
      }
    })
  );

  const all: RssArticle[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value);
  }

  // Sort by date (newest first)
  all.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  return all;
}

async function extractOgImage(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AIPulseBot/1.0)' },
    });
    clearTimeout(timeout);
    const html = await res.text();
    const match =
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    return match?.[1] || '';
  } catch {
    return '';
  }
}

async function translateText(text: string): Promise<string> {
  try {
    const encoded = encodeURIComponent(text);
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|it`
    );
    const data = await res.json() as any;
    return data.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

function newsApiPlugin(): Plugin {
  return {
    name: 'news-api',
    configureServer(server) {
      // GET /api/news - fetch all RSS feeds directly
      server.middlewares.use('/api/news', async (req: IncomingMessage, res: ServerResponse, next) => {
        if (req.method !== 'GET') return next();
        try {
          const articles = await fetchAllFeeds();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(articles));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // POST /api/process-articles - translate + extract images
      server.middlewares.use('/api/process-articles', async (req: IncomingMessage, res: ServerResponse, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        for await (const chunk of req) body += chunk;
        try {
          const { articles } = JSON.parse(body);
          const processed = await Promise.all(
            articles.map(async (article: any) => {
              const [imageUrl, translatedTitle] = await Promise.all([
                extractOgImage(article.url),
                translateText(article.title),
              ]);
              return { ...article, imageUrl, title: translatedTitle.toUpperCase() };
            })
          );
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(processed));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [newsApiPlugin(), react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
