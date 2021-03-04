---
id: reverseHighlightHit
---

Returns virtual nodes with highlighted non-matching parts of an Algolia hit.

 The `reverseHighlightHit` function lets you turn an Algolia hit into a virtual node with highlighted non-matching parts for a given attribute.

## Examples

### With a single string

To determine what attribute to parse, you can pass it as a string.

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

If you're referencing a nested attribute, you can use the array syntax.

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

Virtual nodes with the highlighted matching parts.
