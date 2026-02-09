export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imagelink?: string;
  date: Date | string;
  category?: string;
  isBreaking?: boolean;
}

export interface StatItem {
  label: string;
  value: string;
  icon?: any;
}

export interface TopicItem {
  id: string;
  name: string;
  trend: 'up' | 'down' | 'neutral';
  volume: string;
}

export interface CategoryStat {
  name: string;
  count: number;
  total: number; // For progress bar
}

export interface LiveUpdateItem {
  id: string;
  text: string;
  timestamp: string;
  type: 'critical' | 'major' | 'normal';
  color?: string;
  source?: string;
}

export enum AppState {
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  EMPTY = 'EMPTY',
}

export type PageId = 'dashboard' | 'analytics' | 'sources' | 'settings';
export type SidebarPanel = 'preferences' | 'history' | 'saved' | null;