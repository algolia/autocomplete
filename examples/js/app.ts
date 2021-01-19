import {
  autocomplete,
  getAlgoliaHits,
  reverseHighlightHit,
} from '@algolia/autocomplete-js';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import algoliasearch from 'algoliasearch';
import insightsClient from 'search-insights';

import '@algolia/autocomplete-theme-classic';

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
  placeholder: 'Search',
  openOnFocus: true,
  plugins: [
    algoliaInsightsPlugin,
    recentSearchesPlugin,
    querySuggestionsPlugin,
  ],
  getSources({ query }) {
    if (!query) {
      return [];
    }

    return [
      {
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [{ indexName: 'instant_search', query }],
          });
        },
        templates: {
          item({ item, root }) {
            const itemContent = document.createElement('div');
            const ItemSourceIcon = document.createElement('div');
            const itemTitle = document.createElement('div');
            const sourceIcon = document.createElement('img');

            sourceIcon.width = 20;
            sourceIcon.height = 20;
            sourceIcon.src = item.image;

            ItemSourceIcon.classList.add('aa-ItemSourceIcon');
            ItemSourceIcon.appendChild(sourceIcon);

            itemTitle.innerHTML = reverseHighlightHit({
              hit: item,
              attribute: 'name',
            });
            itemTitle.classList.add('aa-ItemTitle');

            itemContent.classList.add('aa-ItemContent');
            itemContent.appendChild(ItemSourceIcon);
            itemContent.appendChild(itemTitle);

            root.appendChild(itemContent);
          },
          empty({ root }) {
            const itemContent = document.createElement('div');

            itemContent.innerHTML = 'No results for this query';
            itemContent.classList.add('aa-ItemContent');

            root.appendChild(itemContent);
          },
        },
      },
    ];
  },
});
