---
id: createLocalStorageRecentSearchesPlugin
---

## Example

```ts
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

With [Query Suggestions](createQuerySuggestionsPlugin):

```ts
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

## Import

```ts
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
```

## Params

### `key`

> `string` | required

The Local Storage key (prefixed by the plugin) to identify where to store and retrieve the recent searches.

Examples:

- `"navbar"`
- `"search"`
- `"main"`

### `limit`

> `number`

The number of recent searches to display.

### `search`

> `(params: { query: string; items: TItem[]; limit: number; }) => TItem[]`

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

> `(params: { source: AutocompleteSource, onRemove: () => void })`

#### Example

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
