---
id: getAlgoliaFacetHits-js
title: getAlgoliaFacetHits
---

import GetAlgoliaFacetHitsIntro from './partials/preset-algolia/getAlgoliaFacetHits/intro.md'

<GetAlgoliaFacetHitsIntro />

## Example

```js
import { getAlgoliaFacetHits } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

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

## Parameters

See [`autocomplete-preset-algolia#getAlgoliaFacetHits`](getAlgoliaFacetHits#params).
