import type { SearchProvider, SearchResult } from './searchTypes';
import { LocalizationSearchProvider } from './providers/LocalizationSearchProvider';
import { ChineseLearningSearchProvider } from './providers/ChineseLearningSearchProvider';

const RECENT_SEARCHES_KEY = 'omnilife_recent_searches';

export class GlobalSearchService {
  private static providers: SearchProvider[] = [
    new LocalizationSearchProvider(),
    new ChineseLearningSearchProvider(),
  ];

  /**
   * Executes multi-provider search across all kept Mandarin modules simultaneously.
   */
  public static async executeGlobalSearch(query: string): Promise<SearchResult[]> {
    const qTrim = query.trim();
    if (!qTrim) return [];

    const searchPromises = this.providers.map((p) =>
      p.search(qTrim).catch((err) => {
        console.error(`Error in search provider ${p.category}:`, err);
        return [] as SearchResult[];
      })
    );

    const providerResults = await Promise.all(searchPromises);
    const combinedResults = providerResults.flat();

    // Sort by relevance score descending
    return combinedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Manages recent search history in localStorage
   */
  public static getRecentSearches(): string[] {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public static addRecentSearch(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;
    try {
      const current = this.getRecentSearches().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...current].slice(0, 8);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save recent search:', err);
    }
  }

  public static clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.error('Failed to clear recent search:', err);
    }
  }
}
