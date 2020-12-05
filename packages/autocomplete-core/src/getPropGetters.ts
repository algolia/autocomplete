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
import { getSelectedItem, isOrContainsNode } from './utils';

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
>({
  store,
  props,
  setSelectedItemId,
  setQuery,
  setCollections,
  setIsOpen,
  setStatus,
  setContext,
  refresh,
}: GetPropGettersOptions<TItem>) {
  const getEnvironmentProps: GetEnvironmentProps = (getterProps) => {
    return {
      // On touch devices, we do not rely on the native `blur` event of the
      // input to close the panel, but rather on a custom `touchstart` event
      // outside of the autocomplete elements.
      // This ensures a working experience on mobile because we blur the input
      // on touch devices when the user starts scrolling (`touchmove`).
      onTouchStart(event) {
        if (
          store.getState().isOpen === false ||
          event.target === getterProps.inputElement
        ) {
          return;
        }

        const isTargetWithinAutocomplete = [
          getterProps.formElement,
          getterProps.panelElement,
        ].some((contextNode) => {
          return (
            contextNode &&
            (isOrContainsNode(contextNode, event.target as Node) ||
              isOrContainsNode(
                contextNode,
                props.environment.document.activeElement!
              ))
          );
        });

        if (isTargetWithinAutocomplete === false) {
          store.dispatch('blur', null);
        }
      },
      // When scrolling on touch devices (mobiles, tablets, etc.), we want to
      // mimic the native platform behavior where the input is blurred to
      // hide the virtual keyboard. This gives more vertical space to
      // discover all the suggestions showing up in the panel.
      onTouchMove(event: TouchEvent) {
        if (
          store.getState().isOpen === false ||
          getterProps.inputElement !==
            props.environment.document.activeElement ||
          event.target === getterProps.inputElement
        ) {
          return;
        }

        getterProps.inputElement.blur();
      },
    };
  };

  const getRootProps: GetRootProps = (rest) => {
    return {
      role: 'combobox',
      'aria-expanded': store.getState().isOpen,
      'aria-haspopup': 'listbox',
      'aria-owns': store.getState().isOpen ? `${props.id}-list` : undefined,
      'aria-labelledby': `${props.id}-label`,
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
        ((event as unknown) as Event).preventDefault();

        props.onSubmit({
          state: store.getState(),
          setSelectedItemId,
          setQuery,
          setCollections,
          setIsOpen,
          setStatus,
          setContext,
          refresh,
          event,
        });

        store.dispatch('submit', null);

        if (providedProps.inputElement) {
          providedProps.inputElement.blur();
        }
      },
      onReset: (event) => {
        ((event as unknown) as Event).preventDefault();

        props.onReset({
          state: store.getState(),
          setSelectedItemId,
          setQuery,
          setCollections,
          setIsOpen,
          setStatus,
          setContext,
          refresh,
          event,
        });

        store.dispatch('reset', null);

        if (providedProps.inputElement) {
          providedProps.inputElement.focus();
        }
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
      if (props.openOnFocus || store.getState().query.length > 0) {
        onInput({
          query: store.getState().completion || store.getState().query,
          event,
          store,
          props,
          setSelectedItemId,
          setQuery,
          setCollections,
          setIsOpen,
          setStatus,
          setContext,
          refresh,
        });
      }

      store.dispatch('focus', null);
    }

    const isTouchDevice = 'ontouchstart' in props.environment;
    const { inputElement, maxLength = 512, ...rest } = providedProps || {};

    return {
      'aria-autocomplete': 'both',
      'aria-activedescendant':
        store.getState().isOpen && store.getState().selectedItemId !== null
          ? `${props.id}-item-${store.getState().selectedItemId}`
          : undefined,
      'aria-controls': store.getState().isOpen ? `${props.id}-list` : undefined,
      'aria-labelledby': `${props.id}-label`,
      value: store.getState().completion || store.getState().query,
      id: `${props.id}-input`,
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'off',
      spellCheck: 'false',
      autoFocus: props.autoFocus,
      placeholder: props.placeholder,
      maxLength,
      type: 'search',
      onChange: (event) => {
        onInput({
          query: (((event as unknown) as Event)
            .currentTarget as HTMLInputElement).value.slice(0, maxLength),
          event,
          store,
          props,
          setSelectedItemId,
          setQuery,
          setCollections,
          setIsOpen,
          setStatus,
          setContext,
          refresh,
        });
      },
      onKeyDown: (event) => {
        onKeyDown({
          event: (event as unknown) as KeyboardEvent,
          store,
          props,
          setSelectedItemId,
          setQuery,
          setCollections,
          setIsOpen,
          setStatus,
          setContext,
          refresh,
        });
      },
      onFocus,
      onBlur: () => {
        // We do rely on the `blur` event on touch devices.
        // See explanation in `onTouchStart`.
        if (!isTouchDevice) {
          store.dispatch('blur', null);
        }
      },
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
          onFocus((event as unknown) as TEvent);
        }
      },
      ...rest,
    };
  };

  const getLabelProps: GetLabelProps = (rest) => {
    return {
      htmlFor: `${props.id}-input`,
      id: `${props.id}-label`,
      ...rest,
    };
  };

  const getListProps: GetListProps = (rest) => {
    return {
      role: 'listbox',
      'aria-labelledby': `${props.id}-label`,
      id: `${props.id}-list`,
      ...rest,
    };
  };

  const getPanelProps: GetPanelProps<TMouseEvent> = (rest) => {
    return {
      onMouseDown(event) {
        // Prevents the `activeElement` from being changed to the panel so
        // that the blur event is not triggered, otherwise it closes the
        // panel.
        ((event as unknown) as MouseEvent).preventDefault();
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
      id: `${props.id}-item-${item.__autocomplete_id}`,
      role: 'option',
      'aria-selected':
        store.getState().selectedItemId === item.__autocomplete_id,
      onMouseMove(event) {
        if (item.__autocomplete_id === store.getState().selectedItemId) {
          return;
        }

        store.dispatch('mousemove', item.__autocomplete_id);

        const highlightedItem = getSelectedItem({
          state: store.getState(),
        });

        if (store.getState().selectedItemId !== null && highlightedItem) {
          const { item, itemInputValue, itemUrl, source } = highlightedItem;

          source.onHighlight({
            item,
            itemInputValue,
            itemUrl,
            source,
            state: store.getState(),
            setSelectedItemId,
            setQuery,
            setCollections,
            setIsOpen,
            setStatus,
            setContext,
            refresh,
            event,
          });
        }
      },
      onMouseDown(event) {
        // Prevents the `activeElement` from being changed to the item so it
        // can remain with the current `activeElement`.
        ((event as unknown) as MouseEvent).preventDefault();
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
        // the `selectedItemId`, resulting in a UI flash, especially
        // noticeable on mobile.
        const runPreCommand = itemUrl
          ? Promise.resolve()
          : onInput({
              query: itemInputValue,
              event,
              store,
              props,
              setSelectedItemId,
              setQuery,
              setCollections,
              setIsOpen,
              setStatus,
              setContext,
              refresh,
              nextState: {
                isOpen: false,
              },
            });

        runPreCommand.then(() => {
          source.onSelect({
            item,
            itemInputValue,
            itemUrl,
            source,
            state: store.getState(),
            setSelectedItemId,
            setQuery,
            setCollections,
            setIsOpen,
            setStatus,
            setContext,
            refresh,
            event,
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
