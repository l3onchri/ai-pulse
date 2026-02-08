import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-pulse-card rounded-[32px] p-6 shadow-soft border border-white/50 w-full h-[320px] flex flex-col justify-between animate-pulse">
      
      <div>
        <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
                <div className="h-3 bg-pulse-dark/10 rounded w-20"></div>
                <div className="h-5 bg-pulse-dark/10 rounded w-24"></div>
            </div>
            <div className="h-6 bg-pulse-dark/10 rounded-full w-16"></div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="h-6 bg-pulse-dark/10 rounded-lg w-full"></div>
          <div className="h-6 bg-pulse-dark/10 rounded-lg w-3/4"></div>
          <div className="h-4 bg-pulse-dark/5 rounded-lg w-full mt-4"></div>
          <div className="h-4 bg-pulse-dark/5 rounded-lg w-full"></div>
        </div>
      </div>

      <div className="flex items-end justify-between">
         <div className="w-16 h-16 rounded-[20px] bg-pulse-dark/10"></div>
         <div className="w-24 h-12 rounded-full bg-pulse-dark/10"></div>
      </div>
    </div>
  );
};