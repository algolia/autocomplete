---
id: getAlgoliaFacetHits
---

Retrieves Algolia facet hits from multiple indices.

## Example

```js
import { getAlgoliaFacetHits } from '@algolia/autocomplete-preset-algolia';
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

### `searchClient`

> `SearchClient` | required

### `queries`

#### `indexName`

> `string` | required

#### `params`

> [`SearchParameters`](https://www.algolia.com/doc/api-reference/search-api-parameters/) & [`Request Options`](https://www.algolia.com/doc/api-client/getting-started/request-options/) | required

Default search parameters:

```json
{
  "highlightPreTag": "__aa-highlight__",
  "highlightPostTag": "__/aa-highlight__"
}
```

## Returns

It returns a promise of the following schema:

```json
[
  {
    "count": 507,
    "label": "Mobile phones",
    "_highlightResult": {
      "label": {
        "value": "Mobile <em>phone</em>s"
      }
    }
  },
  {
    "count": 63,
    "label": "Phone cases",
    "_highlightResult": {
      "label": {
        "value": "<em>Phone</em> cases"
      }
    }
  }
]
```
