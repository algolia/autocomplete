import { Hit } from '@algolia/client-search';

export type AutocompleteHit<THit> = Hit<
  THit & {
    __autocomplete_id: number;
  }
>;
