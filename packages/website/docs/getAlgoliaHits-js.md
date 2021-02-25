---
id: getAlgoliaHits-js
title: getAlgoliaHits
---

Retrieves Algolia hits from multiple indices into arrays of records.

## Example

```js
import { getAlgoliaHits } from '@algolia/autocomplete-js';
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

## Params

See [`autocomplete-preset-algolia#getAlgoliaHits`](getAlgoliaHits#params).
