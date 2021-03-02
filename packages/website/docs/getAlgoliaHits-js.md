---
id: getAlgoliaHits-js
title: getAlgoliaHits
---

import GetAlgoliaHitsIntro from './partials/preset-algolia/getAlgoliaHits/intro.md'
import GetAlgoliaHitsNote from './partials/preset-algolia/getAlgoliaHits/note.md'

<GetAlgoliaHitsIntro />

## Example

This example uses the function along with the [`algoliasearch`](https://www.npmjs.com/package/algoliasearch) API client.

```js
 import { getAlgoliaHits } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

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

## Parameters

See [`autocomplete-preset-algolia#getAlgoliaHits`](getAlgoliaHits#parameters).
