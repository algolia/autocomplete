---
id: reverseSnippetHit
---

Returns a virtual node with non-matching parts of an Algolia hit snippet.

## Example

```js
import { reverseSnippetHit } from '@algolia/autocomplete-js';

const hit = {}; // fetch an Algolia hit
const reverseSnippetedValue = reverseSnippetHit({
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

The attribute to retrieve the snippet value from.

### `tagName`

> `string` | defaults to `mark`

The tag name of the virtual node.
