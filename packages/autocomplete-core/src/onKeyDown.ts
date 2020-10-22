import { getCompletion } from './getCompletion';
import { onInput } from './onInput';
import {
  InternalAutocompleteOptions,
  AutocompleteSetters,
  AutocompleteStore,
  AutocompleteRefresh,
} from './types';
import { getHighlightedItem } from './utils';

interface OnKeyDownOptions<TItem> extends AutocompleteSetters<TItem> {
  event: KeyboardEvent;
  store: AutocompleteStore<TItem>;
  props: InternalAutocompleteOptions<TItem>;
  refresh: AutocompleteRefresh;
}

export function onKeyDown<TItem>({
  event,
  store,
  props,
  setSelectedItemId,
  setQuery,
  setSuggestions,
  setIsOpen,
  setStatus,
  setContext,
  refresh,
}: OnKeyDownOptions<TItem>): void {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    // Default browser behavior changes the caret placement on ArrowUp and
    // Arrow down.
    event.preventDefault();

    store.send(event.key, null);

    const nodeItem = props.environment.document.getElementById(
      `${props.id}-item-${store.getState().highlightedIndex}`
    );

    if (nodeItem) {
      if ((nodeItem as any).scrollIntoViewIfNeeded) {
        (nodeItem as any).scrollIntoViewIfNeeded(false);
      } else {
        nodeItem.scrollIntoView(false);
      }
    }

    const highlightedItem = getHighlightedItem({
      state: store.getState(),
    });

    if (store.getState().highlightedIndex !== null && highlightedItem) {
      const { item, itemValue, itemUrl, source } = highlightedItem;

      source.onHighlight({
        suggestion: item,
        suggestionValue: itemValue,
        suggestionUrl: itemUrl,
        source,
        state: store.getState(),
        setSelectedItemId,
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
    props.enableCompletion &&
    store.getState().highlightedIndex !== null
  ) {
    event.preventDefault();

    const query = getCompletion({ state: store.getState(), props });

    if (query) {
      onInput({
        query,
        event,
        store,
        props,
        setSelectedItemId,
        setQuery,
        setSuggestions,
        setIsOpen,
        setStatus,
        setContext,
        refresh,
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
        .suggestions.every((suggestion) => suggestion.items.length === 0)
    ) {
      return;
    }

    // This prevents the `onSubmit` event to be sent because an item is
    // highlighted.
    event.preventDefault();

    const { item, itemValue, itemUrl, source } = getHighlightedItem({
      state: store.getState(),
    })!;

    if (event.metaKey || event.ctrlKey) {
      if (itemUrl !== undefined) {
        source.onSelect({
          suggestion: item,
          suggestionValue: itemValue,
          suggestionUrl: itemUrl,
          source,
          state: store.getState(),
          setSelectedItemId,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
          event,
        });
        props.navigator.navigateNewTab({
          suggestionUrl: itemUrl,
          suggestion: item,
          state: store.getState(),
        });
      }
    } else if (event.shiftKey) {
      if (itemUrl !== undefined) {
        source.onSelect({
          suggestion: item,
          suggestionValue: itemValue,
          suggestionUrl: itemUrl,
          source,
          state: store.getState(),
          setSelectedItemId,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
          event,
        });
        props.navigator.navigateNewWindow({
          suggestionUrl: itemUrl,
          suggestion: item,
          state: store.getState(),
        });
      }
    } else if (event.altKey) {
      // Keep native browser behavior
    } else {
      if (itemUrl !== undefined) {
        source.onSelect({
          suggestion: item,
          suggestionValue: itemValue,
          suggestionUrl: itemUrl,
          source,
          state: store.getState(),
          setSelectedItemId,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
          event,
        });
        props.navigator.navigate({
          suggestionUrl: itemUrl,
          suggestion: item,
          state: store.getState(),
        });

        return;
      }

      onInput({
        query: itemValue,
        event,
        store,
        props,
        setSelectedItemId,
        setQuery,
        setSuggestions,
        setIsOpen,
        setStatus,
        setContext,
        nextState: {
          isOpen: false,
        },
        refresh,
      }).then(() => {
        source.onSelect({
          suggestion: item,
          suggestionValue: itemValue,
          suggestionUrl: itemUrl,
          source,
          state: store.getState(),
          setSelectedItemId,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
          event,
        });
      });
    }
  }
}
