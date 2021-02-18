---
id: getAlgoliaFacetHits-js
title: getAlgoliaFacetHits
---

Retrieves Algolia facet hits from multiple indices.

## Example

```js
import { getAlgoliaFacetHits } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(APP_ID, SEARCH_API_KEY);

getAlgoliaFacetHits({
  searchClient,
  queries: [
    {
      indexName: 'instant_search',
      params: {
        facetName: 'categories',
        facetQuery: query,
        maxFacetHits: 10,
      },
    },
  ],
}).then((facetHits) => {
  console.log(facetHits);
});
```

## Params

See [`autocomplete-preset-algolia#getAlgoliaFacetHits`](getAlgoliaFacetHits#params).
