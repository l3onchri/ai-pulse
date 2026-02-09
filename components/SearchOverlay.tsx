import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { NewsItem } from '../types';

interface Props {
  articles: NewsItem[];
  onClose: () => void;
}

const SearchOverlay: React.FC<Props> = ({ articles, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const q = query.toLowerCase().trim();
  const filtered = q.length < 2
    ? []
    : articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        (a.summary && a.summary.toLowerCase().includes(q))
      );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] animate-fade-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Search Panel */}
      <div className="relative w-full max-w-2xl mx-4 animate-slide-down">
        <div className="bg-white rounded-[24px] shadow-2xl border border-white/60 overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 p-5 border-b border-gray-100">
            <Search size={20} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cerca articoli..."
              className="flex-1 text-lg font-medium text-pulse-dark outline-none placeholder:text-gray-300 bg-transparent"
            />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
            >
              <X size={14} className="text-gray-500" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {q.length >= 2 && filtered.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">Nessun risultato per "{query}"</p>
              </div>
            )}
            {filtered.map(item => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
              >
                {item.imagelink ? (
                  <img src={item.imagelink} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-gray-400">{item.source?.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-pulse-dark truncate group-hover:text-pulse-dark/70">{item.title}</h4>
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
              </a>
            ))}
            {q.length < 2 && (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">Digita almeno 2 caratteri per cercare</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
