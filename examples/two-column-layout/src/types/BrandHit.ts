import { AutocompleteHit } from './AutocompleteHit';

type BrandRecord = {
  label: string;
  count: number;
};

export type BrandHit = AutocompleteHit<BrandRecord>;
