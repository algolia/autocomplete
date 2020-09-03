---
id: snippetAlgoliaHit
---

Highlights and escapes the matching parts of an Algolia hit snippet.

This function can be used to display a part of a hit with matches highlighted.

# Example

```js
import { snippetAlgoliaHit } from '@algolia/autocomplete-preset-algolia';

const hit = {}; // fetch an Algolia hit
const snippetedAlgoliaHit = snippetAlgoliaHit({
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
