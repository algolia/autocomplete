---
id: createQuerySuggestionsPlugin
---

The Query Suggestions plugin adds [Algolia Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) to your autocomplete.

## Installation

First, you need to install the plugin.

```bash
yarn add @algolia/autocomplete-plugin-query-suggestions@alpha
# or
npm install @algolia/autocomplete-plugin-query-suggestions@alpha
```

Then import it in your project:

```js
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
```

If you don't use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-plugin-query-suggestions@alpha"></script>
```

## Example

This example uses the plugin within [`autocomplete-js`](autocomplete-js), along with the [`algoliasearch`](https://www.npmjs.com/package/algoliasearch) API client.

```js
import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
});

autocomplete({
  container: '#autocomplete',
  plugins: [querySuggestionsPlugin],
});
```

You can combine this plugin with the [Recent Searches](createLocalStorageRecentSearchesPlugin) plugin to leverage the empty screen with recent and popular queries.

```js
import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
});
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
    return recentSearches.data.getAlgoliaSearchParams();
  },
});

autocomplete({
  container: '#autocomplete',
  openOnFocus: true,
  plugins: [recentSearchesPlugin, querySuggestionsPlugin],
});
```

To see it in action, check [this demo on CodeSandbox](https://fzb4m.csb.app/).

## Parameters

### `searchClient`

> `SearchClient` | required

The initialized Algolia search client.

### `indexName`

> `string` | required

The index name.

### `getSearchParams`

> `(params: { state: AutocompleteState }) => SearchParameters`

A function returning [Algolia search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/).

### `transformSource`

> `(params: { source: AutocompleteSource, onTapAhead: () => void })`

A function to transform the provided source.

#### Examples

Keeping the panel open on select:

```jsx
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  transformSource({ source, onTapAhead }) {
    return {
      ...source,
      onSelect({ setIsOpen }) {
        setIsOpen(true);
      },
    };
  },
});
```

Opening a link:

```jsx
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  transformSource({ source, onTapAhead }) {
    return {
      ...source,
      getItemUrl({ item }) {
        return `https://google.com?q=${item.query}`;
      },
      templates: {
        ...source.templates,
        item(params) {
          const { item } = params;
          return (
            <a
              className="aa-ItemLink"
              href={`https://google.com?q=${item.query}`}
            >
              {source.templates.item(params)}
            </a>
          );
        },
      },
    };
  },
});
```

### `categoryAttribute`

> `string | string[]`

The attribute or attribute path to display categories for.

#### Example

```js
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  categoryAttribute: [
    'instant_search',
    'facets',
    'exact_matches',
    'hierarchicalCategories.lvl0',
  ],
});
```

### `itemsWithCategories`

> `number` | defaults to `1`

How many items to display categories for.

### `categoriesPerItem`

> `number` | defaults to `1`

The number of categories to display per item.
