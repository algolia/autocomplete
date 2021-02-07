---
id: createRecentSearchesPlugin
---

## Example

```ts
import { autocomplete } from '@algolia/autocomplete-js';
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

const recentSearchesPlugin = createRecentSearchesPlugin({
  // Implement your own storage
  storage: {
    getAll() {},
    onAdd() {},
    onRemove() {},
  },
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
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const recentSearchesPlugin = createRecentSearchesPlugin({
  // Implement your own storage
  storage: {
    getAll() {},
    onAdd() {},
    onRemove() {},
  },
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
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
```

## Params

### `storage`

> `RecentSearchesStorage` | required

```ts
type RecentSearchesItem = {
  id: string;
  query: string;
};
type RecentSearchesStorage<TItem extends RecentSearchesItem> = {
  onAdd(item: TItem): void;
  onRemove(id: string): void;
  getAll(query?: string): MaybePromise<Array<Highlighted<TItem>>>;
};
```

### `transformSource`

> `(params: { source: AutocompleteSource, onRemove: () => void })`

#### Example

Keeping the panel open on select:

```tsx
const recentSearchesPlugin = createRecentSearchesPlugin({
  storage,
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
const recentSearchesPlugin = createRecentSearchesPlugin({
  storage,
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
