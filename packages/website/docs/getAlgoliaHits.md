---
id: getAlgoliaHits
---

import GetAlgoliaHitsIntro from './partials/preset-algolia/getAlgoliaHits/intro.md'
import GetAlgoliaHitsNote from './partials/preset-algolia/getAlgoliaHits/note.md'
import GetAlgoliaHitsExample from './partials/preset-algolia/getAlgoliaHits/example.md'

<GetAlgoliaHitsIntro />

<GetAlgoliaHitsNote />

## Installation

First, you need to install the plugin.

```bash
yarn add @algolia/autocomplete-preset-algolia@alpha
# or
npm install @algolia/autocomplete-preset-algolia@alpha
```

Then import it in your project:

```js
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';
```

If you don't use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-preset-algolia@alpha"></script>
```

## Example

<GetAlgoliaHitsExample />

## Parameters

### `searchClient`

> `SearchClient` | required

The initialized Algolia search client.

#### `indexName`

> `string` | required

The index name.

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
[
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
]
```
