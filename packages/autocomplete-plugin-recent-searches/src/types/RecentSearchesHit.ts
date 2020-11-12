import { RecentSearchesItem } from './RecentSearchesItem';

export type RecentSearchesHit = RecentSearchesItem & {
  _highlightResult: {
    query: {
      value: string;
    };
  };
};
