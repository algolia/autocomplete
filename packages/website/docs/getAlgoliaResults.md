---
id: getAlgoliaResults
---

import GetAlgoliaResultsIntro from './partials/preset-algolia/getAlgoliaResults/intro.md'
import PresetAlgoliaNote from './partials/preset-algolia/note.md'

<GetAlgoliaResultsIntro />

<PresetAlgoliaNote />

## Installation

First, you need to install the plugin.

```bash
yarn add @algolia/autocomplete-preset-algolia@alpha
# or
npm install @algolia/autocomplete-preset-algolia@alpha
```

Then import it in your project:

```js
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
```

If you don't use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-preset-algolia@alpha"></script>
```

## Example

This example uses the function along with the [`algoliasearch`](https://www.npmjs.com/package/algoliasearch) API client.

```js
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

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

## Parameters

### `searchClient`

> `SearchClient` | required

The initialized Algolia search client.

### `queries`

> `MultipleQueriesQuery[]` | required

The queries to perform, with the following parameters:

#### `indexName`

> `string` | required

The index name to search into.

#### `query`

> `string` | required

The query to search for.

#### `params`

> [`SearchParameters`](https://www.algolia.com/doc/api-reference/search-api-parameters/) | required

Algolia search parameters.

These are the default search parameters. You can leave them as is and specify other parameters, or override them.

```json
{
  "hitsPerPage": 5,
  "highlightPreTag": "__aa-highlight__",
  "highlightPostTag": "__/aa-highlight__"
}
```

## Returns

The function returns a promise that resolves to a response with the following schema:

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
