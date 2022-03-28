import { RecentSearchesItem } from '@algolia/autocomplete-plugin-recent-searches/dist/esm/types';

import { AutocompleteHit } from './AutocompleteHit';

export type RecentSearchesHit = AutocompleteHit<RecentSearchesItem>;
