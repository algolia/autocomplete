---
id: autocomplete-theme-classic
---

The Classic theme provides a design for Autocomplete experiences.

import Draft from './partials/draft.md'

<Draft />

We recommend using the Classic theme and customizing it with CSS variables. If you want to work on your own theme, we recommend starting from this one.

## Import

Using HTML:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-theme-classic@alpha"
/>
```

Using JavaScript:

```js
import '@algolia/autocomplete-theme-classic';
```

## CSS variables

- `--aa-base-unit`
- `--aa-font-size`
- `--aa-spacing-factor`
- `--aa-spacing`
- `--aa-spacing-half`
- `--aa-icon-size`
- `--aa-primary-color`
- `--aa-muted-color`
- `--aa-selected-color`
- `--aa-icon-color`
- `--aa-text-color`
- `--aa-content-text-color`
- `--aa-background-color`
- `--aa-background-color-alpha-0`
- `--aa-panel-shadow`
- `--aa-panel-max-height`: the maximal height for the panel before showing a vertical scroll bar
- `--aa-detached-media-query`: the media query

## CSS utility classes

- `aa-ActiveOnly`: displays an element only when the item is active
- `aa-TouchOnly`: displays an element only on touch devices.

## Dark mode

The Autocomplete Classic theme supports dark mode in two ways:

- `<body data-theme="dark" />`
- `<body class="dark" />`

## Templates

### Markup

Here is an [`item`](templates#item) template markup.

```jsx
import { snippetHit } from '@algolia/autocomplete-js';
import { h, Fragment } from 'preact';

function ProductItem({ hit }) {
  return (
    <Fragment>
      <div className="aa-ItemIcon">
        <img src={hit.image} alt={hit.name} width="40" height="40" />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          {snippetHit({ hit, attribute: 'name' })}
        </div>
        <div className="aa-ItemContentDescription">
          {snippetHit({ hit, attribute: 'description' })}
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-TouchOnly aa-ActiveOnly"
          type="button"
          title="Select"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
          </svg>
        </button>
      </div>
    </Fragment>
  );
}
```

### Modifier CSS classes

- `.aa-ItemIcon--no-border`: removes the border of the icon
- `.aa-ItemIcon--align-top`: aligns the icon to the top
