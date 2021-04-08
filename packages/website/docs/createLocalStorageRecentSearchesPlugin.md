---
id: createLocalStorageRecentSearchesPlugin
---

The Recent Searches plugin displays a list of the latest searches the user made.

The `createLocalStorageRecentSearchesPlugin` plugin connects with the user's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to fetch and save recent searches. To plug your own storage, check [`createRecentSearchesPlugin`](createRecentSearchesPlugin).

## Installation

First, you need to install the plugin.

```bash
yarn add @algolia/autocomplete-plugin-recent-searches@alpha
# or
npm install @algolia/autocomplete-plugin-recent-searches@alpha
```

Then import it in your project:

```js
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
```

If you don't use a package manager, you can use the HTML `script` element:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-plugin-recent-searches@alpha"></script>
<script>
  const { createRecentSearchesPlugin } = window[
    '@algolia/autocomplete-plugin-recent-searches'
  ];
</script>
```

## Example

This example uses the plugin within [`autocomplete-js`](autocomplete-js).

```js
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
});

autocomplete({
  container: '#autocomplete',
  openOnFocus: true,
  plugins: [recentSearchesPlugin],
});
```

You can combine this plugin with the [Query Suggestions](createQuerySuggestionsPlugin) plugin to leverage the empty screen with recent and popular queries.

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

### `key`

> `string` | required

A local storage key to identify where to save and retrieve the recent searches.

For example:

- `"navbar"`
- `"search"`
- `"main"`

The plugin namespaces all keys to avoid collisions.

### `limit`

> `number`

The number of recent searches to display.

### `search`

> `(params: { query: string; items: TItem[]; limit: number; }) => TItem[]`

A search function to retrieve recent searches from. This function is called in [`storage.getAll`](createRecentSearchesPlugin#storage) to retrieve recent searches and is useful to filter and highlight recent searches when typing a query.

#### Example

```ts
function highlight({ item, query }) {
  return {
    ...item,
    _highlightResult: {
      query: {
        value: query
          ? item.query.replace(
              new RegExp(query, 'g'),
              `__aa-highlight__${query}__/aa-highlight__`
            )
          : item.query,
      },
    },
  };
}

function search({ query, items, limit }) {
  if (!query) {
    return items.slice(0, limit).map((item) => highlight({ item, query }));
  }

  return items
    .filter((item) => item.query.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit)
    .map((item) => highlight({ item, query }));
}
```

### `transformSource`

> `(params: { source: AutocompleteSource, state: AutocompleteState, onRemove: () => void, onTapAhead: () => void })`

A function to transform the provided source.

#### Examples

Keeping the panel open on select:

```tsx
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
  transformSource({ source, onRemove }) {
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

```tsx
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
  transformSource({ source, onRemove }) {
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

## Returns

### `data`

#### `getAlgoliaSearchParams`

> `SearchParameters => SearchParameters`

Optimized [Algolia search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/). This is useful when using the plugin along with the [Query Suggestions](createQuerySuggestionsPlugin) plugin.

This function enhances the provided search parameters by:

- Excluding Query Suggestions that are already displayed in recent searches.
- Using a shared `hitsPerPage` value to get a group limit of Query Suggestions and recent searches.
