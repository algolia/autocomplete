import { autocomplete } from '@algolia/autocomplete-js';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import algoliasearch from 'algoliasearch';
import insightsClient from 'search-insights';

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
  getSearchParams() {
    return recentSearchesPlugin.data.getAlgoliaSearchParams({
      clickAnalytics: true,
    });
  },
});

autocomplete({
  container: '#autocomplete',
  openOnFocus: true,
  debug: true,
  plugins: [
    algoliaInsightsPlugin,
    recentSearchesPlugin,
    querySuggestionsPlugin,
  ],
});
