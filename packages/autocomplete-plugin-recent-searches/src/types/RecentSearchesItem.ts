import { HistoryItem } from './HistoryItem';

export type RecentSearchesItem = HistoryItem & {
  category?: string;
};
