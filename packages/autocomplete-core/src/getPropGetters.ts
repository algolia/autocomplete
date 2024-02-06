import { noop } from '@algolia/autocomplete-shared';

import { onInput } from './onInput';
import { onKeyDown } from './onKeyDown';
import {
  AutocompleteScopeApi,
  AutocompleteStore,
  BaseItem,
  GetEnvironmentProps,
  GetFormProps,
  GetInputProps,
  GetItemProps,
  GetLabelProps,
  GetListProps,
  GetPanelProps,
  GetRootProps,
  InternalAutocompleteOptions,
} from './types';
import {
  getActiveItem,
  getAutocompleteElementId,
  isOrContainsNode,
  isSamsung,
  getNativeEvent,
} from './utils';

interface GetPropGettersOptions<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  store: AutocompleteStore<TItem>;
  props: InternalAutocompleteOptions<TItem>;
}

export function getPropGetters<
  TItem extends BaseItem,
  TEvent,
  TMouseEvent,
  TKeyboardEvent
>({ props, refresh, store, ...setters }: GetPropGettersOptions<TItem>) {
  const getEnvironmentProps: GetEnvironmentProps = (providedProps) => {
    const { inputElement, formElement, panelElement, ...rest } = providedProps;

    function onMouseDownOrTouchStart(event: MouseEvent | TouchEvent) {
      // The `onTouchStart`/`onMouseDown` events shouldn't trigger the `blur`
      // handler when it's not an interaction with Autocomplete.
      // We detect it with the following heuristics:
      // - the panel is closed AND there are no pending requests
      //   (no interaction with the autocomplete, no future state updates)
      // - OR the touched target is the input element (should open the panel)
      const isAutocompleteInteraction =
        store.getState().isOpen || !store.pendingRequests.isEmpty();

      if (!isAutocompleteInteraction || event.target === inputElement) {
        return;
      }

      // @TODO: support cases where there are multiple Autocomplete instances.
      // Right now, a second instance makes this computation return false.
      const isTargetWithinAutocomplete = [formElement, panelElement].some(
        (contextNode) => {
          return isOrContainsNode(contextNode, event.target as Node);
        }
      );

      if (isTargetWithinAutocomplete === false) {
        store.dispatch('blur', null);

        // If requests are still pending when the user closes the panel, they
        // could reopen the panel once they resolve.
        // We want to prevent any subsequent query from reopening the panel
        // because it would result in an unsolicited UI behavior.
        if (!props.debug) {
          store.pendingRequests.cancelAll();
        }
      }
    }

    return {
      // We do not rely on the native `blur` event of the input to close the
      // panel, but rather on a custom `touchstart`/`mousedown` event outside
      // of the autocomplete elements.
      // This ensures we don't mistakenly interpret interactions within the
      // autocomplete (but outside of the input) as a signal to close the panel.
      // For example, clicking reset button causes an input blur, but if
      // `openOnFocus=true`, it shouldn't close the panel.
      // On touch devices, scrolling results (`touchmove`) causes an input blur
      // but shouldn't close the panel.
      onTouchStart: onMouseDownOrTouchStart,
      onMouseDown: onMouseDownOrTouchStart,
      // When scrolling on touch devices (mobiles, tablets, etc.), we want to
      // mimic the native platform behavior where the input is blurred to
      // hide the virtual keyboard. This gives more vertical space to
      // discover all the suggestions showing up in the panel.
      onTouchMove(event: TouchEvent) {
        if (
          store.getState().isOpen === false ||
          inputElement !== props.environment.document.activeElement ||
          event.target === inputElement
        ) {
          return;
        }

        inputElement.blur();
      },
      ...rest,
    };
  };

  const getRootProps: GetRootProps = (rest) => {
    return {
      role: 'combobox',
      'aria-expanded': store.getState().isOpen,
      'aria-haspopup': 'listbox',
      'aria-owns': store.getState().isOpen
        ? store
            .getState()
            .collections.map(({ source }) =>
              getAutocompleteElementId(props.id, 'list', source)
            )
            .join(' ')
        : undefined,
      'aria-labelledby': getAutocompleteElementId(props.id, 'label'),
      ...rest,
    };
  };

  const getFormProps: GetFormProps<TEvent> = (providedProps) => {
    const { inputElement, ...rest } = providedProps;

    return {
      action: '',
      noValidate: true,
      role: 'search',
      onSubmit: (event) => {
        (event as unknown as Event).preventDefault();

        props.onSubmit({
          event,
          refresh,
          state: store.getState(),
          ...setters,
        });

        store.dispatch('submit', null);
        providedProps.inputElement?.blur();
      },
      onReset: (event) => {
        (event as unknown as Event).preventDefault();

        props.onReset({
          event,
          refresh,
          state: store.getState(),
          ...setters,
        });

        store.dispatch('reset', null);
        providedProps.inputElement?.focus();
      },
      ...rest,
    };
  };

  const getInputProps: GetInputProps<TEvent, TMouseEvent, TKeyboardEvent> = (
    providedProps
  ) => {
    function onFocus(event: TEvent) {
      // We want to trigger a query when `openOnFocus` is true
      // because the panel should open with the current query.
      if (props.openOnFocus || Boolean(store.getState().query)) {
        onInput({
          event,
          props,
          query: store.getState().completion || store.getState().query,
          refresh,
          store,
          ...setters,
        });
      }

      store.dispatch('focus', null);
    }

    const { inputElement, maxLength = 512, ...rest } = providedProps || {};
    const activeItem = getActiveItem(store.getState());

    const userAgent = props.environment.navigator?.userAgent || '';
    const shouldFallbackKeyHint = isSamsung(userAgent);
    const enterKeyHint =
      props.enterKeyHint ||
      (activeItem?.itemUrl && !shouldFallbackKeyHint ? 'go' : 'search');

    return {
      'aria-autocomplete': 'both',
      'aria-activedescendant':
        store.getState().isOpen && store.getState().activeItemId !== null
          ? getAutocompleteElementId(
              props.id,
              `item-${store.getState().activeItemId}`,
              activeItem?.source
            )
          : undefined,
      'aria-controls': store.getState().isOpen
        ? store
            .getState()
            .collections.map(({ source }) =>
              getAutocompleteElementId(props.id, 'list', source)
            )
            .join(' ')
        : undefined,
      'aria-labelledby': getAutocompleteElementId(props.id, 'label'),
      value: store.getState().completion || store.getState().query,
      id: getAutocompleteElementId(props.id, 'input'),
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'off',
      enterKeyHint,
      spellCheck: 'false',
      autoFocus: props.autoFocus,
      placeholder: props.placeholder,
      maxLength,
      type: 'search',
      onChange: (event) => {
        const value = (
          (event as unknown as Event).currentTarget as HTMLInputElement
        ).value;

        if (
          props.ignoreCompositionEvents &&
          getNativeEvent(event as unknown as InputEvent).isComposing
        ) {
          setters.setQuery(value);
          return;
        }

        onInput({
          event,
          props,
          query: value.slice(0, maxLength),
          refresh,
          store,
          ...setters,
        });
      },
      onCompositionEnd: (event) => {
        onInput({
          event,
          props,
          query: (
            (event as unknown as Event).currentTarget as HTMLInputElement
          ).value.slice(0, maxLength),
          refresh,
          store,
          ...setters,
        });
      },
      onKeyDown: (event) => {
        if (getNativeEvent(event as unknown as InputEvent).isComposing) {
          return;
        }

        onKeyDown({
          event: event as unknown as KeyboardEvent,
          props,
          refresh,
          store,
          ...setters,
        });
      },
      onFocus,
      // We don't rely on the `blur` event.
      // See explanation in `onTouchStart`/`onMouseDown`.
      // @MAJOR See if we need to keep this handler.
      onBlur: noop,
      onClick: (event) => {
        // When the panel is closed and you click on the input while
        // the input is focused, the `onFocus` event is not triggered
        // (default browser behavior).
        // In an autocomplete context, it makes sense to open the panel in this
        // case.
        // We mimic this event by catching the `onClick` event which
        // triggers the `onFocus` for the panel to open.
        if (
          providedProps.inputElement ===
            props.environment.document.activeElement &&
          !store.getState().isOpen
        ) {
          onFocus(event as unknown as TEvent);
        }
      },
      ...rest,
    };
  };

  const getLabelProps: GetLabelProps = (rest) => {
    return {
      htmlFor: getAutocompleteElementId(props.id, 'input'),
      id: getAutocompleteElementId(props.id, 'label'),
      ...rest,
    };
  };

  const getListProps: GetListProps = (providedProps) => {
    const { source, ...rest } = providedProps || {};

    return {
      role: 'listbox',
      'aria-labelledby': getAutocompleteElementId(props.id, 'label'),
      id: getAutocompleteElementId(props.id, 'list', source),
      ...rest,
    };
  };

  const getPanelProps: GetPanelProps<TMouseEvent> = (rest) => {
    return {
      onMouseDown(event) {
        // Prevents the `activeElement` from being changed to the panel so
        // that the blur event is not triggered, otherwise it closes the
        // panel.
        (event as unknown as MouseEvent).preventDefault();
      },
      onMouseLeave() {
        store.dispatch('mouseleave', null);
      },
      ...rest,
    };
  };

  const getItemProps: GetItemProps<any, TMouseEvent> = (providedProps) => {
    const { item, source, ...rest } = providedProps;

    return {
      id: getAutocompleteElementId(
        props.id,
        `item-${item.__autocomplete_id}`,
        source
      ),
      role: 'option',
      'aria-selected': store.getState().activeItemId === item.__autocomplete_id,
      onMouseMove(event) {
        if (item.__autocomplete_id === store.getState().activeItemId) {
          return;
        }

        store.dispatch('mousemove', item.__autocomplete_id);

        const activeItem = getActiveItem(store.getState());

        if (store.getState().activeItemId !== null && activeItem) {
          const { item, itemInputValue, itemUrl, source } = activeItem;

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
      },
      onMouseDown(event) {
        // Prevents the `activeElement` from being changed to the item so it
        // can remain with the current `activeElement`.
        (event as unknown as MouseEvent).preventDefault();
      },
      onClick(event) {
        const itemInputValue = source.getItemInputValue({
          item,
          state: store.getState(),
        });
        const itemUrl = source.getItemUrl({
          item,
          state: store.getState(),
        });

        // If `getItemUrl` is provided, it means that the suggestion
        // is a link, not plain text that aims at updating the query.
        // We can therefore skip the state change because it will update
        // the `activeItemId`, resulting in a UI flash, especially
        // noticeable on mobile.
        const runPreCommand = itemUrl
          ? Promise.resolve()
          : onInput({
              event,
              nextState: { isOpen: false },
              props,
              query: itemInputValue,
              refresh,
              store,
              ...setters,
            });

        runPreCommand.then(() => {
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
      },
      ...rest,
    };
  };

  return {
    getEnvironmentProps,
    getRootProps,
    getFormProps,
    getLabelProps,
    getInputProps,
    getPanelProps,
    getListProps,
    getItemProps,
  };
}
