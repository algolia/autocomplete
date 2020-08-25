---
id: getAlgoliaHits-js
title: getAlgoliaHits
---

Retrieves and merges Algolia hits from one or multiple indices.

## Example

```js
import { getAlgoliaHits } from '@francoischalifour/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(APP_ID, SEARCH_API_KEY);

getAlgoliaHits({
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
}).then((hits) => {
  console.log(hits);
});
```

## Options

See [`autocomplete-preset-algolia#getAlgoliaHits`](getAlgoliaHits#options).
