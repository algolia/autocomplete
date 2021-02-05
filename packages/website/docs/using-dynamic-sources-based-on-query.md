---
id: changing-behavior-based-on-query
title: Changing behavior based on the query
---

Learn how to use conditional sources depending on the query.

You may want to change which [sources](sources) you use depending on the query. A typical pattern is to display a different source when the query is empty and switch once the user starts typing.

This tutorial explains how to show [static predefined items](sources/#using-static-sources) when the query is empty,and results from an [Algolia index](https://www.algolia.com/doc/faq/basics/what-is-an-index/) when it isn't.

## Prerequisites

This tutorial assumes that you have:
- existing markup containing an input element where you want to implement the autocomplete dropdown
- front-end development proficiency with HTML, CSS, and JavaScript

## Getting started

First, begin with some boilerplate for the autocomplete implementation. Create a file called `index.js` in your `src` directory, and add the boilerplate below:

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  container: '#autocomplete',
  openOnFocus: true,
});
```

This boilerplate assumes you want to insert the autocomplete into a DOM element with `autocomplete` as an [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). You should change the [`container`](autocomplete-js/#container) to [match your markup](basic-options). Setting [`openOnFocus`](autocomplete-js/#openonfocus) to `true` ensures that the dropdown appears as soon as a user focuses the input.

## Adding conditional sources


```js title="index.js"
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

autocomplete({
  container: '#autocomplete',
  openOnFocus: true,
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

When there isn't a query, this autocomplete instance returns links to Twitter and Github. When there is, it searches an Algolia index. For more information on using Algolia as a source, follow the [Getting Started guide](getting-started).

The [`getSources`](#getsources) function provides access to the current `query`, which you can use to return sources conditionally. You can use this pattern to display predefined items like these, [recent searches](adding-recent-searches), and / or [suggested searches](adding-suggested-searches) when the query is empty. When the user begins to type, you can show search results.

Note that you have access to the [full autocomplete state](state), not only the query. It lets you compute sources based on [various aspects](state#state), such as the query, but also the autocomplete status, whether the autocomplete is open or not, the context, etc.
