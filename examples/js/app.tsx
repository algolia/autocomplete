/** @jsx h */
import {
  autocomplete,
  getAlgoliaHits,
  highlightHit,
} from '@algolia/autocomplete-js';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';
import insightsClient from 'search-insights';

import '@algolia/autocomplete-theme-classic';

type Product = { name: string; image: string };
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
});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  debug: true,
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
          return getAlgoliaHits<Product>({
            searchClient,
            queries: [{ indexName: 'instant_search', query }],
          });
        },
        templates: {
          item({ item }) {
            return <ProductItem hit={item} />;
          },
        },
      },
    ];
  },
});

type ProductItemProps = {
  hit: ProductHit;
};

function ProductItem({ hit }: ProductItemProps) {
  return (
    <div className="aa-ItemContent">
      <div className="aa-ItemSourceIcon">
        <img src={hit.image} alt={hit.name} width="20" height="20" />
      </div>

      <div
        className="aa-ItemTitle"
        dangerouslySetInnerHTML={{
          __html: highlightHit<ProductHit>({
            hit,
            attribute: 'name',
          }),
        }}
      />
    </div>
  );
}
