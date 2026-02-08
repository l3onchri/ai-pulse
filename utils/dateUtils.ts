/**
 * Simple relative time formatter to avoid heavy libraries for this specific use case.
 * Returns strings like "2 ore fa", "Ieri", "3 giorni fa".
 */
export const getRelativeTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Pochi secondi fa";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minuti'} fa`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'ora' : 'ore'} fa`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Ieri";
  if (diffInDays < 30) return `${diffInDays} giorni fa`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} ${diffInMonths === 1 ? 'mese' : 'mesi'} fa`;

  return "Più di un anno fa";
};