---
id: snippetHit
---

Returns virtual nodes with highlighted matching parts of an Algolia hit's snippet.

The `snippetHit` function lets you turn an Algolia hit's snippet into a virtual node with highlighted matching parts for a given attribute.

## Examples

### With a single string

To determine what attribute to parse, you can pass it as a string.

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

If you're referencing a nested attribute, you can use the array syntax.

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

Virtual nodes with the snippet.
