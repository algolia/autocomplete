---
id: creating-a-renderer
title: Creating a Renderer
---

Learn how to build an autocomplete UI using React.

The [`autocomplete-js`](autocomplete-js) package includes everything you need to render a JavaScript autocomplete experience that you can bind to [your own framework](autocomplete-js#renderer). If you want to build a custom UI that differs from the `autocomplete-js` output, for example in [React](https://reactjs.org/docs/getting-started.html) or another front-end framework, the [`autocomplete-core`](createAutocomplete) package provides all the primitives to build it.

This guide shows how to leverage all the autocomplete capacities to build an accessible autocomplete, both for desktop and mobile, with React. You can find the final result in [this sandbox](https://codesandbox.io/s/github/algolia/autocomplete.js/tree/next/examples/react-renderer?file=/src/Autocomplete.tsx).

## Importing the package

Begin by importing [`createAutocomplete`](createAutocomplete) from the [core package](createAutocomplete) and [`getAlgoliaHits`](getAlgoliaHits) from the [Algolia preset](getAlgoliaHits). The preset—[`autocomplete-preset-algolia`](autocomplete-js)—is a utility function to retrieve items from an Algolia index.

```js title="Autocomplete.jsx"
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';

// ...
```

## Initializing Autocomplete

The Autocomplete entry point is the [`createAutocomplete`](createAutocomplete) function, which returns the methods to create the autocomplete experience.

```js title="Autocomplete.jsx"
const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

function Autocomplete() {
  // (1) Create a React state.
  const [autocompleteState, setAutocompleteState] = React.useState({});
  const autocomplete = React.useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          // (2) Synchronize the Autocomplete state with the React state.
          setAutocompleteState(state);
        },
        getSources() {
          return [
            // (3) Use an Algolia index source.
            {
              sourceId: 'products',
              getItemInputValue({ item }) {
                return item.query;
              },
              getItems({ query }) {
                return getAlgoliaHits({
                  searchClient,
                  queries: [
                    {
                      indexName: 'instant_search',
                      query,
                      params: {
                        hitsPerPage: 4,
                        highlightPreTag: '<mark>',
                        highlightPostTag: '</mark>',
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return item.url;
              },
            },
          ];
        },
      }),
    []
  );

  // ...
}
```

Note the following commented portions:
- (1) You can leverage a React state for the autocomplete component to re-render when the [Autocomplete state](state) changes.
- (2) You can listen to all Autocomplete state changes to synchronize them with the React state.
- (3) This example uses an Algolia index as a [source](sources).

This setup gives you access to all the methods you may want to use in the `autocomplete` variable in your React components. Next, you can start building the UI.

## Using prop getters

[Prop getters](prop-getters) are methods that return props to use in your components. These props contain accessibility features, event handlers, etc. You don't have to know exactly what they're doing. Their responsibility is to create a complete experience without exposing the underlying technical elements.

This following snippet shows how you can use the [`getRootProps()`, `getInputProps()`, `getPanelProps()`, `getListProps()`, and `getItemProps()` prop getters](createAutocomplete#returns) in the appropriate elements.

```jsx title="Autocomplete.jsx"
function Autocomplete() {
  // ...

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <input className="aa-Input" {...autocomplete.getInputProps({})} />
      <div className="aa-Panel" {...autocomplete.getPanelProps({})}>
        {autocompleteState.isOpen &&
          autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection;

            return (
              <section key={`source-${index}`} className="aa-Source">
                {items.length > 0 && (
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item) => (
                      <li
                        key={item.objectID}
                        className="aa-Item"
                        {...autocomplete.getItemProps({
                          item,
                          source,
                        })}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
      </div>
    </div>
  );
}
```

The above code demonstrates that you don't need to worry about keyboard events, or tracking which item is active. Autocomplete handles this under the hood with its prop getters.

At this point, you should already have a usable autocomplete input:

![Image](https://user-images.githubusercontent.com/6137112/83744493-7f3b0d80-a65c-11ea-9daf-ff14888f6028.png)

## Improving input accessibility

To improve the `input` control, you can wrap it in a `form` and apply the form props given by Autocomplete:

```jsx title="Autocomplete.jsx"
function Autocomplete() {
  // ...
  const inputRef = React.useRef(null);

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <input ref={inputRef} {...autocomplete.getInputProps({})} />
      </form>
      {/* ... */}
    </div>
  );
}
```

The `getFormProps` prop getter handles submit and reset events. It also respectively blurs and focuses the input when these events happen. You need to pass the `inputElement` when calling `getFormProps` to leverage this functionality.

You can also add a label that represents the input and use the `getLabelProps` prop getter:

```jsx title="Autocomplete.jsx"
function Autocomplete() {
  // ...
  const inputRef = React.useRef(null);

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <div className="aa-InputWrapperPrefix">
          <label className="aa-Label" {...autocomplete.getLabelProps({})}>
            Search
          </label>
        </div>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input"
            ref={inputRef}
            {...autocomplete.getInputProps({})}
          />
        </div>
      </form>
      {/* ... */}
    </div>
  );
}
```

Another good practice for search inputs is to display a reset button. You can conditionally display it based on if there's a query.

```jsx title="Autocomplete.jsx"
function Autocomplete() {
  // ...

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <div className="aa-InputWrapperPrefix">
          <label className="aa-Label" {...autocomplete.getLabelProps({})}>
            Search
          </label>
        </div>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input"
            ref={inputRef}
            {...autocomplete.getInputProps({})}
          />
        </div>
        <div className="aa-InputWrapperSuffix">
          <button className="aa-ResetButton" type="reset">
            ｘ
          </button>
        </div>
      </form>
      {/* ... */}
    </div>
  );
}
```

## Reacting to the network

Displaying UI hints when the network is unstable helps users understand why results are not updating in real time. You can rely on the [`status`](state/#status) to determine this:

```jsx title="Autocomplete.jsx"
function Autocomplete() {
  // ...

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      {/* ... */}

      {autocompleteState.isOpen && (
        <div
          className={[
            'aa-Panel',
            autocompleteState.status === 'stalled' && 'aa-Panel--stalled',
          ]
            .filter(Boolean)
            .join(' ')}
          {...autocomplete.getPanelProps({})}
        >
          {/* ... */}
        </div>
      )}
      {/* ... */}
    </div>
  );
}
```

You could, for example, create a `.aa-Panel--stalled` CSS class that lowers items' opacity. This convention hints that search is currently stuck or unavailable.

![Image](https://user-images.githubusercontent.com/6137112/83759558-034cbf80-a674-11ea-86ca-6728b4c2d6f7.png)

You can learn more about other state properties in the [state documentation](state).

## Mirroring a native mobile experience

Native platforms offer better primitives for mobile search experiences. Autocomplete aims at providing these capabilities so that the web mobile experience is closer to the the native mobile experience.

A common feature in mobile native experiences is to close the virtual keyboard when the user starts scrolling. This makes the results more discoverable without the user having to manually close the keyboard.

The `getEnvironmentProps` method returns event handlers that let you create this experience:

```jsx title="Autocomplete.jsx"
function Autocomplete() {
  // ...

  const inputRef = React.useRef(null);
  const formRef = React.useRef(null);
  const panelRef = React.useRef(null);

  const { getEnvironmentProps } = autocomplete;

  React.useEffect(() => {
    if (!(formRef.current && panelRef.current && inputRef.current)) {
      return;
    }

    const { onTouchStart, onTouchMove } = getEnvironmentProps({
      formElement: formRef.current,
      panelElement: panelRef.current,
      inputElement: inputRef.current,
    });

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [getEnvironmentProps, formRef, panelRef, inputRef]);

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        ref={formRef}
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        {/* ... */}
      </form>

      {autocompleteState.isOpen && (
        <div
          ref={panelRef}
          className={[
            'aa-Panel',
            autocompleteState.status === 'stalled' && 'aa-Panel--stalled',
          ]
            .filter(Boolean)
            .join(' ')}
          {...autocomplete.getPanelProps({})}
        >
          {/* ... */}
        </div>
      )}
    </div>
  );
}
```

This way, users feel a bit closer to what they're used to on mobile apps.

## Help and discussion

You now have enough knowledge to build your own experience based on Autocomplete. If you find that some topics weren't covered, feel free to [open an issue](https://github.com/algolia/autocomplete.js/issues/new).
