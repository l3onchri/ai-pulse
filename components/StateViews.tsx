import React from 'react';
import { COPY } from '../constants';
import { Rocket, AlertOctagon, Coffee } from 'lucide-react';

export const InitialView: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center animate-fade-in px-4">
    <div className="bg-pulse-card p-10 rounded-[40px] shadow-floating mb-8 relative group border border-white">
        <div className="absolute inset-0 bg-pulse-yellow/20 rounded-[40px] blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <Rocket size={48} className="text-pulse-dark relative z-10 transform group-hover:-translate-y-2 transition-transform duration-300" />
    </div>
    <h3 className="text-3xl font-bold text-pulse-dark mb-4 tracking-tight">{COPY.STATES.INITIAL.TITLE}</h3>
    <p className="text-pulse-subtext max-w-md mx-auto text-lg leading-relaxed font-medium">{COPY.STATES.INITIAL.SUBTITLE}</p>
  </div>
);

export const EmptyView: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center animate-fade-in px-4">
    <div className="bg-pulse-card p-8 rounded-[40px] mb-8 border border-white shadow-soft">
        <Coffee size={40} className="text-pulse-subtext" />
    </div>
    <h3 className="text-2xl font-bold text-pulse-dark mb-3">{COPY.STATES.EMPTY.TITLE}</h3>
    <p className="text-pulse-subtext max-w-md mx-auto">{COPY.STATES.EMPTY.SUBTITLE}</p>
  </div>
);

export const ErrorView: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center animate-fade-in px-4">
    <div className="bg-red-50 p-8 rounded-[40px] mb-8 border border-red-100 shadow-soft">
        <AlertOctagon size={40} className="text-red-500" />
    </div>
    <h3 className="text-2xl font-bold text-red-600 mb-3">{COPY.STATES.ERROR.TITLE}</h3>
    <p className="text-red-500/80 max-w-md mx-auto">{COPY.STATES.ERROR.SUBTITLE}</p>
  </div>
);