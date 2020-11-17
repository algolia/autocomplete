import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import { getAlgoliaInsightsHits } from '@algolia/autocomplete-preset-algolia';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import insightsClient from 'search-insights';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);
insightsClient('init', { appId, apiKey });

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient,
});
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'search',
  limit: 3,
});
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getAlgoliaHits: getAlgoliaInsightsHits,
  getSearchParams() {
    return recentSearchesPlugin.data.getAlgoliaSearchParams();
  },
});

autocomplete({
  container: '#autocomplete',
  openOnFocus: true,
  plugins: [
    algoliaInsightsPlugin,
    recentSearchesPlugin,
    querySuggestionsPlugin,
  ],
});
