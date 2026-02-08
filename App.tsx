import React from 'react';
import { Search, Bell } from 'lucide-react';
import { COPY, STATS_DATA, FEATURED_NEWS, LATEST_DROPS, LIVE_FEED } from './constants';
import { StatsRow, AgentCard, MenuLinks, FeaturedCard, LatestDropsCard, LiveFeedCard } from './components/DashboardWidgets';

const App: React.FC = () => {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-10 font-sans text-pulse-dark">
      
      {/* --- UNIFIED NAVBAR (Floating) --- */}
      <div className="sticky top-6 z-50 animate-slide-down max-w-[1200px] mx-auto mb-12">
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-full p-2 shadow-nav flex items-center justify-between pl-6 pr-2">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
             <div className="w-2.5 h-2.5 rounded-full bg-pulse-dark animate-pulse"></div>
             <span className="text-lg font-display font-bold tracking-tight text-pulse-dark">{COPY.APP_NAME}</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 mx-4">
             <button className="px-5 py-2 bg-pulse-dark text-white rounded-full text-xs font-bold shadow-lg transform transition-transform hover:scale-105">Dashboard</button>
             <button className="px-5 py-2 text-gray-500 hover:text-pulse-dark hover:bg-gray-100/50 rounded-full text-xs font-bold transition-all duration-300">Analytics</button>
             <button className="px-5 py-2 text-gray-500 hover:text-pulse-dark hover:bg-gray-100/50 rounded-full text-xs font-bold transition-all duration-300">Sources</button>
             <button className="px-5 py-2 text-gray-500 hover:text-pulse-dark hover:bg-gray-100/50 rounded-full text-xs font-bold transition-all duration-300">Settings</button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
             <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors group">
                <Search size={18} className="text-pulse-dark group-hover:scale-110 transition-transform" />
             </button>
             
             <div className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group">
                <Bell size={18} className="text-pulse-dark group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse-red"></span>
             </div>

             {/* Profile with Spinning Segment (3/4 circle) */}
             <div className="relative w-11 h-11 ml-2 cursor-pointer group">
                {/* The Spinner - 3/4 Circle (border-t-transparent creates the gap) */}
                <div className="absolute inset-0 rounded-full border-[2px] border-pulse-yellow border-t-transparent animate-spin-profile"></div>
                <div className="absolute inset-0.5 rounded-full overflow-hidden bg-gray-200">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <main className="max-w-[1600px] mx-auto">
         
         {/* HERO SECTION (Stagger 2) */}
         <div className="mb-12 animate-slide-up px-4" style={{ animationDelay: '0.1s' }}>
            <div className="inline-block px-3 py-1 bg-white/60 rounded-lg mb-5 cursor-default backdrop-blur-sm border border-pulse-yellow/20 shadow-sm">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{COPY.HERO.LABEL}</span>
            </div>
            
            {/* Typography Match: "Il tuo Daily" line 1, "Insight" line 2 with highlighter */}
            <h1 className="text-6xl md:text-[5.5rem] font-display font-medium text-pulse-dark leading-[0.95] tracking-tight">
               Il tuo Daily
               <br />
               <span className="relative inline-block mt-1">
                  Insight
                  {/* Highlighter Effect: Lower, thinner, like a marker stroke */}
                  <div className="absolute w-[105%] h-3 bottom-1.5 -left-1 bg-pulse-yellow -z-10 transform -rotate-1 rounded-sm opacity-90"></div>
               </span>
            </h1>
         </div>

         {/* STATS ROW (Stagger 3) */}
         <div className="mb-10 border-b border-gray-200/60 pb-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <StatsRow stats={STATS_DATA} />
         </div>

         {/* DASHBOARD GRID - items-stretch to ensure columns have equal height */}
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* COL 1: SIDEBAR (Stagger 4) - Flex col to allow AgentCard to grow */}
            <div className="lg:col-span-1 flex flex-col gap-6 animate-slide-up h-full" style={{ animationDelay: '0.3s' }}>
               <AgentCard />
               <MenuLinks />
            </div>

            {/* COL 2 & 3: CENTER CONTENT - Flex col */}
            <div className="lg:col-span-2 flex flex-col gap-6 animate-slide-up h-full" style={{ animationDelay: '0.5s' }}>
               {/* Two Featured Cards Side-by-Side */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <FeaturedCard item={FEATURED_NEWS[0]} />
                  </div>
                  <div>
                     <FeaturedCard item={FEATURED_NEWS[1]} />
                  </div>
               </div>
               {/* Latest Drops Fills remaining space */}
               <div className="flex-1">
                  <LatestDropsCard items={LATEST_DROPS} />
               </div>
            </div>

            {/* COL 4: RIGHT SIDEBAR (Stagger 8) */}
            <div className="lg:col-span-1 h-full min-h-[600px] lg:min-h-0 animate-slide-left" style={{ animationDelay: '0.7s' }}>
               <LiveFeedCard items={LIVE_FEED} />
            </div>

         </div>

      </main>
    </div>
  );
};

export default App;