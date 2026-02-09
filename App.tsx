import React, { useState, useCallback, useEffect } from 'react';
import { Search, Bell, ArrowLeft } from 'lucide-react';
import { COPY, STATS_DATA, FEATURED_NEWS, LATEST_DROPS, LIVE_FEED } from './constants';
import { NewsItem, LiveUpdateItem, PageId, SidebarPanel } from './types';
import { StatsRow, AgentCard, MenuLinks, FeaturedCard, LatestDropsCard, LiveFeedCard } from './components/DashboardWidgets';
import { fetchNews, loadFromDb } from './services/newsService';
import { addToReadHistory } from './services/localStorageService';

// Pages
import AnalyticsPage from './components/pages/AnalyticsPage';
import SourcesPage from './components/pages/SourcesPage';
import SettingsPage from './components/pages/SettingsPage';

// Overlays & Panels
import SearchOverlay from './components/SearchOverlay';
import NotificationsPanel from './components/NotificationsPanel';
import ProfileDropdown from './components/ProfileDropdown';
import ArticleDetail from './components/ArticleDetail';
import SavedPanel from './components/panels/SavedPanel';
import HistoryPanel from './components/panels/HistoryPanel';

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'sources', label: 'Sources' },
  { id: 'settings', label: 'Settings' },
];

const App: React.FC = () => {
  // Data state
  const [featured, setFeatured] = useState<NewsItem[]>(FEATURED_NEWS);
  const [latestDrops, setLatestDrops] = useState<NewsItem[]>(LATEST_DROPS);
  const [liveFeed, setLiveFeed] = useState<LiveUpdateItem[]>(LIVE_FEED);
  const [isLoading, setIsLoading] = useState(false);
  const [articleCount, setArticleCount] = useState(STATS_DATA[1].value);

  // UI state
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [sidebarPanel, setSidebarPanel] = useState<SidebarPanel>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [showArchive, setShowArchive] = useState(false);
  const [, forceUpdate] = useState(0); // for save toggle re-renders

  const allArticles = [...featured, ...latestDrops];

  // Load saved articles from Supabase on page load
  useEffect(() => {
    loadFromDb().then(data => {
      if (data) {
        setFeatured(data.featured);
        setLatestDrops(data.latestDrops);
        setLiveFeed(data.liveFeed);
        setArticleCount(String(data.totalArticles));
      }
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchNews();
      setFeatured(data.featured);
      setLatestDrops(data.latestDrops);
      setLiveFeed(data.liveFeed);
      setArticleCount(String(data.totalArticles));
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNavigate = useCallback((page: PageId) => {
    setCurrentPage(page);
    setSidebarPanel(null);
    setShowArchive(false);
  }, []);

  const handleArticleClick = useCallback((article: NewsItem) => {
    addToReadHistory(article.id);
    setSelectedArticle(article);
  }, []);

  const triggerUpdate = useCallback(() => {
    forceUpdate(n => n + 1);
  }, []);

  const stats = STATS_DATA.map((s, i) =>
    i === 1 ? { ...s, value: articleCount } : s
  );

  // --- RENDER PAGE CONTENT ---
  const renderPageContent = () => {
    if (currentPage === 'analytics') return <AnalyticsPage articles={allArticles} />;
    if (currentPage === 'sources') return <SourcesPage />;
    if (currentPage === 'settings') return <SettingsPage />;

    // Dashboard
    return (
      <>
        {/* HERO SECTION */}
        <div className="mb-12 animate-slide-up px-4" style={{ animationDelay: '0.1s' }}>
          <div className="inline-block px-3 py-1 bg-white/60 rounded-lg mb-5 cursor-default backdrop-blur-sm border border-pulse-yellow/20 shadow-sm">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{COPY.HERO.LABEL}</span>
          </div>
          <h1 className="text-6xl md:text-[5.5rem] font-display font-medium text-pulse-dark leading-[0.95] tracking-tight">
            Il tuo Daily
            <br />
            <span className="relative inline-block mt-1">
              Insight
              <div className="absolute w-[105%] h-3 bottom-1.5 -left-1 bg-pulse-yellow -z-10 transform -rotate-1 rounded-sm opacity-90"></div>
            </span>
          </h1>
        </div>

        {/* STATS ROW */}
        <div className="mb-10 border-b border-gray-200/60 pb-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <StatsRow stats={stats} />
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">

          {/* COL 1: SIDEBAR */}
          <div className="lg:col-span-1 flex flex-col gap-6 animate-slide-up h-full" style={{ animationDelay: '0.3s' }}>
            <AgentCard onRefresh={handleRefresh} isLoading={isLoading} />
            <MenuLinks activePanel={sidebarPanel} onMenuClick={setSidebarPanel} />
          </div>

          {/* COL 2 & 3: CENTER CONTENT */}
          <div className="lg:col-span-2 flex flex-col gap-6 animate-slide-up h-full" style={{ animationDelay: '0.5s' }}>
            {/* Sidebar Panel (when active, replaces main content) */}
            {sidebarPanel ? (
              <div className="premium-card bg-white rounded-[32px] p-8 shadow-soft border border-white/60 h-full animate-slide-up">
                {sidebarPanel === 'saved' && (
                  <SavedPanel articles={allArticles} onUpdate={triggerUpdate} onArticleClick={handleArticleClick} />
                )}
                {sidebarPanel === 'history' && (
                  <HistoryPanel articles={allArticles} onArticleClick={handleArticleClick} />
                )}
                {sidebarPanel === 'preferences' && (
                  <div>
                    <h3 className="text-xl font-bold text-pulse-dark font-display mb-4">Preferenze</h3>
                    <p className="text-sm text-gray-400 mb-4">Vai alla pagina Settings per configurare le preferenze.</p>
                    <button
                      onClick={() => { handleNavigate('settings'); setSidebarPanel(null); }}
                      className="px-6 py-2.5 bg-pulse-dark text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                    >
                      Apri Settings
                    </button>
                  </div>
                )}
              </div>
            ) : showArchive ? (
              /* Archive View */
              <div className="premium-card bg-white rounded-[32px] p-8 shadow-soft border border-white/60 h-full animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setShowArchive(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <ArrowLeft size={14} className="text-pulse-dark" />
                  </button>
                  <h3 className="text-xl font-bold text-pulse-dark font-display">Archivio Completo</h3>
                </div>
                <div className="space-y-3">
                  {allArticles.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleArticleClick(item)}
                      className="flex items-center gap-4 p-3 hover:bg-pulse-bg rounded-2xl cursor-pointer transition-all duration-300 -mx-3 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                        {item.imagelink ? (
                          <img src={item.imagelink} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-400">{item.source?.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-pulse-dark truncate">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{item.source}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-[10px] text-gray-400">
                            {typeof item.date === 'string' && item.date.length > 5
                              ? new Date(item.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
                              : item.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {allArticles.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">Nessun articolo. Premi REFRESH FEED.</p>
                  )}
                </div>
              </div>
            ) : (
              /* Default Dashboard Center */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><FeaturedCard item={featured[0]} onArticleClick={handleArticleClick} onSaveToggle={triggerUpdate} /></div>
                  <div><FeaturedCard item={featured[1]} onArticleClick={handleArticleClick} onSaveToggle={triggerUpdate} /></div>
                </div>
                <div className="flex-1">
                  <LatestDropsCard
                    items={latestDrops}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onArticleClick={handleArticleClick}
                    onViewArchive={() => setShowArchive(true)}
                    onSaveToggle={triggerUpdate}
                  />
                </div>
              </>
            )}
          </div>

          {/* COL 4: RIGHT SIDEBAR */}
          <div className="lg:col-span-1 h-full min-h-[600px] lg:min-h-0 animate-slide-left" style={{ animationDelay: '0.7s' }}>
            <LiveFeedCard items={liveFeed} />
          </div>

        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-10 font-sans text-pulse-dark">

      {/* --- UNIFIED NAVBAR (Floating) --- */}
      <div className="sticky top-6 z-50 animate-slide-down max-w-[1200px] mx-auto mb-12">
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-full p-2 shadow-nav flex items-center justify-between pl-6 pr-2">

          {/* Logo Section */}
          <div className="flex items-center gap-3 pr-6 border-r border-gray-100 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
            <div className="w-2.5 h-2.5 rounded-full bg-pulse-dark animate-pulse"></div>
            <span className="text-lg font-display font-bold tracking-tight text-pulse-dark">{COPY.APP_NAME}</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 mx-4">
            {NAV_ITEMS.map(nav => (
              <button
                key={nav.id}
                onClick={() => handleNavigate(nav.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  currentPage === nav.id
                    ? 'bg-pulse-dark text-white shadow-lg transform scale-105'
                    : 'text-gray-500 hover:text-pulse-dark hover:bg-gray-100/50'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors group"
            >
              <Search size={18} className="text-pulse-dark group-hover:scale-110 transition-transform" />
            </button>

            <div className="relative">
              <div
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <Bell size={18} className="text-pulse-dark group-hover:rotate-12 transition-transform" />
                {liveFeed.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse-red"></span>
                )}
              </div>
              {showNotifications && (
                <NotificationsPanel items={liveFeed} onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Profile with Spinning Segment */}
            <div className="relative">
              <div
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="relative w-11 h-11 ml-2 cursor-pointer group"
              >
                <div className="absolute inset-0 rounded-full border-[2px] border-pulse-yellow border-t-transparent animate-spin-profile"></div>
                <div className="absolute inset-0.5 rounded-full overflow-hidden bg-gray-200">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              {showProfile && (
                <ProfileDropdown onClose={() => setShowProfile(false)} onNavigate={handleNavigate} />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <main className="max-w-[1600px] mx-auto">
        {renderPageContent()}
      </main>

      {/* --- OVERLAYS --- */}
      {showSearch && (
        <SearchOverlay articles={allArticles} onClose={() => setShowSearch(false)} />
      )}

      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onSaveToggle={triggerUpdate}
        />
      )}
    </div>
  );
};

export default App;
