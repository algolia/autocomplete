---
id: sources
title: Sources
---

Sources are data that describes the suggestions and their behavior.

# Guides

## Using static sources

Static sources means that whatever the autocomplete state is, the same sources are always returned.

```ts
const autocomplete = createAutocomplete({
  getSources() {
    return [
      {
        getSuggestions() {
          return [
            { label: 'Twitter', url: 'https://twitter.com' },
            { label: 'GitHub', url: 'https://github.com' },
          ];
        },
        getSuggestionUrl: ({ suggestion }) => suggestion.url,
      },
    ];
  },
});
```

## Searching in static sources

You can search within your sources to update them as the user types:

```ts
const autocomplete = createAutocomplete({
  getSources() {
    return [
      {
        getSuggestions({ query }) {
          return [
            { label: 'Twitter', url: 'https://twitter.com' },
            { label: 'GitHub', url: 'https://github.com' },
          ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
        },
        getSuggestionUrl: ({ suggestion }) => suggestion.url,
      },
    ];
  },
});
```

To bring more search capabilities, you can plug an Algolia index:

```ts {15-23}
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@francoischalifour/autocomplete-core';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocomplete = createAutocomplete({
  getSources() {
    return [
      {
        getSuggestions({ query }) {
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
        getSuggestionUrl: ({ suggestion }) => suggestion.url,
      },
    ];
  },
});
```

You can notice that `getSuggestions` supports [promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## Using dynamic sources based on query

A common pattern is to display a different source when the query is empty, and when the user started typing.

```ts {11-24}
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@francoischalifour/autocomplete-core';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocomplete = createAutocomplete({
  getSources({ query }) {
    if (!query) {
      [
        {
          getSuggestions() {
            return [
              { label: 'Twitter', url: 'https://twitter.com' },
              { label: 'GitHub', url: 'https://github.com' },
            ];
          },
          getSuggestionUrl: ({ suggestion }) => suggestion.url,
        },
      ];
    }

    return [
      {
        getSuggestions() {
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
        getSuggestionUrl: ({ suggestion }) => suggestion.url,
      },
    ];
  },
});
```

You can notice that we can **get the `query` from the `getSources` function to conditionally return sources**.

This pattern can be extended to display recent searches on empty query, and search results when a query is typed. You can compute dynamic sources based on the complete autocomplete state, not only the query.

## Using asynchronous sources

`getSources` also supports promises, which means that you can fetch your sources from an asynchronous API:

```ts {12-41}
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@francoischalifour/autocomplete-core';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';

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
    }).then(results => {
      const [querySuggestions, products] = results;

      return [
        {
          getSuggestions() {
            return querySuggestions.hits;
          },
          getInputValue: ({ suggestion }) => suggestion.query,
        },
        {
          getSuggestions() {
            return products.hits;
          },
          getSuggestionUrl: ({ suggestion }) => suggestion.url,
        },
      ];
    });
  },
});
```

This pattern can be used to store data in the [context](context) before returning the sources.

# Reference

## `getSources`

> `(params: { query: string, state: AutocompleteState, ...setters: Autocomplete Setters }) => Array<AutocompleteSource> | Promise<Array<AutocompleteSource>>`

The function to fetch the sources and their behaviors.

## `AutocompleteSource`

This is the type that describes a source.

### `getSuggestions`

> `(params: { query: string, state: AutocompleteState, ...setters }) => Suggestion[] | Promise<Suggestion[]>` | **required**

Called when the input changes. You can use this function to filter/search the items based on the query.

```ts
const items = [{ value: 'Apple' }, { value: 'Banana' }];

const source = {
  getSuggestions({ query }) {
    return items.filter(item => item.value.includes(query));
  },
  // ...
};
```

### `getInputValue`

> `(params: { suggestion, state: AutocompleteState }) => string` | defaults to `({ state }) => state.query`

Called to get the value of the suggestion. The value is used to fill the search box.

If you do not wish to update the input value when an item is selected, you can return `state.query`.

```ts
const items = [{ value: 'Apple' }, { value: 'Banana' }];

const source = {
  getInputValue: ({ suggestion }) => suggestion.value,
  // ...
};
```

### `getSuggestionUrl`

> `(params: { suggestion: Suggestion, state: AutocompleteState }) => string | undefined`

Called to get the URL of the suggestion. The value is used to add [keyboard accessibility](keyboard-navigation) features to allow to open suggestions in the current tab, in a new tab or in a new window.

```ts
const items = [
  { value: 'Google', url: 'https://google.com' },
  { value: 'Amazon', url: 'https://amazon.com' },
];

const source = {
  getSuggestionUrl: ({ suggestion }) => suggestion.url,
  // ...
};
```

### `onSelect`

> `(params: { state: AutocompleteState, ...setters, event }) => void` | defaults to `({ setIsOpen }) => setIsOpen(false)`

Called when an item is selected.

### `onHighlight`

> `(params: { state: AutocompleteState, ...setters, event }) => void`

Called when an item is selected.

You can trigger different behaviors with a mouse highlight and a keyboard highlight based on the `event`.
