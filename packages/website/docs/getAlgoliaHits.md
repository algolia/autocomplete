---
id: getAlgoliaHits
---

Retrieves and merges Algolia hits from one or multiple indices.

## Example

```js
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';
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

### `searchClient`

> `SearchClient` | required

### `queries`

#### `indexName`

> `string` | required

#### `query`

> `string` | required

#### `params`

> [`SearchParameters`](https://www.algolia.com/doc/api-reference/search-api-parameters/) | required

Default search parameters:

```json
{
  "hitsPerPage": 5,
  "highlightPreTag": "<mark>",
  "highlightPostTag": "</mark>"
}
```

## Returns

It returns a promise of the following schema:

```json
[{}, {}, {}]
```
