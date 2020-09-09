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
