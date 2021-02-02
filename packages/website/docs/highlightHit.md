---
id: highlightHit
---

Returns a virtual node with highlighted matching parts of an Algolia hit.

## Example with a single string

```js
import { highlightHit } from '@algolia/autocomplete-js';

// fetch an Algolia hit
const hit = {
  query: 'Hello there',
  _highlightResult: {
    query: {
      value:
        '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
    },
  },
};
const highlightedValue = highlightHit({
  hit,
  attribute: 'query',
});
```

## Example with nested attributes

```js
import { highlightHit } from '@algolia/autocomplete-js';

// fetch an Algolia hit
const hit = {
  query: {
    title: 'Hello there',
  }
  _highlightResult: {
    query: {
      title: {
        value:
          '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
      },
    },
  },
};
const highlightedValue = highlightHit({
  hit,
  attribute: ['query', 'title'],
});
```

## Params

### `hit`

> `AlgoliaHit` | required

The Algolia hit to retrieve the attribute value from.

### `attribute`

> `string | string[]` | required

The attribute to retrieve the highlight value from. You can use the array syntax to reference the nested attributes.

### `tagName`

> `string` | defaults to `mark`

The tag name of the virtual node.
