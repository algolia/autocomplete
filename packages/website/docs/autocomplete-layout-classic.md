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
  NavigationCommandsLayout,
  SearchByAlgoliaLayout,
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
  NavigationCommandsLayout,
  SearchByAlgoliaLayout,
} from '@algolia/autocomplete-layout-classic';
import { h, render } from 'preact';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  // ...
  render({ sections, createElement, Fragment }, root) {
    render(
      <Fragment>
        <div className="aa-PanelLayout">{sections}</div>
        <footer className="aa-PanelFooter">
          {NavigationCommandsLayout({ createElement, Fragment })}
          {SearchByAlgoliaLayout({ createElement, Fragment })}
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
  NavigationCommandsLayout,
  SearchByAlgoliaLayout,
} from '@algolia/autocomplete-layout-classic';
import { h, render } from 'preact';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  // ...
  render({ sections, createElement, Fragment }, root) {
    render(
      <Fragment>
        <div className="aa-PanelLayout">{sections}</div>
        <footer className="aa-PanelFooter">
          {NavigationCommandsLayout({
            createElement,
            Fragment,
            translations: {
              toClose: 'pour fermer',
              toNavigate: 'pour naviguer',
              toSelect: 'pour sélectionner',
            },
          })}
          {SearchByAlgoliaLayout({
            createElement,
            Fragment,
            translations: {
              searchBy: 'Recherche par',
            },
          })}
        </footer>
      </Fragment>,
      root
    );
  },
});
```

## Layouts

### `NavigationCommandsLayout`

#### `createElement`

> `(type: any, props: Record<string, any> | null, ...children: ComponentChildren[]) => VNode`

The function that create virtual nodes.

#### `Fragment`

The component to use to create fragments.

#### `translations`

> `NavigationCommandsLayoutTranslations` | defaults to English strings

The translations to display.

```ts
type NavigationCommandsLayoutTranslations = {
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

### `SearchByAlgoliaLayout`

#### `createElement`

> `(type: any, props: Record<string, any> | null, ...children: ComponentChildren[]) => VNode`

The function that create virtual nodes.

#### `Fragment`

The component to use to create fragments.

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
