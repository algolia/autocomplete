import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch/lite';
import {
  autocomplete,
  AutocompleteSource,
  getAlgoliaHits,
  reverseHighlightItem,
} from '@algolia/autocomplete-js';
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

type QuerySuggestionHit = { query: string };

const recentSearches = createRecentSearchesPlugin({ key: 'recent' });

autocomplete<Hit<QuerySuggestionHit>>({
  container: '#autocomplete',
  debug: true,
  openOnFocus: true,
  // dropdownPlacement: 'start',
  plugins: [recentSearches],
  getSources({ query }) {
    return getAlgoliaHits<QuerySuggestionHit>({
      searchClient,
      queries: [
        {
          indexName: 'instant_search_demo_query_suggestions',
          query,
          params: {
            hitsPerPage: 10,
            facetFilters: [...recentSearches.data.getFacetFilters()],
          },
        },
      ],
    }).then(([hits]) => {
      return [
        {
          getInputValue: ({ suggestion }) => suggestion.query,
          getSuggestions() {
            return hits;
          },
          templates: {
            item({ item }) {
              return `
                <div class="item-icon">${searchIcon}</div>
                <div>
                  ${reverseHighlightItem({
                    item,
                    attribute: 'query',
                  })}
                </div>
              `;
            },
          },
        } as AutocompleteSource<Hit<QuerySuggestionHit>>,
      ];
    });
  },
});

const searchIcon = `<svg width="20" height="20" viewBox="0 0 20 20">
  <path
    d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
    stroke="currentColor"
    fill="none"
    fillRule="evenodd"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>`;
