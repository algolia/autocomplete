import { onInput } from './onInput';
import {
  ActionType,
  AutocompleteScopeApi,
  AutocompleteStore,
  BaseItem,
  InternalAutocompleteOptions,
} from './types';
import { getActiveItem, getAutocompleteElementId } from './utils';

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
    // eslint-disable-next-line no-inner-declarations
    function triggerScrollIntoView() {
      const highlightedItem = getActiveItem(store.getState());

      const nodeItem = props.environment.document.getElementById(
        getAutocompleteElementId(
          props.id,
          `item-${store.getState().activeItemId}`,
          highlightedItem?.source
        )
      );

      if (nodeItem) {
        if ((nodeItem as any).scrollIntoViewIfNeeded) {
          (nodeItem as any).scrollIntoViewIfNeeded(false);
        } else {
          nodeItem.scrollIntoView(false);
        }
      }
    }

    // eslint-disable-next-line no-inner-declarations
    function triggerOnActive() {
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
    }

    // Default browser behavior changes the caret placement on ArrowUp and
    // ArrowDown.
    event.preventDefault();

    // When re-opening the panel, we need to split the logic to keep the actions
    // synchronized as `onInput` returns a promise.
    if (
      store.getState().isOpen === false &&
      (props.openOnFocus || Boolean(store.getState().query))
    ) {
      onInput({
        event,
        props,
        query: store.getState().query,
        refresh,
        store,
        ...setters,
      }).then(() => {
        store.dispatch(event.key as ActionType, {
          nextActiveItemId: props.defaultActiveItemId,
        });

        triggerOnActive();
        // Since we rely on the DOM, we need to wait for all the micro tasks to
        // finish (which include re-opening the panel) to make sure all the
        // elements are available.
        setTimeout(triggerScrollIntoView, 0);
      });
    } else {
      store.dispatch(event.key, {});

      triggerOnActive();
      triggerScrollIntoView();
    }
  } else if (event.key === 'Escape') {
    // This prevents the default browser behavior on `input[type="search"]`
    // from removing the query right away because we first want to close the
    // panel.
    event.preventDefault();

    store.dispatch(event.key, null);

    // Hitting the `Escape` key signals the end of a user interaction with the
    // autocomplete. At this point, we should ignore any requests that are still
    // pending and could reopen the panel once they resolve, because that would
    // result in an unsolicited UI behavior.
    store.pendingRequests.cancelAll();
  } else if (event.key === 'Tab') {
    store.dispatch('blur', null);

    // Hitting the `Tab` key signals the end of a user interaction with the
    // autocomplete. At this point, we should ignore any requests that are still
    // pending and could reopen the panel once they resolve, because that would
    // result in an unsolicited UI behavior.
    store.pendingRequests.cancelAll();
  } else if (event.key === 'Enter') {
    // No active item, so we let the browser handle the native `onSubmit` form
    // event.
    if (
      store.getState().activeItemId === null ||
      store
        .getState()
        .collections.every((collection) => collection.items.length === 0)
    ) {
      // If requests are still pending when the panel closes, they could reopen
      // the panel once they resolve.
      // We want to prevent any subsequent query from reopening the panel
      // because it would result in an unsolicited UI behavior.
      if (!props.debug) {
        store.pendingRequests.cancelAll();
      }

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
