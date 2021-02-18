---
id: getAlgoliaResults-js
title: getAlgoliaResults
---

Retrieves Algolia results from multiple indices.

## Example

```js
import { getAlgoliaResults } from '@algolia/autocomplete-js';
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

## Params

See [`autocomplete-preset-algolia#getAlgoliaResults`](getAlgoliaResults#params).
