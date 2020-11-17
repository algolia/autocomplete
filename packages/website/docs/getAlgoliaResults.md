---
id: getAlgoliaResults
---

Retrieves Algolia results from one or multiple indices.

## Example

```js
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
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
  "highlightPreTag": "__aa-highlight__",
  "highlightPostTag": "__/aa-highlight__"
}
```

## Returns

It returns a promise of the following schema:

```json
{
  "hits": [
    {
      "objectID": "433",
      "firstname": "Jimmie",
      "lastname": "Barninger",
      "_highlightResult": {
        "firstname": {
          "value": "&lt;em&gt;Jimmie&lt;/em&gt;",
          "matchLevel": "partial"
        },
        "lastname": {
          "value": "Barninger",
          "matchLevel": "none"
        }
      }
    }
  ],
  "page": 0,
  "nbHits": 1,
  "nbPages": 1,
  "hitsPerPage": 20,
  "processingTimeMS": 1,
  "query": "jimmie paint",
  "params": "query=jimmie+paint&attributesToRetrieve=firstname,lastname&hitsPerPage=20"
}
```
