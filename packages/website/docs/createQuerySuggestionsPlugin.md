---
id: createQuerySuggestionsPlugin
---

## Example

```ts
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

With [Recent Searches](createLocalStorageRecentSearchesPlugin):

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
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
```

## Params

### `searchClient`

> `SearchClient` | required

### `indexName`

> `string` | required

### `getSearchParams`

> [`() => SearchParameters`](https://www.algolia.com/doc/api-reference/search-api-parameters/)

### `transformSource`

> `(params: { source: AutocompleteSource, onTapAhead: () => void })`

#### Example

Keeping the panel open on select:

```tsx
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

```tsx
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
