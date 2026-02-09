import React, { useState } from 'react';
import { Rss, ExternalLink } from 'lucide-react';
import { getDisabledSources, toggleSource } from '../../services/localStorageService';

const RSS_SOURCES = [
  { name: 'TechCrunch', url: 'techcrunch.com', color: '#0A9E01' },
  { name: 'MIT Tech Review', url: 'technologyreview.com', color: '#A31D37' },
  { name: 'VentureBeat', url: 'venturebeat.com', color: '#4D61FC' },
  { name: 'The Verge', url: 'theverge.com', color: '#E5127D' },
  { name: 'Wired', url: 'wired.com', color: '#000000' },
  { name: 'Ars Technica', url: 'arstechnica.com', color: '#FF4E00' },
  { name: 'AI News', url: 'artificialintelligence-news.com', color: '#2563EB' },
  { name: 'The Decoder', url: 'the-decoder.com', color: '#7C3AED' },
  { name: 'CNBC', url: 'cnbc.com', color: '#005594' },
];

const SourcesPage: React.FC = () => {
  const [disabled, setDisabled] = useState<string[]>(getDisabledSources());

  const handleToggle = (name: string) => {
    const updated = toggleSource(name);
    setDisabled([...updated]);
  };

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="mb-8 px-4">
        <div className="inline-block px-3 py-1 bg-white/60 rounded-lg mb-5 backdrop-blur-sm border border-pulse-yellow/20 shadow-sm">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sources</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-medium text-pulse-dark leading-[0.95] tracking-tight">
          Le tue
          <br />
          <span className="relative inline-block mt-1">
            Fonti
            <div className="absolute w-[105%] h-3 bottom-1.5 -left-1 bg-pulse-yellow -z-10 transform -rotate-1 rounded-sm opacity-90"></div>
          </span>
        </h1>
        <p className="text-sm text-gray-400 mt-4 max-w-lg">Attiva o disattiva le fonti RSS. Le fonti disattivate verranno escluse dal prossimo refresh.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {RSS_SOURCES.map((source) => {
          const isEnabled = !disabled.includes(source.name);
          return (
            <div
              key={source.name}
              className={`premium-card bg-white rounded-[24px] p-6 shadow-soft border flex flex-col gap-4 transition-all duration-300 ${
                isEnabled ? 'border-white/60 opacity-100' : 'border-gray-200 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                    style={{ backgroundColor: source.color }}
                  >
                    {source.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-pulse-dark">{source.name}</h4>
                    <div className="flex items-center gap-1">
                      <Rss size={10} className="text-gray-400" />
                      <span className="text-[10px] text-gray-400">{source.url}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://${source.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink size={12} className="text-gray-400" />
                </a>
              </div>

              <button
                onClick={() => handleToggle(source.name)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isEnabled
                    ? 'bg-pulse-dark text-white hover:bg-black'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {isEnabled ? 'ATTIVA' : 'DISATTIVATA'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SourcesPage;
