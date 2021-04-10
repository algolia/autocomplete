/** @jsx h */
import {
  autocomplete,
  AutocompleteComponents,
  getAlgoliaFacets,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import {
  AutocompleteInsightsApi,
  createAlgoliaInsightsPlugin,
} from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import algoliasearch from 'algoliasearch';
import { h, Fragment } from 'preact';
import insightsClient from 'search-insights';

import '@algolia/autocomplete-theme-classic';

import { createCategoriesPlugin } from './categoriesPlugin';
import { shortcutsPlugin } from './shortcutsPlugin';
import { ProductHit, ProductRecord } from './types';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);
const searchClient2 = algoliasearch(
  'GZV6PDPKZY',
  'b81a40a29d53e9d7d5ae6e919cce610d'
);
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
  categoryAttribute: [
    'instant_search',
    'facets',
    'exact_matches',
    'categories',
  ],
  categoriesPerItem: 2,
});
const categoriesPlugin = createCategoriesPlugin({ searchClient });

function debouncePromise<TParams extends unknown[], TResponse>(
  fn: (...params: TParams) => Promise<TResponse>,
  time: number
) {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;

  return function (...args: TParams) {
    if (timerId) {
      clearTimeout(timerId);
    }

    return new Promise<TResponse>((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}

const debouncedFetch = debouncePromise(fetch, 300);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  debug: true,
  openOnFocus: true,
  plugins: [
    shortcutsPlugin,
    algoliaInsightsPlugin,
    // recentSearchesPlugin,
    // querySuggestionsPlugin,
    // categoriesPlugin,
  ],
  getSources({ query, state }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'categories',
        getItems() {
          return getAlgoliaFacets({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                type: 'facet',
                facet: 'categories',
                query,
                params: {
                  clickAnalytics: true,
                },
              },
            ],
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Categories</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return (
              <div className="aa-ItemContent">
                <div className="aa-ItemContentTitle">
                  {item.highlighted}
                  {/* <components.Highlight hit={item} attribute="label" /> */}
                </div>
              </div>
            );
          },
        },
      },
      {
        sourceId: 'github',
        getItems() {
          return debouncedFetch(
            `https://api.github.com/search/repositories?q=${query}&per_page=5`
          )
            .then((response) => response.json())
            .then((result) => result.items || []);
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">GitHub</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item }) {
            return item.full_name;
          },
        },
      },
      {
        sourceId: 'suggestions',
        getItems({ setContext }) {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'instant_search_demo_query_suggestions',
                query,
                params: {
                  clickAnalytics: true,
                },
              },
            ],
            transformResponse({ hits, results }) {
              const [suggestions] = results;

              setContext({
                suggestionsProcessingTime: suggestions.processingTimeMS
              });

              return hits;
            },
          });
        },
        templates: {
          header({ state }) {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">
                  Suggestions (processed in {state.context.suggestionsProcessingTime} ms)
                </span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return (
              <div className="aa-ItemContent">
                <div className="aa-ItemContentTitle">
                  <components.ReverseHighlight hit={item} attribute="query" />
                </div>
              </div>
            );
          },
        },
      },
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaResults<ProductRecord>({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  clickAnalytics: true,
                  attributesToSnippet: ['name:10', 'description:35'],
                  snippetEllipsisText: '…',
                  hitsPerPage: 5,
                },
              },
              {
                indexName: 'instant_search_movies',
                query,
                params: {
                  clickAnalytics: true,
                  hitsPerPage: 5,
                },
              },
            ],
            transformResponse({ hits }) {
              const [bestBuyHits, imdbHits] = hits;

              return bestBuyHits.map((hit) => ({
                ...hit,
                comments: hit.popularity % 100,
                sale: hit.free_shipping,
                // eslint-disable-next-line @typescript-eslint/camelcase
                sale_price: hit.free_shipping
                  ? (hit.price - hit.price / 10).toFixed(2)
                  : hit.price,
              })).concat(imdbHits);
            }
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Products &amp; Movies</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            if (item.title) {
              return item.title;
            }

            return (
              <ProductItem
                hit={item}
                components={components}
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
      {
        sourceId: 'soccer',
        getItems() {
          return getAlgoliaResults({
            searchClient: searchClient2,
            queries: [
              {
                indexName: 'world-cup-2018',
                query,
                params: {
                  clickAnalytics: true,
                  hitsPerPage: 5,
                },
              },
            ],
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">World Cup</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return (
              <div className="aa-ItemContent">
                <div className="aa-ItemContentTitle">
                  <components.Highlight hit={item} attribute="home_team" /> –{' '}
                  <components.Highlight hit={item} attribute="away_team" />
                </div>
              </div>
            );
          },
          noResults() {
            return (
              <div className="aa-ItemContent">No games for this query.</div>
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
  components: AutocompleteComponents;
};

function ProductItem({ hit, insights, components }: ProductItemProps) {
  return (
    <Fragment>
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <img src={hit.image} alt={hit.name} width="40" height="40" />
        </div>

        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Snippet hit={hit} attribute="name" />
          </div>
          <div className="aa-ItemContentDescription">
            By <strong>{hit.brand}</strong> in{' '}
            <strong>{hit.categories[0]}</strong>
          </div>

          <div
            className="aa-ItemContentDescription"
            style={{
              display: 'grid',
              gridAutoFlow: 'column',
              justifyContent: 'start',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {hit.rating > 0 && (
              <div className="aa-ItemContentDescription">
                <div
                  style={{
                    color: 'rgba(var(--aa-muted-color-rgb), 0.5)',
                  }}
                >
                  {Array.from({ length: 5 }, (_value, index) => {
                    const isFilled = hit.rating >= index + 1;

                    return (
                      <svg
                        key={index}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={isFilled ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    );
                  })}
                </div>
              </div>
            )}
            <div
              style={{
                display: 'grid',
                gridAutoFlow: 'column',
                justifyContent: 'start',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: 'relative',
                  top: '1px',
                }}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{hit.comments.toLocaleString()}</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridAutoFlow: 'column',
                justifyContent: 'start',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div>
                <span
                  style={{
                    color: '#000',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                  }}
                >
                  ${hit.sale_price.toLocaleString()}
                </span>{' '}
                {hit.sale && (
                  <span
                    style={{
                      color: 'rgb(var(--aa-muted-color-rgb))',
                      fontSize: '0.9em',
                      textDecoration: 'line-through',
                    }}
                  >
                    ${hit.price.toLocaleString()}
                  </span>
                )}
              </div>
              {hit.sale && (
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '0.64em',
                    background: '#539753',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 9999,
                    padding: '2px 6px',
                    display: 'inline-block',
                    lineHeight: '1.25em',
                  }}
                >
                  On sale
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
          type="button"
          title="Select"
          disabled={true}
          style={{
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
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
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 5h-14l1.5-2h11zM21.794 5.392l-2.994-3.992c-0.196-0.261-0.494-0.399-0.8-0.4h-12c-0.326 0-0.616 0.156-0.8 0.4l-2.994 3.992c-0.043 0.056-0.081 0.117-0.111 0.182-0.065 0.137-0.096 0.283-0.095 0.426v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.219-0.071-0.422-0.189-0.585-0.004-0.005-0.007-0.010-0.011-0.015zM4 7h16v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707zM15 10c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121c0-0.552-0.448-1-1-1s-1 0.448-1 1c0 1.38 0.561 2.632 1.464 3.536s2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
          </svg>
        </button>
      </div>
    </Fragment>
  );
}
