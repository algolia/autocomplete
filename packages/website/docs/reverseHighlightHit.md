---
id: reverseHighlightHit
---

Returns a virtual node with non-matching parts of an Algolia hit.

## Example

```js
import { reverseHighlightHit } from '@algolia/autocomplete-js';

const hit = {}; // fetch an Algolia hit
const highlightedValue = reverseHighlightHit({
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
