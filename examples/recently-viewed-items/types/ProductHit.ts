import { Hit } from '@algolia/client-search';

export type ProductItem = {
  name: string;
  image: string;
  description: string;
};

export type ProductHit = Hit<ProductItem> & {
  __autocomplete_indexName: string;
  __autocomplete_queryID: string;
};
