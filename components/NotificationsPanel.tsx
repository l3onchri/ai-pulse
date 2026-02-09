import React, { useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { LiveUpdateItem } from '../types';

interface Props {
  items: LiveUpdateItem[];
  onClose: () => void;
}

const NotificationsPanel: React.FC<Props> = ({ items, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handleClick), 10);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[20px] shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-slide-down"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-pulse-dark" />
          <span className="text-sm font-bold text-pulse-dark">Notifiche</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X size={10} className="text-gray-500" />
        </button>
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {items.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-400">Nessuna notifica</p>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer group"
          >
            <div
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: item.color || '#9ca3af' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-pulse-dark leading-snug group-hover:text-pulse-dark/70 line-clamp-2">
                {item.text}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: item.color || '#9ca3af' }}>
                  {item.source || 'Source'}
                </span>
                <span className="text-[10px] text-gray-400">{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;
