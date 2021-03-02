---
id: highlightHit
---

Returns a virtual node with highlighted matching parts of an Algolia hit.

## Examples

### With a single string

```js
import { highlightHit } from '@algolia/autocomplete-js';

// An Algolia hit for query "he"
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

### With nested attributes

```js
import { highlightHit } from '@algolia/autocomplete-js';

// An Algolia hit for query "he"
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
