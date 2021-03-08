---
id: reverseSnippetHit
---

Returns virtual nodes with highlighted non-matching matching parts of an Algolia hit's snippet.

The `reverseSnippetHit` function lets you turn an Algolia hit's snippet into a virtual node with highlighted non-matching parts for a given attribute.

## Examples

### With a single string

To determine what attribute to parse, you can pass it as a string.

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

If you're referencing a nested attribute, you can use the array syntax.

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

Virtual nodes with the snippet.
