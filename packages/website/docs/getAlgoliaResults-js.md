---
id: getAlgoliaResults-js
title: getAlgoliaResults
---

Retrieves Algolia results from one or multiple indices.

## Example

```js
import { getAlgoliaResults } from '@francoischalifour/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(APP_ID, SEARCH_API_KEY);

getAlgoliaResults({
  searchClient,
  queries: [
    {
      indexName: 'instant_search',
      query,
      params: {
        hitsPerPage: 3,
      },
    },
  ],
}).then((results) => {
  console.log(results);
});
```

## Options

See [`autocomplete-preset-algolia#getAlgoliaResults`](getAlgoliaResults#options).
