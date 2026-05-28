// 本地持久化缓存（IndexedDB 替代方案，兼容 Next.js SSR）
const CACHE_KEY = 'zwds_reading_cache_v2';

export interface StreamCache {
  chartData: any;
  text: string;
  provider: string;
  ts: number;
}

export function saveCache(chartData: any, text: string, provider: string) {
  try {
    const cache: StreamCache = { chartData, text, provider, ts: Date.now() };
    if (JSON.stringify(cache).length > 50 * 1024) return;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) { console.warn('[缓存] 保存失败:', e); }
}

export function loadCache(): StreamCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}
