---
id: sources
title: Sources
---

Sources are data that describes the suggestions and their behavior.

## Examples

### Using static sources

Static sources means that whatever the autocomplete state is, the same sources are always returned.

```ts
const autocomplete = createAutocomplete({
  getSources() {
    return [
      {
        getItems() {
          return [
            { label: 'Twitter', url: 'https://twitter.com' },
            { label: 'GitHub', url: 'https://github.com' },
          ];
        },
        getItemUrl({ item }) {
          return item.url;
        },
      },
    ];
  },
});
```

### Searching in static sources

You can search within your sources to update them as the user types:

```ts
const autocomplete = createAutocomplete({
  getSources() {
    return [
      {
        getItems({ query }) {
          return [
            { label: 'Twitter', url: 'https://twitter.com' },
            { label: 'GitHub', url: 'https://github.com' },
          ].filter((item) => item.toLowerCase().includes(query.toLowerCase()));
        },
        getItemUrl({ item }) {
          return item.url;
        },
      },
    ];
  },
});
```

To bring more search capabilities, you can plug an Algolia index:

```ts
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocomplete = createAutocomplete({
  getSources() {
    return [
      {
        getItems({ query }) {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
              },
            ],
          });
        },
        getItemUrl({ item }) {
          return item.url;
        },
      },
    ];
  },
});
```

You can notice that `getItems` supports [promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise).

### Using dynamic sources based on query

A common pattern is to display a different source when the query is empty, and when the user started typing.

```ts
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocomplete = createAutocomplete({
  getSources({ query }) {
    if (!query) {
      [
        {
          getItems() {
            return [
              { label: 'Twitter', url: 'https://twitter.com' },
              { label: 'GitHub', url: 'https://github.com' },
            ];
          },
          getItemUrl({ item }) {
            return item.url;
          },
        },
      ];
    }

    return [
      {
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
              },
            ],
          });
        },
        getItemUrl({ item }) {
          return item.url;
        },
      },
    ];
  },
});
```

You can notice that we can **get the `query` from the `getSources` function to conditionally return sources**.

This pattern can be extended to display recent searches on empty query, and search results when a query is typed. You can compute dynamic sources based on the complete autocomplete state, not only the query.

### Using asynchronous sources

`getSources` also supports promises, which means that you can fetch your sources from an asynchronous API:

```ts
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocomplete = createAutocomplete({
  getSources({ query }) {
    return getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'instant_search_demo_query_suggestions',
          query,
        },
        {
          indexName: 'instant_search',
          query,
        },
      ],
    }).then((results) => {
      const [querySuggestions, products] = results;

      return [
        {
          getItems() {
            return querySuggestions.hits;
          },
          getItemInputValue: ({ item }) => item.query,
        },
        {
          getItems() {
            return products.hits;
          },
          getItemUrl({ item }) {
            return item.url;
          },
        },
      ];
    });
  },
});
```

This pattern can be used to store data in the [context](context) before returning the sources.

## Reference

### `getSources`

> `(params: { query: string, state: AutocompleteState, ...setters: Autocomplete Setters }) => Array<AutocompleteSource> | Promise<Array<AutocompleteSource>>`

The function to fetch the sources and their behaviors.

A source is described by the following properties:

### `getItems`

> `(params: { query: string, state: AutocompleteState, ...setters }) => Suggestion[] | Promise<Suggestion[]>` | **required**

Called when the input changes. You can use this function to filter/search the items based on the query.

```ts
const items = [{ value: 'Apple' }, { value: 'Banana' }];

const source = {
  getItems({ query }) {
    return items.filter((item) => item.value.includes(query));
  },
  // ...
};
```

### `getItemInputValue`

> `(params: { item, state: AutocompleteState }) => string` | defaults to `({ state }) => state.query`

Called to get the value of the item. The value is used to fill the search box.

If you do not wish to update the input value when an item is selected, you can return `state.query`.

```ts
const items = [{ value: 'Apple' }, { value: 'Banana' }];

const source = {
  getItemInputValue: ({ item }) => item.value,
  // ...
};
```

### `getItemUrl`

> `(params: { item: Item, state: AutocompleteState }) => string | undefined`

Called to get the URL of the item. The value is used to add [keyboard accessibility](keyboard-navigation) features to allow to open items in the current tab, in a new tab or in a new window.

```ts
const items = [
  { value: 'Google', url: 'https://google.com' },
  { value: 'Amazon', url: 'https://amazon.com' },
];

const source = {
  getItemUrl({ item }) {
    return item.url;
  },
  // ...
};
```

### `onSelect`

> `(params: { state: AutocompleteState, ...setters, event: Event, item: TItem, itemInputValue: string, itemUrl: string, source: AutocompleteSource }) => void` | defaults to `({ setIsOpen }) => setIsOpen(false)`

Called when an item is selected.

### `onHighlight`

> `(params: { state: AutocompleteState, ...setters, event: Event, item: TItem, itemInputValue: string, itemUrl: string, source: AutocompleteSource }) => void`

Called when an item is selected.

You can trigger different behaviors with a mouse highlight and a keyboard highlight based on the `event`.

### `templates` (specific to `@algolia/autocomplete-js`)

> `SourceTemplate`

The `@algolia/autocomplete-js` supports source templates.

A template can either return a string, or perform DOM mutations (manipulating DOM elements with JavaScript and attaching events) without returning a string.

```ts title="SourceTemplate"
type SourceTemplate = {
  item: Template<{
    root: HTMLElement;
    item: TItem;
    state: AutocompleteState<TItem>;
  }>;
  header?: Template<{ root: HTMLElement; state: AutocompleteState<TItem> }>;
  footer?: Template<{ root: HTMLElement; state: AutocompleteState<TItem> }>;
};
```

```ts title="Example"
import algoliasearch from 'algoliasearch/lite';
import {
  autocomplete,
  getAlgoliaHits,
  reverseHighlightHit,
} from '@algolia/autocomplete-js';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocompleteSearch = autocomplete({
  container: '#autocomplete',
  getSources() {
    return [
      {
        getItemInputValue: ({ item }) => item.query,
        getItems({ query }) {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'instant_search_demo_query_suggestions',
                query,
                params: {
                  hitsPerPage: 4,
                },
              },
            ],
          });
        },
        templates: {
          header() {
            return 'Suggestions';
          },
          item({ item }) {
            return reverseHighlightHit({ hit: item, attribute: 'query' });
          },
          footer() {
            return 'Footer';
          },
        },
      },
    ];
  },
});
```
