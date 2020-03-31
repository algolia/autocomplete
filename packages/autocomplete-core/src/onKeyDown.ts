import { onInput } from './onInput';
import { getCompletion } from './completion';
import { getHighlightedItem } from './utils';

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

    store.send(event.key, { shiftKey: event.shiftKey });

    const nodeItem = props.environment.document.getElementById(
      `${props.id}-item-${store.getState().highlightedIndex}`
    );
    nodeItem?.scrollIntoView(false);

    if (
      store.getState().highlightedIndex !== null &&
      store
        .getState()
        .suggestions.some(suggestion => suggestion.items.length > 0)
    ) {
      const { item, itemValue, itemUrl, source } = getHighlightedItem({
        state: store.getState(),
      });

      source.onHighlight({
        suggestion: item,
        suggestionValue: itemValue,
        suggestionUrl: itemUrl,
        source,
        state: store.getState(),
        setHighlightedIndex,
        setQuery,
        setSuggestions,
        setIsOpen,
        setStatus,
        setContext,
        event,
      });
    }
  } else if (
    (event.key === 'Tab' ||
      // When the user hits the right arrow and is at the end of the input
      // query, we validate the completion.
      (event.key === 'ArrowRight' &&
        (event.target as HTMLInputElement).selectionStart ===
          store.getState().query.length)) &&
    props.showCompletion &&
    store.getState().highlightedIndex !== null
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
    }
  } else if (event.key === 'Escape') {
    // This prevents the default browser behavior on `input[type="search"]`
    // to remove the query right away because we first want to close the
    // dropdown.
    event.preventDefault();

    store.send(event.key, null);
  } else if (event.key === 'Enter') {
    // No item is selected, so we let the browser handle the native `onSubmit`
    // form event.
    if (
      store.getState().highlightedIndex === null ||
      store
        .getState()
        .suggestions.every(suggestion => suggestion.items.length === 0)
    ) {
      return;
    }

    // This prevents the `onSubmit` event to be sent because an item is
    // highlighted.
    event.preventDefault();

    const { item, itemValue, itemUrl, source } = getHighlightedItem({
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
        query: itemValue,
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
      }).then(() => {
        source.onSelect({
          suggestion: item,
          suggestionValue: itemValue,
          suggestionUrl: itemUrl,
          source,
          state: store.getState(),
          setHighlightedIndex,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
          event,
        });
      });

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
