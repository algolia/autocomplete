import { Hit } from '@algolia/client-search';

type CategoryRecord = {
  list_categories: string[];
};

export type CategoryHit = Hit<CategoryRecord>;
