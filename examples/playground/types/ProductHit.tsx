import { Hit } from '@algolia/client-search';

export type ProductRecord = {
  brand: string;
  categories: string[];
  description: string;
  free_shipping: boolean;
  hierarchicalCategories: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5?: string;
    lvl6?: string;
  };
  image: string;
  name: string;
  popularity: number;
  price: number;
  prince_range: string;
  rating: number;
  type: string;
};

type WithAutocompleteAnalytics<THit> = THit & {
  __autocomplete_indexName: string;
  __autocomplete_queryID: string;
};

export type ProductHit = WithAutocompleteAnalytics<Hit<ProductRecord>>;
