---
id: autocomplete-layout-classic
---

The Classic layout provides components for Autocomplete experiences.

This layout relies on the [Autocomplete Classic Theme](autocomplete-theme-classic). Make sure to install it as well.

## Installation

First, you need to install the layout.

```bash
yarn add @algolia/autocomplete-layout-classic@alpha
# or
npm install @algolia/autocomplete-layout-classic@alpha
```

Then import it in your project:

```js
import {
  NavigationCommands,
  SearchByAlgolia,
} from '@algolia/autocomplete-layout-classic';
```

If you don't use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-layout-classic@alpha"></script>
```

## Examples

With default translations:

```tsx
/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import {
  NavigationCommands,
  SearchByAlgolia,
} from '@algolia/autocomplete-layout-classic';
import { h, render } from 'preact';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  // ...
  components: {
    NavigationCommands,
    SearchByAlgolia,
  },
  render({ sections, Fragment, components }, root) {
    render(
      <Fragment>
        <div className="aa-PanelLayout aa-Panel--scrollable">{sections}</div>
        <footer className="aa-PanelFooter">
          <components.NavigationCommands />
          <components.SearchByAlgolia />
        </footer>
      </Fragment>,
      root
    );
  },
});
```

With French translations:

```tsx
/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import {
  NavigationCommands,
  SearchByAlgolia,
} from '@algolia/autocomplete-layout-classic';
import { h, render } from 'preact';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  // ...
  components: {
    NavigationCommands,
    SearchByAlgolia,
  },
  render({ sections, Fragment, components }, root) {
    render(
      <Fragment>
        <div className="aa-PanelLayout aa-Panel--scrollable">{sections}</div>
        <footer className="aa-PanelFooter">
          <components.NavigationCommands
            translations={{
              toClose: 'pour fermer',
              toNavigate: 'pour naviguer',
              toSelect: 'pour sélectionner',
            }}
          />
          <components.SearchByAlgolia
            translations={{
              searchBy: 'Recherche par',
            }}
          />
        </footer>
      </Fragment>,
      root
    );
  },
});
```

With a custom renderer:

```tsx
import { autocomplete } from '@algolia/autocomplete-js';
import {
  createNavigationCommandsComponent,
  createSearchByAlgoliaComponent,
} from '@algolia/autocomplete-layout-classic';
import React, { createElement, Fragment } from 'react';

import '@algolia/autocomplete-theme-classic';

const renderer = { createElement, Fragment };

autocomplete({
  // ...
  renderer,
  components: {
    NavigationCommands: createNavigationCommandsComponent(renderer),
    SearchByAlgolia: createSearchByAlgoliaComponent(renderer),
  },
  render({ sections, Fragment, components }, root) {
    render(
      <Fragment>
        <div className="aa-PanelLayout aa-Panel--scrollable">{sections}</div>
        <footer className="aa-PanelFooter">
          <components.NavigationCommands />
          <components.SearchByAlgolia />
        </footer>
      </Fragment>,
      root
    );
  },
});
```

## Reference

### `NavigationCommands`

#### `translations`

> `NavigationCommandsTranslations` | defaults to English strings

The translations to display.

```ts
type NavigationCommandsTranslations = {
  toSelect: string;
  toNavigate: string;
  toClose: string;
};
```

Defaults to:

```ts
const translations = {
  toSelect: 'to select',
  toNavigate: 'to navigate',
  toClose: 'to close',
};
```

### `SearchByAlgolia`

#### `translations`

> `SearchByAlgoliaTranslations` | defaults to English strings

The translations to display.

```ts
type SearchByAlgoliaTranslations = {
  searchBy: string;
};
```

Defaults to:

```ts
const translations = {
  searchBy: 'Search by',
};
```

### `createNavigationCommandsComponent`

> `(renderer: AutocompleteRenderer) => JSX.Element`

The function accepts a [renderer](/docs/autocomplete-js/#renderer) and returns the [`NavigationCommands`](#navigationcommands) component. It's useful when using a framework like [React](/docs/using-react) or [Vue](/docs/using-vue).

### `createSearchByAlgoliaComponent`

> `(renderer: AutocompleteRenderer) => JSX.Element`

The function accepts a [renderer](/docs/autocomplete-js/#renderer) and returns the [`SearchByAlgolia`](#searchbyalgolia) component. It's useful when using a framework like [React](/docs/using-react) or [Vue](/docs/using-vue).
