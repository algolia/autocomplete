/** @jsx h */
import {
  autocomplete,
  getAlgoliaHits,
  snippetHit,
} from '@algolia/autocomplete-js';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch';
import { h, Fragment } from 'preact';
import insightsClient from 'search-insights';

import '@algolia/autocomplete-theme-classic';

import { shortcutsPlugin } from './shortcutsPlugin';

type Product = {
  name: string;
  image: string;
  description: string;
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
});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  debug: true,
  openOnFocus: true,
  plugins: [
    shortcutsPlugin,
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
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  clickAnalytics: true,
                  attributesToSnippet: ['name:10', 'description:35'],
                  snippetEllipsisText: '…',
                },
              },
            ],
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Products</span>
                <div className="aa-SourceHeaderLine"></div>
              </Fragment>
            );
          },
          item({ item }) {
            return <ProductItem hit={item} />;
          },
          empty() {
            return (
              <div className="aa-ItemContent">
                <div className="aa-ItemContentTitle">
                  No products for this query.
                </div>
              </div>
            );
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
    <Fragment>
      <div className="aa-ItemIcon">
        <img src={hit.image} alt={hit.name} width="40" height="40" />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          {snippetHit<ProductHit>({ hit, attribute: 'name' })}
        </div>
        <div className="aa-ItemContentDescription">
          {snippetHit<ProductHit>({ hit, attribute: 'description' })}
        </div>
      </div>
      <button
        className="aa-ItemActionButton aa-TouchOnly aa-ActiveOnly"
        type="button"
        title="Select"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z"></path>
        </svg>
      </button>
    </Fragment>
  );
}
