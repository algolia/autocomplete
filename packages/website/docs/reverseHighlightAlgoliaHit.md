---
id: reverseHighlightAlgoliaHit
---

Highlights and escapes the non-matching parts of an Algolia hit.

This function can be used to display the differences of a hit match.

# Example

```js
import { reverseHighlightAlgoliaHit } from '@algolia/autocomplete-preset-algolia';

const hit = {}; // fetch an Algolia hit
const reverseHighlightedAlgoliaHit = reverseHighlightAlgoliaHit({
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

The attribute to retrieve the reverse highlight value from.

### `highlightPreTag`

> `string` | defaults to `<mark>`

The HTML tag to prefix the value with.

### `highlightPostTag`

> `string` | defaults to `</mark>`

The HTML tag to suffix the value with.

### `ignoreEscape`

> `string[]` | defaults to `[]`

The characters to skip from escaping.
