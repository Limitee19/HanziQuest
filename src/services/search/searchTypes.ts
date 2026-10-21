import { NavTab } from '@/types';

export type SearchCategory =
  | 'task'
  | 'calendar'
  | 'reminder'
  | 'routine'
  | 'goal'
  | 'note'
  | 'academic'
  | 'document'
  | 'vault'
  | 'analytics';

export interface SearchResult {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle?: string;
  description?: string;
  targetTab: NavTab;
  entityId?: string;
  relevanceScore: number;
  date?: string;
}

export interface SearchProvider {
  category: SearchCategory;
  search(query: string): Promise<SearchResult[]>;
}
