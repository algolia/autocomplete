import algoliasearch from 'algoliasearch/lite';

export const INSTANT_SEARCH_INDEX_NAME = 'instant_search';
export const INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE =
  'hierarchicalCategories.lvl0';

export const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
