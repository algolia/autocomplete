---
id: parseAlgoliaHitReverseSnippet
---

Returns the non-matching parts of an Algolia hit snippet.

This is a common pattern for Query Suggestions.

## Example with a single string

```js
import { parseAlgoliaHitReverseSnippet } from '@algolia/autocomplete-preset-algolia';

// Fetch an Algolia hit
const hit = {
  name: 'Laptop',
  _snippetResult: {
    name: {
      value: '__aa_highlight__Lap__/aa_highlight__top',
    },
  },
};
const snippetParts = parseAlgoliaHitReverseSnippet({
  hit,
  attribute: 'name',
});

// => [{ value: 'Lap', isHighlighted: false }, { value: 'top', isHighlighted: true }]
```

## Example with nested attributes

```js
import { parseAlgoliaHitReverseSnippet } from '@algolia/autocomplete-preset-algolia';

// Fetch an Algolia hit
const hit = {
  name: {
    type: 'Laptop',
  },
  _snippetResult: {
    name: {
      type: {
        value: '__aa_highlight__Lap__/aa_highlight__top',
      },
    },
  },
};
const snippetParts = parseAlgoliaHitReverseSnippet({
  hit,
  attribute: ['name', 'type'],
});

// => [{ value: 'Lap', isHighlighted: false }, { value: 'top', isHighlighted: true }]
```

## Params

### `hit`

> `AlgoliaHit` | required

The Algolia hit to retrieve the attribute value from.

### `attribute`

> `string | string[]` | required

The attribute to retrieve the reverse snippet value from. You can use the array syntax to reference the nested attributes.
