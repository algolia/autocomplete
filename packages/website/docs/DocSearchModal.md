---
id: DocSearchModal
---

This component displays the DocSearch modal.

# Example

```js
import React from 'react';
import { createPortal } from 'react-dom';

function App({ apiKey, indexName }) {
  const [isShowing, setIsShowing] = React.useState(false);

  return (
    <div>
      <header>
        <DocSearchButton onClick={() => setIsShowing(true)} />
      </header>

      {isShowing &&
        createPortal(
          <DocSearchModal
            apiKey={apiKey}
            indexName={indexName}
            onClose={() => setIsShowing(false)}
          />,
          document.body
        )}
    </div>
  );
}
```

# Reference

### `appId`

> `string` | defaults to `"BH4D9OD16A"`

The Algolia application ID.

### `apiKey`

> `string`

The Algolia search-only API key.

### `indexName`

> `string`

The Algolia index name.

### `placeholder`

> `string` | defaults to `"Search docs"`

The text that appears in the search box input when there is no query.

### `searchParameters`

> `SearchParameters`

[Search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/) to forward to Algolia.

### `onClose`

> `() => void`

Function to call when the DocSearch modal closes.

### `transformItems`

> `(items: DocSearchHit[]) => DocSearchHit[]`

Function to customize the hits before rendering them.

### `hitComponent`

> `(props: { hit: DocSearchHit; children: React.ReactNode; }): JSX.Element`

The component to use for a hit. It's useful to use a custom link component, or to customize the hits to display.

It defaults to:

```js
function Hit({ hit, children }) {
  return <a href={hit.url}>{children}</a>;
}
```

### `navigator`

> `Navigator`

[Navigator API](keyboard-navigation) to redirect the user when a link should be opened.
