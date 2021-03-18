---
id: parseAlgoliaHitSnippet
---

import PresetAlgoliaNote from './partials/preset-algolia/note.md'

Returns the highlighted parts of an Algolia hit's snippet.

The `parseAlgoliaHitSnippet` function lets you parse the highlighted parts of an Algolia hit's snippet.

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
import { parseAlgoliaHitSnippet } from '@algolia/autocomplete-preset-algolia';
```

If you don't use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-preset-algolia@alpha"></script>
```

## Examples

### With a single string

```js
import { parseAlgoliaHitHighlight } from '@algolia/autocomplete-preset-algolia';

// An Algolia hit for query "the"
const hit = {
  name: 'The Legend of Zelda: Breath of the Wild',
  _snippetResult: {
    name: {
      value:
        '__aa-highlight__The__/aa-highlight__ Legend of Zelda: Breath of __aa-highlight__the__/aa-highlight__ Wild',
    },
  },
};
const snippetedParts = parseAlgoliaHitSnippet({
  hit,
  attribute: 'name',
});

/*
 * [
 *  { value: 'The', isHighlighted: true },
 *  { value: ' Legend of Zelda: Breath of ', isHighlighted: false },
 *  { value: 'the', isHighlighted: true },
 *  { value: ' Wild', isHighlighted: false },
 * ]
 */
```

### With nested attributes

```js
import { parseAlgoliaHitSnippet } from '@algolia/autocomplete-preset-algolia';

// An Algolia hit for query "cam"
const hit = {
  hierarchicalCategories: {
    lvl1: 'Cameras & Camcoders',
  },
  _snippetResult: {
    hierarchicalCategories: {
      lvl1: {
        value:
          '__aa-highlight__Cam__/aa-highlight__eras & __aa-highlight__Cam__/aa-highlight__coders',
      },
    },
  },
};
const snippetedParts = parseAlgoliaHitSnippet({
  hit,
  attribute: ['hierarchicalCategories', 'lvl1'],
});

/*
 * [
 *  { value: 'Cam', isHighlighted: true },
 *  { value: 'eras & ', isHighlighted: false },
 *  { value: 'Cam', isHighlighted: true },
 *  { value: 'coders', isHighlighted: false },
 * ]
 */
```

## Parameters

### `hit`

> `AlgoliaHit` | required

The Algolia hit whose attribute to retrieve the snippet from.

### `attribute`

> `string | string[]` | required

The attribute to retrieve the snippet from. You can use the array syntax to reference nested attributes.

## Returns

> `ParsedAttribute[]`

An array of the parsed attribute's parts.
