---
id: DocSearchModal
---

This component displays the DocSearch modal.

It can be useful to use this component instead of [`DocSearch`](DocSearch) to have better control over when to open the modal, or to lazy load the modal.

## Example

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

## Props

import DocSearchProps from './partials/docsearch-props.md'

<DocSearchProps />

### `onClose`

> `() => void`

Function to call when the DocSearch modal closes.

### `initialScrollY`

> number | defaults to `0`

The vertical scroll value when the modal was opened to scroll back to that position when the modal is closed.
