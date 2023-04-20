/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import algoliasearch from 'algoliasearch/lite';
import qs from 'qs';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Configure,
  connectSearchBox,
  HierarchicalMenu,
  Hits,
  InstantSearch,
  Pagination,
  Panel,
  Snippet,
} from 'react-instantsearch-dom';

import { Autocomplete } from './Autocomplete';

import '@algolia/autocomplete-theme-classic/dist/theme.css';
import './App.css';

export const INSTANT_SEARCH_INDEX_NAME = 'instant_search';
export const INSTANT_SEARCH_QUERY_SUGGESTIONS =
  'instant_search_demo_query_suggestions';
export const INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES = [
  'hierarchicalCategories.lvl0',
  'hierarchicalCategories.lvl1',
];

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

function createURL(searchState) {
  return qs.stringify(searchState, { addQueryPrefix: true });
}

function searchStateToUrl({ location }, searchState) {
  if (Object.keys(searchState).length === 0) {
    return '';
  }

  // Remove configure search state from query parameters
  const { configure, ...rest } = searchState;
  return `${location.pathname}${createURL(rest)}`;
}

function urlToSearchState({ search }) {
  return qs.parse(search.slice(1));
}

const VirtualSearchBox = connectSearchBox(() => null);

export function App() {
  const [searchState, setSearchState] = useState(() =>
    urlToSearchState(window.location)
  );
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      window.history.pushState(
        searchState,
        null,
        searchStateToUrl({ location: window.location }, searchState)
      );
    }, 400);
  }, [searchState]);

  const currentCategory = useMemo(
    () =>
      searchState?.hierarchicalMenu?.[
        INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]
      ] || '',
    [searchState]
  );

  const onSubmit = useCallback(({ state }) => {
    setSearchState((searchState) => ({
      ...searchState,
      query: state.query,
    }));
  }, []);
  const onReset = useCallback(() => {
    setSearchState((searchState) => ({
      ...searchState,
      query: '',
      hierarchicalMenu: {
        [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]]: '',
      },
    }));
  }, []);

  const plugins = useMemo(() => {
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'search',
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          onSelect({ item }) {
            setSearchState((searchState) => ({
              ...searchState,
              query: item.label,
              hierarchicalMenu: {
                [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]]:
                  item.category || '',
              },
            }));
          },
        };
      },
    });

    const querySuggestionsInCategoryPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
      getSearchParams() {
        return recentSearchesPlugin.data.getAlgoliaSearchParams({
          hitsPerPage: 3,
          facetFilters: [
            `${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]}.value:${currentCategory}`,
          ],
        });
      },
      transformSource({ source }) {
        return {
          ...source,
          sourceId: 'querySuggestionsInCategoryPlugin',
          onSelect({ item }) {
            setSearchState((searchState) => ({
              ...searchState,
              query: item.query,
              hierarchicalMenu: {
                [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]]:
                  item.__autocomplete_qsCategory || '',
              },
            }));
          },
          getItems(params) {
            if (currentCategory.length === 0) {
              return [];
            }

            return source.getItems(params);
          },
          templates: {
            ...source.templates,
            header({ items }) {
              if (items.length === 0) {
                return <></>;
              }

              return (
                <>
                  <span className="aa-SourceHeaderTitle">
                    In {currentCategory}
                  </span>
                  <span className="aa-SourceHeaderLine" />
                </>
              );
            },
          },
        };
      },
    });

    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
      getSearchParams() {
        if (currentCategory.length === 0) {
          return recentSearchesPlugin.data.getAlgoliaSearchParams({
            hitsPerPage: 6,
          });
        }

        return recentSearchesPlugin.data.getAlgoliaSearchParams({
          hitsPerPage: 3,
          facetFilters: [
            `${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.${INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]}.value:-${currentCategory}`,
          ],
        });
      },
      categoryAttribute: [
        INSTANT_SEARCH_INDEX_NAME,
        'facets',
        'exact_matches',
        INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0],
      ],
      transformSource({ source }) {
        return {
          ...source,
          sourceId: 'querySuggestionsPlugin',
          onSelect({ item }) {
            setSearchState((searchState) => ({
              ...searchState,
              query: item.query,
              hierarchicalMenu: {
                [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES[0]]:
                  item.__autocomplete_qsCategory || '',
              },
            }));
          },
          getItems(params) {
            if (!params.state.query) {
              return [];
            }

            return source.getItems(params);
          },
          templates: {
            ...source.templates,
            header({ items }) {
              if (currentCategory.length === 0 || items.length === 0) {
                return <></>;
              }

              return (
                <>
                  <span className="aa-SourceHeaderTitle">
                    In other categories
                  </span>
                  <span className="aa-SourceHeaderLine" />
                </>
              );
            },
          },
        };
      },
    });

    return [
      recentSearchesPlugin,
      querySuggestionsInCategoryPlugin,
      querySuggestionsPlugin,
    ];
  }, [currentCategory]);

  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName={INSTANT_SEARCH_INDEX_NAME}
        searchState={searchState}
        onSearchStateChange={setSearchState}
        createURL={createURL}
      >
        <header className="header">
          <div className="header-wrapper wrapper">
            <nav className="header-nav">
              <a href="/">Home</a>
            </nav>
            {/* A virtual search box is required for InstantSearch to understand the `query` search state property */}
            <VirtualSearchBox />
            <Autocomplete
              placeholder="Search products"
              detachedMediaQuery="none"
              initialState={{
                query: searchState.query,
              }}
              openOnFocus={true}
              onSubmit={onSubmit}
              onReset={onReset}
              plugins={plugins}
              insights
            />
          </div>
        </header>

        <Configure
          attributesToSnippet={['name:7', 'description:15']}
          snippetEllipsisText="…"
        />
        <div className="container wrapper">
          <div>
            <Panel header="Categories">
              <HierarchicalMenu
                attributes={INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES}
              />
            </Panel>
          </div>
          <div>
            <Hits hitComponent={Hit} />
            <Pagination />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}

function Hit({ hit }) {
  return (
    <article className="hit">
      <div className="hit-image">
        <img src={hit.image} alt={hit.name} />
      </div>
      <div>
        <h1>
          <Snippet hit={hit} attribute="name" />
        </h1>
        <div>
          By <strong>{hit.brand}</strong> in{' '}
          <strong>{hit.categories[0]}</strong>
        </div>
      </div>
    </article>
  );
}
