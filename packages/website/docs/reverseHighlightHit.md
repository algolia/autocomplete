---
id: reverseHighlightHit
---

Returns a virtual node with highlighted non-matching parts of an Algolia hit.

## Examples

### With a single string

```js
import { reverseHighlightHit } from '@algolia/autocomplete-js';

// An Algolia hit for query "hello"
const hit = {
  query: 'Hello there',
  _highlightResult: {
    query: {
      value:
        'Hello __aa-highlight__there__/aa-highlight__',
    },
  },
};
const reverseHighlightedValue = reverseHighlightHit({
  hit,
  attribute: 'query',
});
```

### With nested attributes

```js
import { reverseHighlightHit } from '@algolia/autocomplete-js';

// An Algolia hit for query "hello"
const hit = {
  query: {
    title: 'Hello there',
  }
  _highlightResult: {
    query: {
      title: {
        value:
          'Hello __aa-highlight__there__/aa-highlight__',
      },
    },
  },
};
const reverseHighlightedValue = reverseHighlightHit({
  hit,
  attribute: ['query', 'title'],
});
```

## Parameters

### `hit`

> `AlgoliaHit` | required

The Algolia hit whose attribute to retrieve the highlighted parts from.

### `attribute`

> `string | string[]` | required

The attribute to retrieve the highlighted parts from. You can use the array syntax to reference nested attributes.

### `tagName`

> `string` | defaults to `mark`

The tag name of the virtual node.

## Returns

> `HighlightItemParams<THit>`

A virtual node with the highlighted matching parts.
