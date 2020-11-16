---
id: highlightHit
---

Returns a string with highlighted and escaped matching parts of an Algolia hit.

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

### `highlightPreTag`

> `string` | defaults to `<mark>`

The HTML tag to prefix the value with.

### `highlightPostTag`

> `string` | defaults to `</mark>`

The HTML tag to suffix the value with.

### `ignoreEscape`

> `string[]` | defaults to `[]`

The characters to skip from escaping.
