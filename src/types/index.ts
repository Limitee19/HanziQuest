export type NavTab =
  | 'dashboard'
  | 'drill'
  | 'leech'
  | 'garden'
  | 'vocab'
  | 'session'
  | 'chinese_learning'
  | 'ai_assistant'
  | 'settings';

export type Theme = 'dark' | 'light' | 'system';

export interface UserProfile {
  name: string;
  appStartDate: string;
}
