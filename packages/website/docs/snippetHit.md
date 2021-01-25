---
id: snippetHit
---

Returns a virtual node with matching parts of an Algolia hit snippet.

## Example

```js
import { snippetHit } from '@algolia/autocomplete-js';

const hit = {}; // fetch an Algolia hit
const snippetedValue = snippetHit({
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

### `highlightPreTag`

> `string` | defaults to `<mark>`

The HTML tag to prefix the value with.

### `tagName`

> `string` | defaults to `mark`

The tag name of the virtual node.
