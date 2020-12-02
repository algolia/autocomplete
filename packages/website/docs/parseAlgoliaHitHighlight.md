---
id: parseAlgoliaHitHighlight
---

Returns the highlighted parts of an Algolia hit.

<!-- prettier-ignore -->
:::info
This function escapes characters.
:::

## Example

```js
import { parseAlgoliaHitHighlight } from '@algolia/autocomplete-preset-algolia';

// Fetch an Algolia hit
const hit = {
  name: 'Laptop',
  _highlightResult: {
    name: {
      value: '__aa_highlight__Lap__/aa_highlight__top',
    },
  },
};
const highlightParts = parseAlgoliaHitHighlight({
  hit,
  attribute: 'query',
});

// => [{ value: 'Lap', isHighlighted: true }, { value: 'top', isHighlighted: false }]
```

## Params

### `hit`

> `AlgoliaHit` | required

The Algolia hit to retrieve the attribute value from.

### `attribute`

> `string` | required

The attribute to retrieve the reverse highlight value from.

### `ignoreEscape`

> `string[]` | defaults to `[]`

The characters to skip from escaping.
