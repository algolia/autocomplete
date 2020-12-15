import { onInput } from './onInput';
import {
  AutocompleteScopeApi,
  AutocompleteStore,
  BaseItem,
  InternalAutocompleteOptions,
} from './types';
import { getActiveItem } from './utils';

interface OnKeyDownOptions<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  event: KeyboardEvent;
  props: InternalAutocompleteOptions<TItem>;
  store: AutocompleteStore<TItem>;
}

export function onKeyDown<TItem extends BaseItem>({
  event,
  props,
  refresh,
  store,
  ...setters
}: OnKeyDownOptions<TItem>): void {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    // Default browser behavior changes the caret placement on ArrowUp and
    // Arrow down.
    event.preventDefault();

    store.dispatch(event.key, null);

    const nodeItem = props.environment.document.getElementById(
      `${props.id}-item-${store.getState().activeItemId}`
    );

    if (nodeItem) {
      if ((nodeItem as any).scrollIntoViewIfNeeded) {
        (nodeItem as any).scrollIntoViewIfNeeded(false);
      } else {
        nodeItem.scrollIntoView(false);
      }
    }

    const highlightedItem = getActiveItem(store.getState());

    if (store.getState().activeItemId !== null && highlightedItem) {
      const { item, itemInputValue, itemUrl, source } = highlightedItem;

      source.onActive({
        event,
        item,
        itemInputValue,
        itemUrl,
        refresh,
        source,
        state: store.getState(),
        ...setters,
      });
    }
  } else if (event.key === 'Escape') {
    // This prevents the default browser behavior on `input[type="search"]`
    // from removing the query right away because we first want to close the
    // panel.
    event.preventDefault();

    store.dispatch(event.key, null);
  } else if (event.key === 'Enter') {
    // No active item, so we let the browser handle the native `onSubmit` form
    // event.
    if (
      store.getState().activeItemId === null ||
      store
        .getState()
        .collections.every((collection) => collection.items.length === 0)
    ) {
      return;
    }

    // This prevents the `onSubmit` event to be sent because an item is
    // highlighted.
    event.preventDefault();

    const { item, itemInputValue, itemUrl, source } = getActiveItem(
      store.getState()
    )!;

    if (event.metaKey || event.ctrlKey) {
      if (itemUrl !== undefined) {
        source.onSelect({
          event,
          item,
          itemInputValue,
          itemUrl,
          refresh,
          source,
          state: store.getState(),
          ...setters,
        });
        props.navigator.navigateNewTab({
          itemUrl,
          item,
          state: store.getState(),
        });
      }
    } else if (event.shiftKey) {
      if (itemUrl !== undefined) {
        source.onSelect({
          event,
          item,
          itemInputValue,
          itemUrl,
          refresh,
          source,
          state: store.getState(),
          ...setters,
        });
        props.navigator.navigateNewWindow({
          itemUrl,
          item,
          state: store.getState(),
        });
      }
    } else if (event.altKey) {
      // Keep native browser behavior
    } else {
      if (itemUrl !== undefined) {
        source.onSelect({
          event,
          item,
          itemInputValue,
          itemUrl,
          refresh,
          source,
          state: store.getState(),
          ...setters,
        });
        props.navigator.navigate({
          itemUrl,
          item,
          state: store.getState(),
        });

        return;
      }

      onInput({
        event,
        nextState: { isOpen: false },
        props,
        query: itemInputValue,
        refresh,
        store,
        ...setters,
      }).then(() => {
        source.onSelect({
          event,
          item,
          itemInputValue,
          itemUrl,
          refresh,
          source,
          state: store.getState(),
          ...setters,
        });
      });
    }
  }
}
