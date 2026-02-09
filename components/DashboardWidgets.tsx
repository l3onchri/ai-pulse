import React, { useEffect, useState } from 'react';
import { ArrowUpRight, RefreshCw, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { NewsItem, LiveUpdateItem, SidebarPanel } from '../types';
import { isArticleSaved, toggleSavedArticle } from '../services/localStorageService';

// --- HELPER: COUNT UP ANIMATION ---
const CountUp: React.FC<{ end: string | number, duration?: number, suffix?: string }> = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const numericEnd = parseInt(end.toString().replace(/\D/g, ''));
  const isNumber = !isNaN(numericEnd);

  useEffect(() => {
    if (!isNumber) return;
    let startTime: number;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(easeOutQuart * numericEnd));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericEnd, duration, isNumber]);

  if (!isNumber) return <span>{end}</span>;
  return <span>{count}{suffix}</span>;
};

// --- STATS ROW COMPONENT ---
export const StatsRow: React.FC<{ stats: any[] }> = ({ stats }) => (
  <div className="flex flex-wrap items-center gap-8 md:gap-16 py-6 px-4">
    {stats.map((stat, idx) => (
      <div key={idx} className="flex flex-col group cursor-default">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-pulse-dark transition-colors duration-300">
          {stat.label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-medium tracking-tight ${stat.isGreen ? 'text-pulse-green glow-text' : 'text-pulse-dark'}`}>
             {stat.isGreen ? (
                <span className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-pulse-green animate-pulse-green-slow"></span>
                   {stat.value}
                </span>
             ) : (
                <CountUp end={stat.value} suffix={stat.label === "READ TIME" ? "m" : ""} />
             )}
          </span>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded transition-transform duration-300 group-hover:scale-110">
            {stat.sub}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// --- AGENT CARD (LEFT COL) ---
export const AgentCard: React.FC<{ onRefresh?: () => void; isLoading?: boolean }> = ({ onRefresh, isLoading }) => (
  <div className="premium-card bg-white rounded-[32px] p-8 shadow-glow-gold flex flex-col items-center text-center border border-white/60 flex-1 relative overflow-hidden w-full h-full justify-between">

    {/* Decorative Glow Background */}
    <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-pulse-yellow/5 rounded-full blur-3xl"></div>

    {/* TOP SECTION: Avatar & Identity */}
    <div className="flex flex-col items-center justify-center w-full flex-1 gap-6">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-4 rounded-full border-[3px] border-pulse-yellow border-t-transparent animate-spin-profile opacity-100"></div>

          <div className="w-28 h-28 rounded-full p-1.5 bg-white shadow-sm relative z-10 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=300"
              alt="AI Agent"
              className="w-full h-full rounded-full object-cover scale-110"
            />
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-pulse-green rounded-full border-[4px] border-white z-20 animate-pulse-green-slow shadow-md"></div>
        </div>

        <div className="space-y-2">
            <h3 className="text-3xl font-display font-bold text-pulse-dark">AI Agent</h3>
            <div className="inline-block">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                    Auto-Curator Active
                </p>
            </div>
        </div>
    </div>

    {/* MIDDLE SECTION: Action Button */}
    <div className="w-full py-6">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="w-full py-5 bg-pulse-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-black transition-all duration-300 hover:scale-105 hover:shadow-glow-button shadow-xl shadow-gray-200/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : 'animate-spin-slow'} />
          {isLoading ? 'LOADING...' : 'REFRESH FEED'}
        </button>
    </div>

    {/* BOTTOM SECTION: Stats */}
    <div className="flex items-center justify-between w-full gap-4">
       <div className="flex flex-col items-center bg-gray-50/80 backdrop-blur-sm p-4 rounded-2xl flex-1 border border-transparent hover:border-pulse-yellow/30 transition-colors group">
          <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 group-hover:text-pulse-dark transition-colors">Latency</span>
          <span className="text-lg font-bold text-pulse-dark font-display">24ms</span>
       </div>
       <div className="flex flex-col items-center bg-green-50/80 backdrop-blur-sm p-4 rounded-2xl flex-1 border border-transparent hover:border-green-200 transition-colors group">
          <span className="text-[10px] font-bold text-green-600 uppercase mb-1">API</span>
          <span className="text-lg font-bold text-green-700 font-display">Stable</span>
       </div>
    </div>
  </div>
);

// --- MENU LINKS (LEFT COL) ---
interface MenuLinksProps {
  activePanel?: SidebarPanel;
  onMenuClick?: (panel: SidebarPanel) => void;
}

export const MenuLinks: React.FC<MenuLinksProps> = ({ activePanel, onMenuClick }) => {
  const items: { label: string; panel: SidebarPanel }[] = [
    { label: 'Preferences', panel: 'preferences' },
    { label: 'History', panel: 'history' },
    { label: 'Saved', panel: 'saved' },
  ];

  return (
    <div className="premium-card bg-white rounded-[24px] p-3 shadow-soft border border-white/60 flex flex-col justify-center flex-none">
      {items.map((item, idx) => (
        <div
          key={idx}
          onClick={() => onMenuClick?.(activePanel === item.panel ? null : item.panel)}
          className={`flex items-center justify-between p-4 rounded-xl cursor-pointer group transition-all duration-300 mb-1 last:mb-0 ${
            activePanel === item.panel ? 'bg-pulse-yellow/10' : 'hover:bg-pulse-yellow/10'
          }`}
        >
          <span className={`text-sm font-bold group-hover:translate-x-1 transition-transform ${
            activePanel === item.panel ? 'text-pulse-dark' : 'text-gray-500 group-hover:text-pulse-dark'
          }`}>{item.label}</span>
          <ChevronRight size={16} className={`group-hover:translate-x-1 transition-transform ${
            activePanel === item.panel ? 'text-pulse-dark' : 'text-gray-300 group-hover:text-pulse-dark'
          }`} />
        </div>
      ))}
    </div>
  );
};

// --- FEATURED CARD (CENTER TOP) ---
interface FeaturedCardProps {
  item: NewsItem;
  onArticleClick?: (item: NewsItem) => void;
  onSaveToggle?: () => void;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ item, onArticleClick, onSaveToggle }) => {
  const saved = isArticleSaved(item.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavedArticle(item.id);
    onSaveToggle?.();
  };

  return (
    <div
      onClick={() => onArticleClick?.(item)}
      className="premium-card bg-white rounded-[32px] p-8 shadow-glow-gold h-[320px] flex flex-col justify-between relative overflow-hidden group border border-white/60 cursor-pointer"
    >
      {/* Yellow/Cream Gradient Background Top */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-pulse-yellow/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/40">
          <span className="w-2 h-2 rounded-full bg-pulse-yellow shadow-[0_0_10px_rgba(232,200,74,0.8)]"></span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">FEATURED</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              saved ? 'bg-pulse-yellow/20 text-pulse-yellow' : 'bg-white/60 text-gray-400 hover:text-pulse-yellow'
            }`}
          >
            {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
          <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center cursor-pointer hover:scale-110 hover:rotate-6 transition-all duration-300 text-pulse-yellow hover:text-pulse-dark">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto transform transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-2xl font-display font-bold text-pulse-dark leading-tight mb-4 group-hover:text-pulse-dark/80 transition-colors line-clamp-2">
          {item.title}
        </h3>
        <div className="flex items-center justify-between pt-5 border-t border-gray-100/50">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{item.source}</span>
          <span className="text-xs font-bold text-gray-500 bg-white shadow-sm border border-gray-100 px-2 py-1 rounded-md">{item.category || 'AI'}</span>
        </div>
      </div>
    </div>
  );
};

// --- LATEST DROPS (CENTER BOTTOM) ---
interface LatestDropsCardProps {
  items: NewsItem[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onArticleClick?: (item: NewsItem) => void;
  onViewArchive?: () => void;
  onSaveToggle?: () => void;
}

export const LatestDropsCard: React.FC<LatestDropsCardProps> = ({
  items,
  activeTab = 'All',
  onTabChange,
  onArticleClick,
  onViewArchive,
  onSaveToggle,
}) => {
  const tabs = ['All', 'Tech', 'Biz'];

  const filtered = activeTab === 'All'
    ? items
    : items.filter(item => {
        const cat = (item.category || '').toLowerCase();
        if (activeTab === 'Tech') return cat === 'tech' || cat === 'ai' || cat === 'llm' || cat === 'robotics';
        if (activeTab === 'Biz') return cat === 'biz' || cat === 'business';
        return true;
      });

  return (
    <div className="premium-card bg-white rounded-[32px] p-8 shadow-soft border border-white/60 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-pulse-dark font-display">Latest Drops</h3>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange?.(tab)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-white shadow-sm text-pulse-dark scale-105'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Nessun articolo in questa categoria.</p>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onArticleClick?.(item)}
            className="flex items-center gap-5 group cursor-pointer hover:bg-pulse-bg p-3 rounded-2xl transition-all duration-300 -mx-3 hover:translate-x-1 hover:shadow-soft border border-transparent hover:border-white"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-200 overflow-hidden shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 relative flex items-center justify-center">
               {item.imagelink ? (
                 <img src={item.imagelink} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
               ) : (
                 <span className="text-lg font-bold text-gray-400">{item.source?.charAt(0) || 'A'}</span>
               )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.source}</span>
                 <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-pulse-yellow transition-colors"></span>
                 <span className="text-[10px] font-medium text-gray-400">{typeof item.date === 'string' && item.date.length > 5 ? new Date(item.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : item.date}</span>
              </div>
              <h4 className="text-base font-bold text-pulse-dark truncate group-hover:text-pulse-dark/70 transition-colors font-display">{item.title}</h4>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleSavedArticle(item.id); onSaveToggle?.(); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                isArticleSaved(item.id) ? 'text-pulse-yellow' : 'text-gray-300 hover:text-pulse-yellow'
              }`}
            >
              {isArticleSaved(item.id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center border-t border-gray-100 pt-6">
        <button
          onClick={onViewArchive}
          className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-pulse-dark transition-all hover:tracking-[0.2em]"
        >
          View Archive
        </button>
      </div>
    </div>
  );
};

// --- LIVE FEED CARD (RIGHT COL - DARK) ---
export const LiveFeedCard: React.FC<{ items: LiveUpdateItem[] }> = ({ items }) => (
  <div className="premium-card bg-pulse-darkCard rounded-[32px] p-8 shadow-medium h-full flex flex-col relative overflow-hidden text-white border border-white/5">
    {/* Glow effect */}
    <div className="absolute top-0 right-0 w-48 h-48 bg-pulse-yellow/10 blur-[80px] rounded-full pointer-events-none"></div>

    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className="flex flex-col">
        <h3 className="text-3xl font-medium text-white leading-none mb-1 font-display">Live</h3>
        <h3 className="text-3xl font-bold text-pulse-yellow leading-none glow-text font-display">Feed</h3>
      </div>
      <div className="relative">
         <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse-red shadow-[0_0_25px_rgba(255,0,0,0.6)]"></div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-7 relative z-10">
      {items.map((item) => (
        <div key={item.id} className="group cursor-pointer relative pl-4 transition-all duration-300 hover:translate-x-1">
          {/* Hover Indicator Line */}
          <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-pulse-yellow opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>

          <p className="text-sm font-medium text-gray-300 mb-2 leading-relaxed group-hover:text-white transition-colors">
            {item.text}
          </p>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider transition-colors"
                  style={{ color: item.color || '#9ca3af' }}
                >
                   {item.source || 'Source'}
                </span>
                <span className="text-[10px] font-medium text-gray-600">{item.timestamp}</span>
             </div>
             {/* Colored Dot matching the source color */}
             <div
               className="w-1.5 h-1.5 rounded-full transition-all duration-500 shadow-sm"
               style={{ backgroundColor: item.color || '#374151' }}
             ></div>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-auto pt-8 border-t border-white/10 relative z-10">
       <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Activity</span>
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
       </div>
       <div className="flex items-end gap-1 h-8 mt-2">
          {[40, 70, 30, 80, 50, 90, 60, 40, 65, 85, 45, 75, 55, 85, 40].map((h, i) => (
             <div
               key={i}
               className="flex-1 bg-gray-800 rounded-t-sm hover:bg-pulse-yellow transition-all duration-300 hover:shadow-[0_0_10px_rgba(232,200,74,0.5)]"
               style={{ height: `${h}%`, transitionDelay: `${i * 30}ms` }}
             ></div>
          ))}
       </div>
    </div>
  </div>
);
