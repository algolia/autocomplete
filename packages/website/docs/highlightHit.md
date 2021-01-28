---
id: highlightHit
---

Returns a virtual node with highlighted matching parts of an Algolia hit.

## Example

```js
import { highlightHit } from '@algolia/autocomplete-js';

const hit = {}; // fetch an Algolia hit
const highlightedValue = highlightHit({
  hit,
  attribute: 'query',
});
```

## Params

### `hit`

> `AlgoliaHit` | required

The Algolia hit to retrieve the attribute value from.

### `attribute`

> `string` | required

The attribute to retrieve the highlight value from.

### `tagName`

> `string` | defaults to `mark`

The tag name of the virtual node.
