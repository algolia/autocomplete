---
id: reverseSnippetHit
---

Returns a virtual node with highlighted non-matching matching parts of an Algolia hit's snippet.

## Examples

### With a single string

```js
import { reverseSnippetHit } from '@algolia/autocomplete-js';

// An Algolia hit for query "hello"
const hit = {
  query: 'Hello there',
  _snippetResult: {
    query: {
      value:
        'Hello __aa-highlight__there__/aa-highlight__',
    },
  },
};
const reverseSnippetedValue = reverseSnippetHit({
  hit,
  attribute: 'query',
});
```

### With nested attributes

```js
import { reverseSnippetHit } from '@algolia/autocomplete-js';

// An Algolia hit for query "hello"
const hit = {
  query: {
    title: 'Hello there',
  }
  _snippetResult: {
    query: {
      title: {
        value:
          'Hello __aa-highlight__there__/aa-highlight__',
      },
    },
  },
};
const reverseSnippetedValue = reverseSnippetHit({
  hit,
  attribute: ['query', 'title'],
});
```

## Parameters

### `hit`

> `AlgoliaHit` | required

The Algolia hit whose attribute to retrieve the reverse snippet parts from.

### `attribute`

> `string | string[]` | required

The attribute to retrieve the reverse snippet from. You can use the array syntax to reference nested attributes.

### `tagName`

> `string` | defaults to `mark`

The tag name of the virtual node.

## Returns

> `HighlightItemParams<THit>`

A virtual node with the snippet.
