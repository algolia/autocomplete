/** @jsx h */
import {
  autocomplete,
  getAlgoliaHits,
  snippetHit,
} from '@algolia/autocomplete-js';
import {
  AutocompleteInsightsApi,
  createAlgoliaInsightsPlugin,
} from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch';
import { h, Fragment } from 'preact';
import insightsClient from 'search-insights';

import '@algolia/autocomplete-theme-classic';

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

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
    return {
      hitsPerPage: 5,
    };
  },
});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  debug: true,
  openOnFocus: true,
  plugins: [algoliaInsightsPlugin, querySuggestionsPlugin],
  getSources({ query, state }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaHits<Product>({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  clickAnalytics: true,
                  attributesToSnippet: [
                    'name:10',
                    'price',
                    'brand',
                    'categories[0]',
                  ],
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
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item }) {
            return (
              <ProductItem
                hit={item}
                insights={state.context.algoliaInsightsPlugin.insights}
              />
            );
          },
          noResults() {
            return (
              <div className="aa-ItemContent">No products for this query.</div>
            );
          },
        },
      },
    ];
  },
});

type ProductItemProps = {
  hit: ProductHit;
  insights: AutocompleteInsightsApi;
};

const getArray = (nb) => {
  const tmp = [];
  for (let i = 0; i < nb; i++) {
    tmp.push(i);
  }

  return tmp;
};

function ProductItem({ hit, insights }: ProductItemProps) {
  return (
    <Fragment>
      <div className="aa-ItemIcon aa-ItemIcon--align-top">
        <img src={hit.image} alt={hit.name} width="40" height="40" />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          {snippetHit<ProductHit>({ hit, attribute: 'name' })}
          <br></br>
          {snippetHit<ProductHit>({ hit, attribute: 'brand' })}
          {snippetHit<ProductHit>({ hit, attribute: 'categories[0]' })}
        </div>
        <div className="aa-ItemContentDescription">
          € {snippetHit<ProductHit>({ hit, attribute: 'price' })}{' '}
          {getArray(parseInt(hit.rating, 10)).map((i) => {
            return (
              <svg
                key={i}
                height="12px"
                viewBox="0 -10 511.98685 511"
                width="12px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"
                  fill="#ffc107"
                />
              </svg>
            );
          })}
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-TouchOnly aa-ActiveOnly"
          type="button"
          title="Select"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
          </svg>
        </button>
        <button
          className="aa-ItemActionButton"
          type="button"
          title="Add to cart"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            insights.convertedObjectIDsAfterSearch({
              eventName: 'Added to cart',
              index: hit.__autocomplete_indexName,
              objectIDs: [hit.objectID],
              queryID: hit.__autocomplete_queryID,
            });
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 5h-14l1.5-2h11zM21.794 5.392l-2.994-3.992c-0.196-0.261-0.494-0.399-0.8-0.4h-12c-0.326 0-0.616 0.156-0.8 0.4l-2.994 3.992c-0.043 0.056-0.081 0.117-0.111 0.182-0.065 0.137-0.096 0.283-0.095 0.426v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.219-0.071-0.422-0.189-0.585-0.004-0.005-0.007-0.010-0.011-0.015zM4 7h16v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707zM15 10c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121c0-0.552-0.448-1-1-1s-1 0.448-1 1c0 1.38 0.561 2.632 1.464 3.536s2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
          </svg>
        </button>
      </div>
    </Fragment>
  );
}
