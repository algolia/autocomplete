/** @jsx h */
import {
  autocomplete,
} from '@algolia/autocomplete-js';
import {
  createAlgoliaInsightsPlugin,
} from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch';
import insightsClient from 'search-insights';

import '@algolia/autocomplete-theme-classic';

import { createCategoriesPlugin } from './categoriesPlugin';

type Product = {
  name: string;
  image: string;
  description: string;
  __autocomplete_indexName: string;
  __autocomplete_queryID: string;
};
type ProductHit = Hit<Product>;

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);
insightsClient('init', { appId, apiKey });

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'search',
  limit: 3,
});
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams({ state }) {
    return recentSearchesPlugin.data.getAlgoliaSearchParams({
      clickAnalytics: true,
      hitsPerPage: state.query ? 5 : 10,
    });
  },
  categoryAttribute: 'categories',
});
const categoriesPlugin = createCategoriesPlugin({ searchClient });

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  debug: true,
  openOnFocus: true,
  plugins: [
    algoliaInsightsPlugin,
    recentSearchesPlugin,
    querySuggestionsPlugin,
    categoriesPlugin,
  ],
});
