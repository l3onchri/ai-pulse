import React, { useEffect } from 'react';
import { X, ExternalLink, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { NewsItem } from '../types';
import { isArticleSaved, toggleSavedArticle } from '../services/localStorageService';

interface Props {
  article: NewsItem;
  onClose: () => void;
  onSaveToggle: () => void;
}

const ArticleDetail: React.FC<Props> = ({ article, onClose, onSaveToggle }) => {
  const saved = isArticleSaved(article.id);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSave = () => {
    toggleSavedArticle(article.id);
    onSaveToggle();
  };

  const dateStr = typeof article.date === 'string' && article.date.length > 5
    ? new Date(article.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : article.date;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-overlay" onClick={onClose} />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-soft flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <X size={18} className="text-pulse-dark" />
        </button>

        {/* Image */}
        {article.imagelink ? (
          <div className="h-64 w-full bg-gray-100 overflow-hidden">
            <img src={article.imagelink} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-40 w-full bg-gradient-to-b from-pulse-yellow/20 to-transparent" />
        )}

        {/* Content */}
        <div className="p-8">
          {/* Category & Source */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-md">
              {article.category || 'AI'}
            </span>
            <span className="text-[10px] font-bold text-pulse-yellow uppercase tracking-widest">
              {article.source}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-display font-bold text-pulse-dark leading-tight mb-4">
            {article.title}
          </h2>

          {/* Date */}
          <div className="flex items-center gap-2 mb-6 text-gray-400">
            <Clock size={12} />
            <span className="text-xs font-medium">{dateStr}</span>
          </div>

          {/* Summary */}
          {article.summary && (
            <p className="text-sm text-gray-600 leading-relaxed mb-8 border-l-2 border-pulse-yellow/50 pl-4">
              {article.summary}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 bg-pulse-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg"
            >
              <ExternalLink size={16} />
              Leggi Articolo Completo
            </a>
            <button
              onClick={handleSave}
              className={`w-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                saved
                  ? 'bg-pulse-yellow/10 border-pulse-yellow text-pulse-yellow'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-pulse-yellow hover:text-pulse-yellow'
              }`}
            >
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
