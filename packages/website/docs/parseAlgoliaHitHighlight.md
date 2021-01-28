---
id: parseAlgoliaHitHighlight
---

Returns the highlighted parts of an Algolia hit.

## Example with a single string

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
const snippetParts = parseAlgoliaHitHighlight({
  hit,
  attribute: 'name',
});

// => [{ value: 'Lap', isHighlighted: true }, { value: 'top', isHighlighted: false }]
```

## Example with an nested array of strings

```js
import { parseAlgoliaHitHighlight } from '@algolia/autocomplete-preset-algolia';

// Fetch an Algolia hit
const hit = {
  name: {
    type: 'Laptop',
  },
  _highlightResult: {
    name: {
      type: {
        value: '__aa_highlight__Lap__/aa_highlight__top',
      },
    },
  },
};
const snippetParts = parseAlgoliaHitHighlight({
  hit,
  attribute: ['name', 'type'],
});

// => [{ value: 'Lap', isHighlighted: true }, { value: 'top', isHighlighted: false }]
```

## Params

### `hit`

> `AlgoliaHit` | required

The Algolia hit to retrieve the attribute value from.

### `attribute`

> `string | string[]` | required

The attribute to retrieve the reverse highlight value from.
