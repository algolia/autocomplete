---
id: parseAlgoliaHitReverseHighlight
---

Returns the highlighted parts of an Algolia hit.

This is a common pattern for Query Suggestions.

# Example

```js
import { parseAlgoliaHitReverseHighlight } from '@algolia/autocomplete-preset-algolia';

// Fetch an Algolia hit
const hit = {
  name: 'Laptop',
  _highlightResult: {
    name: {
      value: '__aa_highlight__Lap__/aa_highlight__top',
    },
  },
};
const highlightedAlgoliaHit = parseAlgoliaHitReverseHighlight({
  hit,
  attribute: 'query',
});

// => [{ value: 'Lap', isHighlighted: true }, { value: 'top', isHighlighted: false }]
```

# Reference

## Params

### `hit`

> `AlgoliaHit` | required

The Algolia hit to retrieve the attribute value from.

### `attribute`

> `string` | required

The attribute to retrieve the highlight value from.
