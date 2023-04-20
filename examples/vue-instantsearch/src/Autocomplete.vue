<template>
  <div ref="autocompleteContainer"></div>
</template>

<script lang="jsx">
import { Fragment, render } from 'vue';

import { createWidgetMixin } from 'vue-instantsearch/vue3/es';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

import '@algolia/autocomplete-theme-classic';

import { createElement } from './utils/createElement';
import {
  INSTANT_SEARCH_INDEX_NAME,
  INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE,
} from './constants';
import { searchClient } from './searchClient';

function debounce(fn, time) {
  let timerId;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => fn(...args), time);
  };
}

export default {
  mixins: [createWidgetMixin({ connector: connectSearchBox })],
  mounted() {
    const { instantSearchInstance } = this;
    function getInstantSearchCurrentCategory() {
      const indexRenderState =
        instantSearchInstance.renderState[INSTANT_SEARCH_INDEX_NAME];

      const refinedCategory = indexRenderState?.hierarchicalMenu?.[
        INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE
      ]?.items?.find(({ isRefined }) => isRefined);

      return refinedCategory?.value;
    }

    function setInstantSearchUiState({
      query,
      category,
      resetCategory = false,
    }) {
      let hierarchicalMenu;
      if (resetCategory) {
        hierarchicalMenu = {
          hierarchicalMenu: { [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE]: [] },
        };
      } else if (!category) {
        hierarchicalMenu = {};
      } else {
        hierarchicalMenu = {
          hierarchicalMenu: {
            [INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE]: [category],
          },
        };
      }

      instantSearchInstance.setUiState((uiState) => ({
        ...uiState,
        [INSTANT_SEARCH_INDEX_NAME]: {
          ...uiState[INSTANT_SEARCH_INDEX_NAME],
          page: 1,
          query,
          ...hierarchicalMenu,
        },
      }));
    }

    const debouncedSetInstantSearchUiState = debounce(
      setInstantSearchUiState,
      500
    );

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'instantsearch',
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          onSelect({ item }) {
            setInstantSearchUiState({
              query: item.label,
              category: item.category,
            });
          },
        };
      },
    });

    const querySuggestionPluginInCategory = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'instant_search_demo_query_suggestions',
      getSearchParams() {
        const currentCategory = getInstantSearchCurrentCategory();
        return recentSearchesPlugin.data.getAlgoliaSearchParams({
          hitsPerPage: 3,
          facetFilters: [
            `${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.categories.value:${currentCategory}`,
          ],
        });
      },
      transformSource({ source }) {
        const currentCategory = getInstantSearchCurrentCategory();

        return {
          ...source,
          sourceId: 'querySuggestionsPluginInCategory',
          onSelect({ item }) {
            setInstantSearchUiState({
              query: item.query,
              category: currentCategory,
            });
          },
          getItems(params) {
            if (!currentCategory) {
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
                  <span className="aa-SourceHeaderTitle">
                    In {currentCategory}
                  </span>
                  <span className="aa-SourceHeaderLine"></span>
                </Fragment>
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
        const currentCategory = getInstantSearchCurrentCategory();

        if (!currentCategory) {
          return recentSearchesPlugin.data.getAlgoliaSearchParams({
            hitsPerPage: 6,
          });
        }

        return recentSearchesPlugin.data.getAlgoliaSearchParams({
          hitsPerPage: 3,
          facetFilters: [
            `${INSTANT_SEARCH_INDEX_NAME}.facets.exact_matches.categories.value:-${currentCategory}`,
          ],
        });
      },
      categoryAttribute: [
        'instant_search',
        'facets',
        'exact_matches',
        INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE,
      ],
      transformSource({ source }) {
        const currentCategory = getInstantSearchCurrentCategory();

        return {
          ...source,
          sourceId: 'querySuggestionsPlugin',
          onSelect({ item }) {
            setInstantSearchUiState({
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
              if (!currentCategory || items.length === 0) {
                return null;
              }

              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">
                    In other categories
                  </span>
                  <span className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
          },
        };
      },
    });

    const initialState =
      instantSearchInstance.mainIndex.getHelper()?.state || {};

    this.autocompleteInstance = autocomplete({
      container: this.$refs.autocompleteContainer,
      placeholder: 'Search for products',
      detachedMediaQuery: 'none',
      openOnFocus: true,
      insights: true,
      plugins: [
        recentSearchesPlugin,
        querySuggestionPluginInCategory,
        querySuggestionsPlugin,
      ],
      initialState: { query: initialState.query || '' },
      onSubmit({ state }) {
        setInstantSearchUiState({ query: state.query });
      },
      onReset() {
        setInstantSearchUiState({ query: '', resetCategory: true });
      },
      onStateChange({ prevState, state }) {
        if (prevState.query !== state.query) {
          debouncedSetInstantSearchUiState({ query: state.query });
        }
      },
      renderer: {
        createElement,
        Fragment,
        render,
      },
    });
  },
  beforeUnmount() {},
};
</script>
