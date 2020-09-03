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

### `attribute`

> `string` | required

### `highlightPreTag`

> `string` | defaults to `<mark>`

### `highlightPostTag`

> `string` | defaults to `</mark>`

### `ignoreEscape`

> `string[]` | defaults to `[]`
