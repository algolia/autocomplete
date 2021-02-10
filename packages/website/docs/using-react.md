---
id: using-react
title: Using Autocomplete with React
---

Learn how to create and use a React Autocomplete component.

This guide shows how to create a React Autocomplete component. It uses the [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) and [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hooks to create and mount the component. It doesn't define specific [sources](sources). Rather, you can pass [sources](sources) and other [options](basic-options) as [props](https://reactjs.org/docs/components-and-props.html).

## Prerequisites

This tutorial assumes that you have:
- an existing [React (v16.8+) application](https://reactjs.org/docs/getting-started.html) where you want to implement the autocomplete menu
- familiarity with the [basic Autocomplete configuration options](basic-options)

## Creating the component

Start with some boilerplate for creating a React component. This component uses the [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) hook to create a mutable ref object, `containerRef`, to mount the autocomplete on. To learn more about this hook, check out the [`useRef` React documentation](https://reactjs.org/docs/hooks-reference.html#useref).

 All that you need to render is a `div` with the `containerRef` as the `ref`.

```jsx title="Autocomplete.jsx"
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';

export function Autocomplete(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
  }, [props]);

  return (
    <div
      ref={containerRef}
    />
  );
}
```

### Mounting the autocomplete

Now that you have access to the DOM through the `containerRef` object, you can create and mount the Autocomplete instance.

You can use the same [Autocomplete options](basic-options), but you must also pass the `renderer` and `render` parameters. You can rely on `props` to pass any Autocomplete options you want to remain configurable.

Don't forget to [clean up the effect](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect) by returning a function that destroys the Autocomplete instance.

```jsx title="Autocomplete.jsx"
import { autocomplete } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';

export function Autocomplete(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment },
      render({ children }, root) {
        render(children, root);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return (
    <div
      ref={containerRef}
    />
  );
}
```

## Using the component

Now that you've created an `<Autocomplete/>` component, you can use it in your React application.

The example component sets only the [`container`](autocomplete-js/#container) option. It specifies where to mount your Autocomplete component, but lets all other [options](basic-options) get configured through props.

The example below sets [`openOnFocus`](autocomplete-js#openonfocus) and [sources](sources) (via [`plugins`](plugins)) through props. This example uses [recent searches](adding-recent-searches) as a [source](sources), but you could use anything else you want.

The  Autocomplete library provides the [`createLocalStorageRecentSearchesPlugin`](createlocalstoragerecentsearchesplugin) function for creating a recent searches [plugin](plugins) out-of-the-box. To use it, you need to provide a `key` and `limit`.

The `key` can be any string and is required to differentiate search histories if you have multiple autocompletes on one page. The `limit` defines the maximum number of recent searches to display.

```jsx title=App.jsx"
import React from 'react';
import { Autocomplete } from './components/Autocomplete';
import { createLocalStorageRecentSearchesPlugin } from 'autocomplete-plugin-recent-searches';

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});

function App() {
  return (
    <div className="app-container">
      <h1>React Application</h1>
      <Autocomplete
        plugins={[recentSearchesPlugin]}
        openOnFocus={true}
      />
    </div>
  );
}

export default App;
```


## Further UI customization

If you want to build a custom UI that differs from the `autocomplete-js` output, check out the [guide on creating a custom renderer](creating-a-renderer). This guide outlines how to create a custom React renderer specifically, but the underlying principles are the same for any other front-end framework.
