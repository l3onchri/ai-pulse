import { NewsItem } from '../types';
import { MOCK_NEWS_DATA } from '../constants';

// In a real scenario, this would be the n8n webhook URL
// const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL;

export const fetchNews = async (): Promise<NewsItem[]> => {
  // Simulate network delay for better UX demonstration (1.5s)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Randomly simulate an error (10% chance) to demonstrate Error State
  const randomChance = Math.random();
  if (randomChance > 0.95) {
    throw new Error("Simulated network error");
  }

  // Randomly simulate empty state (5% chance)
  if (randomChance > 0.90 && randomChance <= 0.95) {
    return [];
  }

  // Return mock data shuffled slightly to look like a "refresh"
  const shuffled = [...MOCK_NEWS_DATA].sort(() => 0.5 - Math.random());
  
  // Ensure date is refreshed to look "live" for the first item
  if (shuffled.length > 0) {
      shuffled[0] = { ...shuffled[0], date: new Date().toISOString(), title: "[LIVE] " + shuffled[0].title };
  }
  
  return shuffled;
};