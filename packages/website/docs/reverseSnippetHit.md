---
id: reverseSnippetHit
---

Returns a string with highlighted and escaped non-matching parts of an Algolia hit snippet.

# Example

```js
import { reverseSnippetHit } from '@algolia/autocomplete-js';

const hit = {}; // fetch an Algolia hit
const reverseSnippetedValue = reverseSnippetHit({
  hit,
  attribute: 'query',
});
```

# Reference

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

### `highlightPostTag`

> `string` | defaults to `</mark>`

The HTML tag to suffix the value with.

### `ignoreEscape`

> `string[]` | defaults to `[]`

The characters to skip from escaping.
