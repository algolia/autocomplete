import { Hit } from '@algolia/client-search';

type FaqRecord = {
  list_categories: string[];
  title: string;
  description: string;
};

export type FaqHit = Hit<FaqRecord>;
