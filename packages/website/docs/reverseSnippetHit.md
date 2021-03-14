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

// An Algolia hit for query "zelda"
const hit = {
  query: 'zelda switch',
  _snippetResult: {
    query: {
      value:
        '__aa-highlight__zelda__/aa-highlight__ switch',
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

// An Algolia hit for query "video"
const hit = {
  hierarchicalCategories: {
    lvl1: 'Video games',
  },
  _snippetResult: {
    hierarchicalCategories: {
      lvl1: {
        value:
          '__aa-highlight__Video__/aa-highlight__ games',
      },
    },
  },
};
const reverseSnippetedValue = reverseSnippetHit({
  hit,
  attribute: ['hierarchicalCategories', 'lvl1'],
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
