import React from 'react';
import { NewsItem } from '../types';
import { getRelativeTime } from '../utils/dateUtils';
import { ArrowUpRight } from 'lucide-react';

export const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {
  return (
    <div className="group bg-white rounded-[20px] p-3 shadow-glow hover:shadow-glow-hover transition-all duration-300 hover:scale-[1.02] flex flex-col h-full min-h-[260px] border border-white/60">
      
      {/* Image Thumb */}
      <div className="h-36 w-full rounded-[16px] overflow-hidden bg-gray-100 mb-3 relative">
         <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-pulse-dark shadow-sm">
            {getRelativeTime(item.date)}
         </div>
         <img 
          src={item.imagelink} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-1">
         <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-pulse-text uppercase tracking-wider">{item.source}</span>
         </div>
         
         <h4 className="text-sm font-bold text-pulse-dark leading-snug mb-3 line-clamp-2 group-hover:text-pulse-yellowHover transition-colors">
            {item.title}
         </h4>
         
         <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            {item.category && (
               <span className="bg-pulse-card text-pulse-text px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide group-hover:bg-pulse-yellow group-hover:text-pulse-dark transition-colors">
                 {item.category}
               </span>
            )}
            <a href={item.url} target="_blank" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-pulse-dark hover:bg-pulse-dark hover:text-white transition-all shadow-sm">
               <ArrowUpRight size={14} />
            </a>
         </div>
      </div>
    </div>
  );
};