---
id: autocomplete-theme-classic
---

import InstallClassicTheme from './partials/install-classic-theme.md';

The Classic theme provides styling for Autocomplete experiences.

The theme is designed as a neutral and clean starter. You can use it as a base and customize it with [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

If you want to build your own theme, you can [start from the Classic theme](https://github.com/algolia/autocomplete/tree/next/packages/autocomplete-theme-classic) and adjust it.

## Installation

First, you need to install the theme.

<InstallClassicTheme />

## CSS variables

The theme uses [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) that you can customize in your own CSS.

- `--aa-base-unit` ([number](https://developer.mozilla.org/en-US/docs/Web/CSS/number)) the base value used to calculate font sizes and spacing
- `--aa-font-size` ([length](https://developer.mozilla.org/en-US/docs/Web/CSS/length)) a fixed font size
- `--aa-spacing-factor` ([number](https://developer.mozilla.org/en-US/docs/Web/CSS/number)) the base value used to calculate spacing increments
- `--aa-spacing` ([length](https://developer.mozilla.org/en-US/docs/Web/CSS/length)) a fixed spacing value
- `--aa-spacing-half` ([length](https://developer.mozilla.org/en-US/docs/Web/CSS/length)) a fixed half spacing value
- `--aa-icon-size` ([length](https://developer.mozilla.org/en-US/docs/Web/CSS/length)) a fixed icon size value
- `--aa-primary-color` ([color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) the accent color
- `--aa-muted-color` ([color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) the muted color
- `--aa-selected-color` ([color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) the color for selected, active or focused elements
- `--aa-icon-color` ([color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) the color for the icon
- `--aa-text-color` ([color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) the global text color
- `--aa-content-text-color` ([color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) the text color for the content title and description
- `--aa-background-color` ([color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) the global background color
- `--aa-background-color-alpha-0` ([color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) the background color with a 0 alpha layer (useful for [gradients on Safari](https://css-tricks.com/thing-know-gradients-transparent-black/))
- `--aa-panel-shadow` ([box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)) the shadow for the panel
- `--aa-panel-max-height` ([length](https://developer.mozilla.org/en-US/docs/Web/CSS/length)) the maximum height for the panel before showing a vertical scroll bar
- `--aa-detached-media-query` ([media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)) the media query to enable [detached mode](detached-mode) on smaller devices
- `--aa-detached-modal-media-query` ([media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)) the media query to enable [detached mode](detached-mode) on bigger devices
- `--aa-detached-modal-max-width` ([length](https://developer.mozilla.org/en-US/docs/Web/CSS/length)) the maximum width of the modal in detached mode
- `--aa-detached-modal-max-height` ([length](https://developer.mozilla.org/en-US/docs/Web/CSS/length)) the maximum height of the modal in detached mode

To customize a value, you can create a custom stylesheet and override the variable.

```css title="CSS"
:root {
  --aa-icon-size: 24px;
}
```

Make sure to load these styles _after_ the theme.

## Templates

For the theme to work out of the box, you need to use a conventional CSS class set. All class names from the theme come with an `aa-` namespace to avoid interfering with your own styles.

### Item

Here's the markup for an [`item`](templates#item) template.

```jsx
autocomplete({
  // ...
  templates: {
    item({ item, components }) {
      return (
        <div className="aa-ItemWrapper">
          <div className="aa-ItemContent">
            <div className="aa-ItemIcon">
              <img src={item.image} alt={item.name} width="40" height="40" />
            </div>
            <div className="aa-ItemContentBody">
              <div className="aa-ItemContentTitle">
                <components.Snippet hit={item} attribute="name" />
              </div>
              <div className="aa-ItemContentDescription">
                <components.Snippet hit={item} attribute="description" />
              </div>
            </div>
          </div>
          <div className="aa-ItemActions">
            <button
              className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
              type="button"
              title="Select"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
              </svg>
            </button>
          </div>
        </div>
      );
    },
  },
});
```

### Link item

To wrap an item within a link, use the `.aa-ItemLink` class in place of the element with `.aa-ItemWrapper`. **Make sure not to use both together.**

```jsx
autocomplete({
  // ...
  templates: {
    item({ item }) {
      return (
        <a className="aa-ItemLink" href={item.url}>
          {/* ... */}
        </a>
      );
    },
  },
});
```

### Header

Here's the markup for a [`header`](templates#header) template.

```jsx
autocomplete({
  // ...
  templates: {
    header() {
      return (
        <Fragment>
          <span className="aa-SourceHeaderTitle">Products</span>
          <div className="aa-SourceHeaderLine" />
        </Fragment>
      );
    },
    // ...
  },
});
```

### No results

Here's the markup for a [`noResults`](templates#noresults) template.

```jsx
autocomplete({
  // ...
  templates: {
    noResults() {
      return 'No products for this query.';
    },
    // ...
  },
});
```

## Additional CSS classes

The theme provides a set of optional classes for you to use in different contexts.

### Modifiers

- `.aa-ItemIcon--noBorder` removes the border of the icon
- `.aa-ItemIcon--alignTop` aligns the icon to the top (recommended when the template is longer than three lines)
- `.aa-ItemIcon--picture` makes the icon larger (recommended when using an image and the template is longer than three lines)
- `.aa-Panel--scrollable` declares the scrollable container(s) of the panel

### Utilities

- `.aa-ActiveOnly` displays an element only when the item is active
- `.aa-DesktopOnly` displays an element only on desktop devices
- `.aa-TouchOnly` displays an element only on touch devices

## Dark mode

The theme supports dark mode. You can enable it on the `body` tag in two different ways:

- `<body data-theme="dark" />`
- `<body class="dark" />`
