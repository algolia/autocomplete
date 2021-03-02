---
id: snippetHit
---

Returns a virtual node with highlighted matching parts of an Algolia hit's snippet.

## Examples

### With a single string

```js
import { snippetHit } from '@algolia/autocomplete-js';

// An Algolia hit for query "he"
const hit = {
  query: 'Hello there',
  _snippetResult: {
    query: {
      value:
        '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
    },
  },
};
const snippetedValue = snippetHit({
  hit,
  attribute: 'query',
});
```

### With nested attributes

```js
import { snippetHit } from '@algolia/autocomplete-js';

// An Algolia hit for query "he"
const hit = {
  query: {
    title: 'Hello there',
  }
  _snippetResult: {
    query: {
      title: {
        value:
          '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
      },
    },
  },
};
const snippetedValue = snippetHit({
  hit,
  attribute: ['query', 'title'],
});
```

## Parameters

### `hit`

> `AlgoliaHit` | required

The Algolia hit whose attribute to retrieve the snippet from.

### `attribute`

> `string | string[]` | required

The attribute to retrieve the snippet from. You can use the array syntax to reference nested attributes.

### `tagName`

> `string` | defaults to `mark`

The tag name of the virtual node.

## Returns

> `HighlightItemParams<THit>`

A virtual node with the snippet.
