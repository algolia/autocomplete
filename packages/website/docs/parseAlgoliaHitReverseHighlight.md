---
id: parseAlgoliaHitReverseHighlight
---

import PresetAlgoliaNote from './partials/preset-algolia/note.md'

Returns the highlighted non-matching parts of an Algolia hit.

The `parseAlgoliaHitReverseHighlight` function lets you parse the non-highlighted parts of an Algolia hit. This is a common pattern for [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/), where you want to highlight the differences between each suggestion.

<PresetAlgoliaNote />

## Installation

First, you need to install the preset.

```bash
yarn add @algolia/autocomplete-preset-algolia@alpha
# or
npm install @algolia/autocomplete-preset-algolia@alpha
```

Then import it in your project:

```js
import { parseAlgoliaHitReverseHighlight } from '@algolia/autocomplete-preset-algolia';
```

If you don't use a package manager, you can use the HTML `script` element:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-preset-algolia@alpha"></script>
<script>
  const { parseAlgoliaHitReverseHighlight } = window[
    '@algolia/autocomplete-preset-algolia'
  ];
</script>
```

## Examples

### With a single string

```js
import { parseAlgoliaHitReverseHighlight } from '@algolia/autocomplete-preset-algolia';

// An Algolia hit for query "zelda"
const hit = {
  query: 'zelda switch',
  _highlightResult: {
    query: {
      value: '__aa-highlight__zelda__/aa-highlight__ switch',
    },
  },
};
const reverseHighlightedParts = parseAlgoliaHitReverseHighlight({
  hit,
  attribute: 'query',
});

/*
 * [
 *  { value: 'zelda', isHighlighted: false },
 *  { value: ' switch', isHighlighted: true },
 * ]
 */
```

### With nested attributes

```js
import { parseAlgoliaHitReverseHighlight } from '@algolia/autocomplete-preset-algolia';

// An Algolia hit for query "video"
const hit = {
  hierarchicalCategories: {
    lvl1: 'Video games',
  },
  _highlightResult: {
    hierarchicalCategories: {
      lvl1: {
        value: '__aa-highlight__Video__/aa-highlight__ games',
      },
    },
  },
};
const reverseHighlightedParts = parseAlgoliaHitReverseHighlight({
  hit,
  attribute: ['hierarchicalCategories', 'lvl1'],
});

/*
 * [
 *  { value: 'Video', isHighlighted: false },
 *  { value: ' games', isHighlighted: true },
 * ]
 */
```

## Parameters

### `hit`

> `AlgoliaHit` | required

The Algolia hit whose attribute to retrieve the reverse highlighted parts from.

### `attribute`

> `string | string[]` | required

The attribute to retrieve the reverse highlighted parts from. You can use the array syntax to reference nested attributes.

## Returns

> `ParsedAttribute[]`

An array of the parsed attribute's parts.
