import React from 'react';
import { Clock } from 'lucide-react';
import { NewsItem } from '../../types';
import { getReadHistory } from '../../services/localStorageService';

interface Props {
  articles: NewsItem[];
  onArticleClick: (article: NewsItem) => void;
}

const HistoryPanel: React.FC<Props> = ({ articles, onArticleClick }) => {
  const history = getReadHistory();
  const historyArticles = history
    .map(h => articles.find(a => a.id === h.id))
    .filter((a): a is NewsItem => a !== undefined);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Clock size={18} className="text-pulse-yellow" />
        <h3 className="text-xl font-bold text-pulse-dark font-display">Cronologia</h3>
      </div>

      {historyArticles.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Nessun articolo letto di recente.</p>
          <p className="text-xs text-gray-300 mt-1">Gli articoli che apri appariranno qui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyArticles.map(item => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
