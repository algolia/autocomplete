import { AutocompleteHit } from './AutocompleteHit';

type CategoryRecord = {
  list_categories: string[];
};

export type CategoryHit = AutocompleteHit<CategoryRecord>;
