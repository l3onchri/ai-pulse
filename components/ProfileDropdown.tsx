import React, { useEffect, useRef } from 'react';
import { Settings, Info, User } from 'lucide-react';
import { PageId } from '../types';

interface Props {
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}

const ProfileDropdown: React.FC<Props> = ({ onClose, onNavigate }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    setTimeout(() => document.addEventListener('mousedown', handleClick), 10);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-3 w-56 bg-white rounded-[16px] shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-slide-down"
    >
      {/* User info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-pulse-dark">Utente</p>
            <p className="text-[10px] text-gray-400">AI Pulse User</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="p-2">
        <button
          onClick={() => { onNavigate('settings'); onClose(); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <Settings size={14} className="text-gray-400 group-hover:text-pulse-dark" />
          <span className="text-sm font-medium text-gray-600 group-hover:text-pulse-dark">Impostazioni</span>
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <Info size={14} className="text-gray-400 group-hover:text-pulse-dark" />
          <span className="text-sm font-medium text-gray-600 group-hover:text-pulse-dark">About AI Pulse</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
