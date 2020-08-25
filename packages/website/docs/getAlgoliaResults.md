---
id: getAlgoliaResults
---

Retrieves Algolia results from one or multiple indices.

## Example

```js
import { getAlgoliaResults } from '@francoischalifour/autocomplete-preset-algolia';
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
{
  "hits": [
    {
      "firstname": "Jimmie",
      "lastname": "Barninger",
      "objectID": "433",
      "_highlightResult": {
        "firstname": {
          "value": "&lt;em&gt;Jimmie&lt;/em&gt;",
          "matchLevel": "partial"
        },
        "lastname": {
          "value": "Barninger",
          "matchLevel": "none"
        },
        "company": {
          "value": "California &lt;em&gt;Paint&lt;/em&gt; & Wlpaper Str",
          "matchLevel": "partial"
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
  "params": "query=jimmie+paint&attributesToRetrieve=firstname,lastname&hitsPerPage=50"
}
```
