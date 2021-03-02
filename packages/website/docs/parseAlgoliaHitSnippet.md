---
id: parseAlgoliaHitSnippet
---

import PresetAlgoliaNote from './partials/preset-algolia/note.md'

Returns the highlighted parts of an Algolia hit's snippet.

<PresetAlgoliaNote />

## Installation

First, you need to install the plugin.

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
import { parseAlgoliaHitSnippet } from '@algolia/autocomplete-preset-algolia';

// An Algolia hit for query "lap"
const hit = {
  name: 'Laptop',
  _snippetResult: {
    name: {
      value: '__aa_highlight__Lap__/aa_highlight__top',
    },
  },
};
const snippetedParts = parseAlgoliaHitSnippet({
  hit,
  attribute: 'name',
});

// [{ value: 'Lap', isHighlighted: true }, { value: 'top', isHighlighted: false }]
```

### With nested attributes

```js
import { parseAlgoliaHitSnippet } from '@algolia/autocomplete-preset-algolia';

// An Algolia hit for query "lap"
const hit = {
  name: {
    type: 'Laptop',
  },
  _snippetResult: {
    name: {
      type: {
        value: '__aa_highlight__Lap__/aa_highlight__top',
      },
    },
  },
};
const snippetedParts = parseAlgoliaHitSnippet({
  hit,
  attribute: ['name', 'type'],
});

// [{ value: 'Lap', isHighlighted: true }, { value: 'top', isHighlighted: false }]
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
