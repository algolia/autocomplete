---
id: DocSearchModal
---

This component displays the DocSearch modal.

It can be useful to use this component instead of [`DocSearch`](DocSearch) to have better control over when to open the modal, or to lazy load the modal.

# Example

```js
import React from 'react';
import { createPortal } from 'react-dom';
import {
  DocSearchButton,
  DocSearchModal,
  useDocSearchEvent,
} from '@docsearch/react';

import '@docsearch/react/style';

function Search({ apiKey, indexName }) {
  const searchButtonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialQuery, setInitialQuery] = React.useState(null);

  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onInput = React.useCallback(
    (event) => {
      setIsOpen(true);
      setInitialQuery(event.key);
    },
    [setIsOpen, setInitialQuery]
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  return (
    <React.Fragment>
      <DocSearchButton ref={searchButtonRef} onClick={onOpen} />

      {isOpen &&
        createPortal(
          <DocSearchModal
            apiKey={apiKey}
            indexName={indexName}
            onClose={onClose}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
          />,
          document.body
        )}
    </React.Fragment>
  );
}
```

<!-- prettier-ignore -->
:::info
All objects or functions passed to `DocSearchModal` should be memoized so that DocSearch doesn't trigger other renders and loses its state.
:::

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

### `initialQuery`

> `string`

The initial query when the modal opens.

### `onClose`

> `() => void`

Function to call when the DocSearch modal closes.

### `transformItems`

> `(items: DocSearchHit[]) => DocSearchHit[]`

Function to customize the hits before rendering them.

### `transformSearchClient`

> `(searchClient: SearchClient) => SearchClient`

Function to transform the [Algolia search client](https://github.com/algolia/algoliasearch-client-javascript). It can be useful to alter or proxy requests.

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

### `disableUserPersonalization`

> `boolean` | defaults to `false`

Whether to disable all personalized features: recent searches, favorite searches.
