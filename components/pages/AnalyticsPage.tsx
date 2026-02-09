import React from 'react';
import { NewsItem } from '../../types';
import { BarChart3, TrendingUp, Clock, Layers } from 'lucide-react';

interface Props {
  articles: NewsItem[];
}

const AnalyticsPage: React.FC<Props> = ({ articles }) => {
  // Aggregate by source
  const sourceCounts: Record<string, number> = {};
  articles.forEach(a => {
    const src = a.source || 'Unknown';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });
  const sourceEntries = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...sourceEntries.map(e => e[1]), 1);

  // Aggregate by category
  const catCounts: Record<string, number> = {};
  articles.forEach(a => {
    const cat = a.category || 'AI';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });
  const catEntries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...catEntries.map(e => e[1]), 1);

  // Recent vs older
  const now = Date.now();
  const last6h = articles.filter(a => {
    const d = new Date(a.date as string).getTime();
    return !isNaN(d) && now - d < 6 * 3600000;
  }).length;
  const last24h = articles.filter(a => {
    const d = new Date(a.date as string).getTime();
    return !isNaN(d) && now - d < 24 * 3600000;
  }).length;

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="mb-8 px-4">
        <div className="inline-block px-3 py-1 bg-white/60 rounded-lg mb-5 backdrop-blur-sm border border-pulse-yellow/20 shadow-sm">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Analytics</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-medium text-pulse-dark leading-[0.95] tracking-tight">
          Panoramica
          <br />
          <span className="relative inline-block mt-1">
            Dati
            <div className="absolute w-[105%] h-3 bottom-1.5 -left-1 bg-pulse-yellow -z-10 transform -rotate-1 rounded-sm opacity-90"></div>
          </span>
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-4">
        {[
          { icon: Layers, label: 'TOTALE ARTICOLI', value: articles.length, color: 'text-pulse-dark' },
          { icon: TrendingUp, label: 'ULTIME 6 ORE', value: last6h, color: 'text-pulse-green' },
          { icon: Clock, label: 'ULTIME 24 ORE', value: last24h, color: 'text-pulse-yellow' },
          { icon: BarChart3, label: 'FONTI ATTIVE', value: sourceEntries.length, color: 'text-pulse-dark' },
        ].map((card, i) => (
          <div key={i} className="premium-card bg-white rounded-[24px] p-6 shadow-soft border border-white/60 flex flex-col gap-3">
            <card.icon size={20} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.label}</span>
            <span className={`text-3xl font-display font-bold ${card.color}`}>{card.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
        {/* Sources breakdown */}
        <div className="premium-card bg-white rounded-[32px] p-8 shadow-glow-gold border border-white/60">
          <h3 className="text-xl font-bold text-pulse-dark font-display mb-6">Articoli per Fonte</h3>
          <div className="space-y-4">
            {sourceEntries.map(([name, count]) => (
              <div key={name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-gray-600">{name}</span>
                  <span className="text-sm font-bold text-pulse-dark">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pulse-yellow to-pulse-yellowHover rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="premium-card bg-white rounded-[32px] p-8 shadow-glow-gold border border-white/60">
          <h3 className="text-xl font-bold text-pulse-dark font-display mb-6">Articoli per Categoria</h3>
          <div className="space-y-4">
            {catEntries.map(([name, count]) => (
              <div key={name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-gray-600">{name}</span>
                  <span className="text-sm font-bold text-pulse-dark">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pulse-green to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {catEntries.length === 0 && (
              <p className="text-sm text-gray-400">Nessun dato disponibile. Premi REFRESH FEED nella dashboard.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
