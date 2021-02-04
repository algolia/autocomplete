---
id: changing-behavior-based-on-query
title: Changing behavior based on the query
---


### Mixing static and dynamic sources based on the query

You don't have to show an empty screen until the user types a query. A typical pattern is to display a different source when the query is empty and switch once the user starts typing.

```js
import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

autocomplete({
  // ...
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
