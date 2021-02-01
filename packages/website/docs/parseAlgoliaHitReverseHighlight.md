---
id: parseAlgoliaHitReverseHighlight
---

Returns the highlighted parts of an Algolia hit.

This is a common pattern for Query Suggestions.

## Example with a single string

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
const snippetParts = parseAlgoliaHitReverseHighlight({
  hit,
  attribute: 'name',
});

// => [{ value: 'Lap', isHighlighted: false }, { value: 'top', isHighlighted: true }]
```

## Example with nested attributes

```js
import { parseAlgoliaHitReverseHighlight } from '@algolia/autocomplete-preset-algolia';

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
const snippetParts = parseAlgoliaHitReverseHighlight({
  hit,
  attribute: ['name', 'type'],
});

// => [{ value: 'Lap', isHighlighted: false }, { value: 'top', isHighlighted: true }]
```

# Reference

## Params

### `hit`

> `AlgoliaHit` | required

The Algolia hit to retrieve the attribute value from.

### `attribute`

> `string | string[]` | required

The attribute to retrieve the highlight value from. You can use the array syntax to reference the nested attributes.
