/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { h, Fragment } from 'preact';

import {
  debouncedSetInstantSearchUiState,
  getInstantSearchActiveCategory,
  getInstantSearchUiState,
  getInstantSearchUrl,
  hierarchicalAttribute,
  instantSearchIndexName,
  setInstantSearchUiState,
} from './instantsearch';
import { isModifierEvent } from './isModifierEvent';
import { searchClient } from './searchClient';

function onSelect({ setIsOpen, setQuery, event, query, category }) {
  // We support selecting an item with a modifier key so that it doesn't
  // reflect on the current tab.
  if (isModifierEvent(event)) {
    return;
  }

  setQuery(query);
  setIsOpen(false);
  setInstantSearchUiState({
    query,
    hierarchicalMenu: {
      [hierarchicalAttribute]: [category],
    },
  });
}

function getItemUrl({ query, category }) {
  return getInstantSearchUrl({
    query,
    hierarchicalMenu: {
      [hierarchicalAttribute]: [category],
    },
  });
}

function ItemWrapper({ children, query, category }) {
  const uiState = {
    query,
    hierarchicalMenu: {
      [hierarchicalAttribute]: [category],
    },
  };

  return (
    <a
      className="aa-ItemLink"
      href={getInstantSearchUrl(uiState)}
      onClick={(event) => {
        if (!isModifierEvent(event)) {
          // We bypass the original link behavior if there's no event modifier
          // to set the InstantSearch UI state without reloading the page.
          event.preventDefault();
        }
      }}
    >
      {children}
    </a>
  );
}

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'instantsearch',
  limit: 3,
  transformSource({ source }) {
    return {
      ...source,
      getItemUrl({ item }) {
        return getItemUrl({
          query: item.label,
          category: item.category,
        });
      },
      onSelect({ setIsOpen, setQuery, item, event }) {
        onSelect({
          setQuery,
          setIsOpen,
          event,
          query: item.label,
          category: item.category,
        });
      },
      templates: {
        ...source.templates,
        item(params) {
          const { children } = (source.templates.item(params) as any).props;

          return (
            <ItemWrapper
              query={params.item.label}
              category={params.item.category}
            >
              {children}
            </ItemWrapper>
          );
        },
      },
    };
  },
});

const querySuggestionsPluginInCategory = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
    const activeCategory = getInstantSearchActiveCategory();

    return recentSearchesPlugin.data.getAlgoliaSearchParams({
      hitsPerPage: activeCategory ? 3 : 6,
      facetFilters: [
        `${instantSearchIndexName}.facets.exact_matches.${hierarchicalAttribute}.value:${activeCategory}`,
      ],
    });
  },
  transformSource({ source }) {
    const activeCategory = getInstantSearchActiveCategory();

    return {
      ...source,
      sourceId: 'querySuggestionsPluginInCategory',
      getItemUrl({ item }) {
        return getItemUrl({
          query: item.query,
          category: activeCategory,
        });
      },
      onSelect({ setIsOpen, setQuery, event, item }) {
        onSelect({
          setQuery,
          setIsOpen,
          event,
          query: item.query,
          category: activeCategory,
        });
      },
      getItems(params) {
        if (!activeCategory) {
          return [];
        }

        return source.getItems(params);
      },
      templates: {
        ...source.templates,
        header({ items }) {
          if (items.length === 0) {
            return null;
          }

          return (
            <Fragment>
              <span className="aa-SourceHeaderTitle">In {activeCategory}</span>
              <div className="aa-SourceHeaderLine" />
            </Fragment>
          );
        },
        item(params) {
          const { children } = (source.templates.item(params) as any).props;

          return (
            <ItemWrapper query={params.item.query} category={activeCategory}>
              {children}
            </ItemWrapper>
          );
        },
      },
    };
  },
});

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
    const activeCategory = getInstantSearchActiveCategory();

    return recentSearchesPlugin.data.getAlgoliaSearchParams({
      hitsPerPage: activeCategory ? 3 : 6,
      facetFilters: [
        `${instantSearchIndexName}.facets.exact_matches.${hierarchicalAttribute}.value:-${activeCategory}`,
      ],
    });
  },
  categoryAttribute: [
    instantSearchIndexName,
    'facets',
    'exact_matches',
    hierarchicalAttribute,
  ],
  transformSource({ source }) {
    const activeCategory = getInstantSearchActiveCategory();

    return {
      ...source,
      sourceId: 'querySuggestionsPlugin',
      getItemUrl({ item }) {
        return getItemUrl({
          query: item.query,
          category: item.__autocomplete_qsCategory,
        });
      },
      onSelect({ setIsOpen, setQuery, event, item }) {
        onSelect({
          setQuery,
          setIsOpen,
          event,
          query: item.query,
          category: item.__autocomplete_qsCategory,
        });
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
          if (!activeCategory || items.length === 0) {
            return null;
          }

          return (
            <Fragment>
              <span className="aa-SourceHeaderTitle">In other categories</span>
              <div className="aa-SourceHeaderLine" />
            </Fragment>
          );
        },
        item(params) {
          const { children } = (source.templates.item(params) as any).props;

          return (
            <ItemWrapper
              query={params.item.query}
              category={params.item.__autocomplete_qsCategory}
            >
              {children}
            </ItemWrapper>
          );
        },
      },
    };
  },
});

const searchPageState = getInstantSearchUiState();

export function startAutocomplete() {
  autocomplete({
    container: '#autocomplete',
    placeholder: 'Search for products',
    openOnFocus: true,
    plugins: [
      recentSearchesPlugin,
      querySuggestionsPluginInCategory,
      querySuggestionsPlugin,
    ],
    detachedMediaQuery: 'none',
    initialState: {
      query: searchPageState.query || '',
    },
    navigator: {
      navigate() {
        // We don't navigate to a new page because we leverage the InstantSearch
        // UI state API.
      },
    },
    onSubmit({ state }) {
      setInstantSearchUiState({ query: state.query });
    },
    onReset() {
      setInstantSearchUiState({
        query: '',
        hierarchicalMenu: {
          [hierarchicalAttribute]: [],
        },
      });
    },
    onStateChange({ prevState, state }) {
      if (prevState.query !== state.query) {
        debouncedSetInstantSearchUiState({ query: state.query });
      }
    },
  });
}
