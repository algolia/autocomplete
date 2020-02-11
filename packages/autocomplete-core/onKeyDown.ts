import { stateReducer } from './stateReducer';
import { onInput } from './onInput';
import { getCompletion } from './completion';
import {
  getSuggestionFromHighlightedIndex,
  getRelativeHighlightedIndex,
} from './utils';

import {
  AutocompleteStore,
  AutocompleteOptions,
  AutocompleteSetters,
} from './types';

interface OnKeyDownOptions<TItem> extends AutocompleteSetters<TItem> {
  event: KeyboardEvent;
  store: AutocompleteStore<TItem>;
  props: AutocompleteOptions<TItem>;
}

export function onKeyDown<TItem>({
  event,
  store,
  props,
  setHighlightedIndex,
  setQuery,
  setSuggestions,
  setIsOpen,
  setStatus,
  setContext,
}: OnKeyDownOptions<TItem>): void {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    // Default browser behavior changes the caret placement on ArrowUp and
    // Arrow down.
    event.preventDefault();

    store.setState(
      stateReducer(
        store.getState(),
        {
          type: event.key,
          value: { shiftKey: event.shiftKey },
        },
        props
      )
    );
    props.onStateChange({ state: store.getState() });

    const nodeItem = props.environment.document.getElementById(
      `${props.id}-item-${store.getState().highlightedIndex}`
    );
    nodeItem?.scrollIntoView(false);
  } else if (
    (event.key === 'Tab' ||
      // When the user hits the right arrow and is at the end of the input
      // query, we validate the completion.
      (event.key === 'ArrowRight' &&
        (event.target as HTMLInputElement).selectionStart ===
          store.getState().query.length)) &&
    props.showCompletion &&
    store.getState().highlightedIndex >= 0
  ) {
    event.preventDefault();

    const query = getCompletion({ state: store.getState(), props });

    if (query) {
      onInput({
        query,
        store,
        props,
        setHighlightedIndex,
        setQuery,
        setSuggestions,
        setIsOpen,
        setStatus,
        setContext,
      });

      props.onStateChange({ state: store.getState() });
    }
  } else if (event.key === 'Escape') {
    // This prevents the default browser behavior on `input[type="search"]`
    // to remove the query right away because we first want to close the
    // dropdown.
    event.preventDefault();

    store.setState(
      stateReducer(
        store.getState(),
        {
          type: event.key,
          value: {},
        },
        props
      )
    );
    props.onStateChange({ state: store.getState() });
  } else if (event.key === 'Enter') {
    if (store.getState().highlightedIndex < 0) {
      return;
    }

    const suggestion = getSuggestionFromHighlightedIndex({
      state: store.getState(),
    });

    const item =
      suggestion.items[
        getRelativeHighlightedIndex({ state: store.getState(), suggestion })
      ];

    if (item) {
      // This prevents the `onSubmit` event to be sent when an item is selected.
      event.preventDefault();
    }

    const itemUrl = suggestion.source.getSuggestionUrl({
      suggestion: item,
      state: store.getState(),
    });
    const inputValue = suggestion.source.getInputValue({
      suggestion: item,
      state: store.getState(),
    });

    if (event.metaKey || event.ctrlKey) {
      if (itemUrl !== undefined) {
        props.navigator.navigateNewTab({
          suggestionUrl: itemUrl,
          suggestion: item,
          state: store.getState(),
        });
      }
    } else if (event.shiftKey) {
      if (itemUrl !== undefined) {
        props.navigator.navigateNewWindow({
          suggestionUrl: itemUrl,
          suggestion: item,
          state: store.getState(),
        });
      }
    } else if (event.altKey) {
      // Keep native browser behavior
    } else {
      onInput({
        query: inputValue,
        store,
        props,
        setHighlightedIndex,
        setQuery,
        setSuggestions,
        setIsOpen,
        setStatus,
        setContext,
        nextState: {
          isOpen: false,
        },
      });

      props.onStateChange({ state: store.getState() });

      if (itemUrl !== undefined) {
        props.navigator.navigate({
          suggestionUrl: itemUrl,
          suggestion: item,
          state: store.getState(),
        });
      }
    }
  }
}
