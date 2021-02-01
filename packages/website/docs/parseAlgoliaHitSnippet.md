---
id: parseAlgoliaHitSnippet
---

Returns the snippeted parts of an Algolia hit.

<<<<<<< HEAD
## Example
=======
## Example with a single string
>>>>>>> d869f075c26862672a96b07093587424216cfe23

```js
import { parseAlgoliaHitSnippet } from '@algolia/autocomplete-preset-algolia';

// Fetch an Algolia hit
const hit = {
  name: 'Laptop',
  _snippetResult: {
    name: {
      value: '__aa_highlight__Lap__/aa_highlight__top',
    },
  },
};
const snippetParts = parseAlgoliaHitSnippet({
  hit,
  attribute: 'name',
});

// => [{ value: 'Lap', isHighlighted: true }, { value: 'top', isHighlighted: false }]
```

## Example with nested attributes

```js
import { parseAlgoliaHitSnippet } from '@algolia/autocomplete-preset-algolia';

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
const snippetParts = parseAlgoliaHitSnippet({
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

<<<<<<< HEAD
> `string` | required

The attribute to retrieve the snippet value from.
=======
> `string | string[]` | required

The attribute to retrieve the snippet value from. You can use the array syntax to reference the nested attributes.
>>>>>>> d869f075c26862672a96b07093587424216cfe23
