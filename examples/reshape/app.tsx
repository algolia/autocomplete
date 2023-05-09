/** @jsxRuntime classic */
/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { h, Fragment } from 'preact';
import { pipe } from 'ramda';

import '@algolia/autocomplete-theme-classic';

import { groupBy, limit, uniqBy } from './functions';
import { productsPlugin } from './productsPlugin';
import { searchClient } from './searchClient';

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'search',
  limit: 10,
});
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
    return {
      hitsPerPage: 10,
    };
  },
});

const dedupeAndLimitSuggestions = pipe(
  uniqBy(({ source, item }) =>
    source.sourceId === 'querySuggestionsPlugin' ? item.query : item.label
  ),
  limit(4)
);
const groupByCategory = groupBy((hit) => hit.categories[0], {
  getSource({ name, items }) {
    return {
      getItems() {
        return items.slice(0, 3);
      },
      templates: {
        header() {
          return (
            <Fragment>
              <span className="aa-SourceHeaderTitle">{name}</span>
              <div className="aa-SourceHeaderLine" />
            </Fragment>
          );
        },
      },
    };
  },
});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  debug: true,
  openOnFocus: true,
  insights: true,
  plugins: [recentSearchesPlugin, querySuggestionsPlugin, productsPlugin],
  reshape({ sourcesBySourceId }) {
    const { recentSearchesPlugin, querySuggestionsPlugin, products, ...rest } =
      sourcesBySourceId;

    return [
      dedupeAndLimitSuggestions(recentSearchesPlugin, querySuggestionsPlugin),
      groupByCategory(products),
      Object.values(rest),
    ];
  },
});
