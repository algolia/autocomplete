---
id: sources
title: Populating autocomplete with Sources
---

Sources define from where to retrieve items and their behavior.

**The most important aspect of an autocomplete experience is the items you display.** Most of the time they're search results to a query, but you could imagine many different usages.

Autocomplete gives you total freedom to return rich suggestions via the Sources API.

## Usage

### Using static sources

The most straightforward way to provide items is to return static sources. Each source returns a collection of items.

```js
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

Here, whatever the autocomplete state is, it always returns these two items.

### Searching in static sources

You can access the autocomplete state in your sources, meaning you can search within static sources to update them as the user types.

```js
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

Before moving on to more complex sources, let's take a closer look at the code.

Notice that the [`getSources`](#getsources) function returns an array of sources. Each source implements a [`getItems`](#getitems) function to return the items to display. These items can be a simple static array, but you can also use a function to refine items based on the query. **The [`getItems`](#getitems) function is called whenever the input changes.**

By default, autocomplete items are meant to be hyperlinks. To determine what URL to navigate to, you can implement a [`getItemURL`](#getitemurl) function. It enables the [keyboard accessibility](https://autocomplete.algolia.com/docs/keyboard-navigation) feature, allowing users to open items in the current tab, a new tab, or a new window from their keyboard.

### Using dynamic sources

Static sources can be useful, especially [when the user hasn't typed anything yet](#mixing-static-and-dynamic-sources-based-on-the-query). However, you might want more robust search capabilities beyond exact matches in strings.

In this case, you could search into one or more Algolia indices using the built-in [`getAlgoliaHits`](getAlgoliaHits) function from the `autocomplete-preset-algolia` preset.

```js
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

:::note

The [`getItems`](#getitems) function supports [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), meaning you can plug it to any asynchronous API.

:::

### Mixing static and dynamic sources based on the query

You don't have to show an empty screen until the user types a query. A typical pattern is to display a different source when the query is empty and switch once the user starts typing.

```js
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

The [`getSources`](#getsources) function provides access to the current `query`, which you can use to return sources conditionally. You can use this pattern to display recent searches when the query is empty and search results when the user types.

Note that you have access to the [full autocomplete state](state), not only the query. It lets you compute sources based on [various aspects](state#state), such as the query, but also the autocomplete status, whether the autocomplete is open or not, the context, etc.

### Using asynchronous sources

The [`getSources`](#getsources) function supports promises so that you can fetch sources from any asynchronous API. It can be Algolia or any third-party API you can query with an HTTP request.

For example, you could use the [Query Autocomplete](https://developers.google.com/places/web-service/query) service of the Google Places API to search for places and retrieve popular queries that map to actual points of interest.

```js
import { createAutocomplete } from '@algolia/autocomplete-core';

const autocomplete = createAutocomplete({
  getSources({ query }) {
    return fetch(
      `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${query}&key=YOUR_GOOGLE_PLACES_API_KEY`
    )
      .then((response) => response.json())
      .then(({ predictions }) => {
        return [
          {
            getItems() {
              return predictions;
            },
            getItemInputValue({ item }) {
              return item.description;
            },
          },
        ];
      });
  },
});
```

Note the usage of the [`getItemInputValue`](#getiteminputvalue) function to return the value of the item. It lets you fill the search box with a new value whenever the user selects an item, allowing them to refine their query and retrieve more relevant results.

### Using multiple sources

An autocomplete experience doesn't have to return only a single set of results. Autocomplete lets you fetch from different sources and display different types of results that serve different purposes.

For example, you may want to display Algolia search results and Query Suggestions based on the current query to let users refine it and yield better results.

```js
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
      const [suggestions, products] = results;

      return [
        {
          getItems() {
            return suggestions.hits;
          },
          getItemInputValue() {
            return item.query;
          },
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

:::note

You can use the official [`autocomplete-plugin-query-suggestions`](createQuerySuggestionsPlugin) plugin to retrieve Query Suggestions from Algolia.

:::

### Customizing items with templates

In addition to defining data sources for items, a source also lets you customize how to display items using [`templates`](#templates).

Templates can return a string:

```js
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  // ...
  getSources({ query }) {
    return [
      {
        // ...
        templates: {
          item({ item }) {
            return `Result: ${item.name}`;
          },
        },
      },
    ];
  },
});
```

Or a [Preact](https://preactjs.com/) component:

```js
import { autocomplete } from '@algolia/autocomplete-js';
import { h } from 'preact';

autocomplete({
  // ...
  getSources({ query }) {
    return [
      {
        // ...
        templates: {
          item({ item }) {
            return h('div', null, item.name);
          },
        },
      },
    ];
  },
});

```

Or HTML/JSX-like syntax (here using [htm](https://github.com/developit/htm)):

```js
import { autocomplete, highlightHit } from '@algolia/autocomplete-js';
import { html } from 'htm/preact';

autocomplete({
  // ...
  getSources({ query }) {
    return [
      {
        // ...
        templates: {
          item({ item }) {
            return html`<div>
              ${html([highlightHit({ hit: item, attribute: 'name' })])}
            </div>`
          },
        },
      },
    ];
  },
});
```

Or a custom component using `createElement` and `Fragment`:

```js
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  // ...
  getSources({ query }) {
    return [
      {
        // ...
        templates: {
          item({ item, createElement, Fragment }) {
            return createElement(Fragment, {}, item.name);
          },
        },
      },
    ];
  },
});
```

You can also define `header` and `footer` templates to display before and after the items list.

```js
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  // ...
  getSources({ query }) {
    return [
      {
        // ...
        templates: {
          header() {
            return 'Suggestions';
          },
          // ...
          footer() {
            return 'Footer';
          },
        },
      },
    ];
  },
});
```

## Reference

### `getSources`

> `(params: { query: string, state: AutocompleteState, ...setters: Autocomplete Setters }) => Array<AutocompleteSource> | Promise<Array<AutocompleteSource>>`

The function to fetch sources and their behaviors.

A source implements the following interface:

### `getItems`

> `(params: { query: string, state: AutocompleteState, ...setters }) => Suggestion[] | Promise<Suggestion[]>` | **required**

Called when the input changes. You can use this function to filter the items based on the query.

```js
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

```js
const items = [{ value: 'Apple' }, { value: 'Banana' }];

const source = {
  getItemInputValue({ item }) {
    return item.value;
  },
  // ...
};
```

### `getItemUrl`

> `(params: { item: Item, state: AutocompleteState }) => string | undefined`

Called to get the URL of the item. The value is used to add [keyboard accessibility](keyboard-navigation) features to let users open items in the current tab, a new tab, or a new window.

```js
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

Called whenever an item is selected.

### `onActive`

> `(params: { state: AutocompleteState, ...setters, event: Event, item: TItem, itemInputValue: string, itemUrl: string, source: AutocompleteSource }) => void`

Called whenever an item is active.

You can trigger different behaviors if the item is active depending on the triggering event using the `event` parameter.

### `templates`

> `SourceTemplate`

A set of templates to customize how items are displayed.

You can also provide templates for header and a footer elements around the list of items.
