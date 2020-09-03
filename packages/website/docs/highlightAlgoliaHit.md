---
id: highlightAlgoliaHit
---

Highlights and escapes the matching parts of an Algolia hit.

This function can be used to display a hit with matches highlighted.

# Example

```js
import { highlightAlgoliaHit } from '@algolia/autocomplete-preset-algolia';

const hit = {}; // fetch an Algolia hit
const highlightedAlgoliaHit = highlightAlgoliaHit({
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
