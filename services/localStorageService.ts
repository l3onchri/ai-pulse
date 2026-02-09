const KEYS = {
  SAVED: 'ai-pulse-saved',
  HISTORY: 'ai-pulse-history',
  PREFS: 'ai-pulse-prefs',
  NOTIF_READ: 'ai-pulse-notif-read',
  DISABLED_SOURCES: 'ai-pulse-disabled-sources',
};

function getJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Saved Articles ---
export function getSavedArticleIds(): string[] {
  return getJson<string[]>(KEYS.SAVED, []);
}

export function toggleSavedArticle(id: string): string[] {
  const saved = getSavedArticleIds();
  const idx = saved.indexOf(id);
  if (idx >= 0) saved.splice(idx, 1);
  else saved.unshift(id);
  setJson(KEYS.SAVED, saved);
  return saved;
}

export function isArticleSaved(id: string): boolean {
  return getSavedArticleIds().includes(id);
}

// --- Read History ---
export interface HistoryEntry {
  id: string;
  readAt: string;
}

export function getReadHistory(): HistoryEntry[] {
  return getJson<HistoryEntry[]>(KEYS.HISTORY, []);
}

export function addToReadHistory(id: string): HistoryEntry[] {
  const history = getReadHistory().filter(h => h.id !== id);
  history.unshift({ id, readAt: new Date().toISOString() });
  const trimmed = history.slice(0, 50);
  setJson(KEYS.HISTORY, trimmed);
  return trimmed;
}

// --- Notifications ---
export function getNotifReadCount(): number {
  return getJson<number>(KEYS.NOTIF_READ, 0);
}

export function setNotifReadCount(count: number) {
  setJson(KEYS.NOTIF_READ, count);
}

// --- Disabled Sources ---
export function getDisabledSources(): string[] {
  return getJson<string[]>(KEYS.DISABLED_SOURCES, []);
}

export function toggleSource(name: string): string[] {
  const disabled = getDisabledSources();
  const idx = disabled.indexOf(name);
  if (idx >= 0) disabled.splice(idx, 1);
  else disabled.push(name);
  setJson(KEYS.DISABLED_SOURCES, disabled);
  return disabled;
}
