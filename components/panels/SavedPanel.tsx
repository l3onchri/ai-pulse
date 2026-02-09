import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { NewsItem } from '../../types';
import { getSavedArticleIds, toggleSavedArticle } from '../../services/localStorageService';

interface Props {
  articles: NewsItem[];
  onUpdate: () => void;
  onArticleClick: (article: NewsItem) => void;
}

const SavedPanel: React.FC<Props> = ({ articles, onUpdate, onArticleClick }) => {
  const savedIds = getSavedArticleIds();
  const savedArticles = articles.filter(a => savedIds.includes(a.id));

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleSavedArticle(id);
    onUpdate();
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Bookmark size={18} className="text-pulse-yellow" />
        <h3 className="text-xl font-bold text-pulse-dark font-display">Articoli Salvati</h3>
      </div>

      {savedArticles.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Nessun articolo salvato.</p>
          <p className="text-xs text-gray-300 mt-1">Clicca su un articolo e usa il bottone salva.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedArticles.map(item => (
            <div
              key={item.id}
              onClick={() => onArticleClick(item)}
              className="flex items-center gap-4 p-3 hover:bg-pulse-bg rounded-2xl cursor-pointer transition-all duration-300 group -mx-3"
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
                <span className="text-[10px] font-bold text-gray-400 uppercase">{item.source}</span>
              </div>
              <button
                onClick={(e) => handleRemove(e, item.id)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPanel;
