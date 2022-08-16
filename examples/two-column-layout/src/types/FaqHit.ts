import { AutocompleteHit } from './AutocompleteHit';

type FaqRecord = {
  list_categories: string[];
  title: string;
  description: string;
};

export type FaqHit = AutocompleteHit<FaqRecord>;
