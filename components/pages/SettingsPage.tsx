import React, { useState } from 'react';
import { Globe, Clock, Palette, Info } from 'lucide-react';

interface Prefs {
  language: 'it' | 'en';
  autoRefreshMin: number;
}

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem('ai-pulse-prefs');
    return raw ? JSON.parse(raw) : { language: 'it', autoRefreshMin: 0 };
  } catch {
    return { language: 'it', autoRefreshMin: 0 };
  }
}

function savePrefs(p: Prefs) {
  localStorage.setItem('ai-pulse-prefs', JSON.stringify(p));
}

const SettingsPage: React.FC = () => {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs());

  const update = (partial: Partial<Prefs>) => {
    const next = { ...prefs, ...partial };
    setPrefs(next);
    savePrefs(next);
  };

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="mb-8 px-4">
        <div className="inline-block px-3 py-1 bg-white/60 rounded-lg mb-5 backdrop-blur-sm border border-pulse-yellow/20 shadow-sm">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Settings</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-medium text-pulse-dark leading-[0.95] tracking-tight">
          Le tue
          <br />
          <span className="relative inline-block mt-1">
            Preferenze
            <div className="absolute w-[105%] h-3 bottom-1.5 -left-1 bg-pulse-yellow -z-10 transform -rotate-1 rounded-sm opacity-90"></div>
          </span>
        </h1>
      </div>

      <div className="max-w-2xl space-y-6 px-4">
        {/* Language */}
        <div className="premium-card bg-white rounded-[24px] p-6 shadow-soft border border-white/60">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={18} className="text-gray-400" />
            <h3 className="text-sm font-bold text-pulse-dark">Lingua Titoli</h3>
          </div>
          <div className="flex gap-3">
            {(['it', 'en'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => update({ language: lang })}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  prefs.language === lang
                    ? 'bg-pulse-dark text-white shadow-lg'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {lang === 'it' ? 'Italiano' : 'English'}
              </button>
            ))}
          </div>
        </div>

        {/* Auto Refresh */}
        <div className="premium-card bg-white rounded-[24px] p-6 shadow-soft border border-white/60">
          <div className="flex items-center gap-3 mb-4">
            <Clock size={18} className="text-gray-400" />
            <h3 className="text-sm font-bold text-pulse-dark">Auto Refresh</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'OFF', value: 0 },
              { label: '15 min', value: 15 },
              { label: '30 min', value: 30 },
              { label: '1 ora', value: 60 },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => update({ autoRefreshMin: opt.value })}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  prefs.autoRefreshMin === opt.value
                    ? 'bg-pulse-dark text-white shadow-lg'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="premium-card bg-white rounded-[24px] p-6 shadow-soft border border-white/60">
          <div className="flex items-center gap-3 mb-4">
            <Palette size={18} className="text-gray-400" />
            <h3 className="text-sm font-bold text-pulse-dark">Tema</h3>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 rounded-xl text-xs font-bold bg-pulse-dark text-white shadow-lg">
              Chiaro
            </button>
            <button className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-400 cursor-not-allowed" disabled>
              Scuro (Prossimamente)
            </button>
          </div>
        </div>

        {/* About */}
        <div className="premium-card bg-white rounded-[24px] p-6 shadow-soft border border-white/60">
          <div className="flex items-center gap-3 mb-4">
            <Info size={18} className="text-gray-400" />
            <h3 className="text-sm font-bold text-pulse-dark">About</h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            <strong className="text-pulse-dark">AI Pulse</strong> — Il tuo hub per le news sull'Intelligenza Artificiale.
            <br />
            Powered by n8n + AI. Fatto con &#9889; da Christian.
          </p>
          <p className="text-[10px] text-gray-400 mt-3 uppercase tracking-widest">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
