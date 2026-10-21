import { SearchProvider, SearchResult } from '../searchTypes';
import { getCurrentLanguage } from '@/services/localizationService';

export class LocalizationSearchProvider implements SearchProvider {
  public category: 'document' = 'document';

  public async search(query: string): Promise<SearchResult[]> {
    const qLower = query.toLowerCase().trim();
    if (!qLower) return [];

    try {
      const results: SearchResult[] = [];
      const currentLang = getCurrentLanguage();

      if ('language'.includes(qLower) || 'bahasa'.includes(qLower) || 'indonesia'.includes(qLower) || 'english'.includes(qLower)) {
        results.push({
          id: 'loc_switch',
          category: 'document',
          title: '[SETTINGS] Language Preference (Bahasa Indonesia / English)',
          subtitle: `Current active language: ${currentLang === 'id' ? 'Bahasa Indonesia' : 'English'}`,
          targetTab: 'settings',
          relevanceScore: 100,
        });
      }

      return results;
    } catch (err) {
      console.error('LocalizationSearchProvider error:', err);
      return [];
    }
  }
}
