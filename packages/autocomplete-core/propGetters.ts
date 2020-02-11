import { stateReducer } from './stateReducer';
import { onInput } from './onInput';
import { onKeyDown } from './onKeyDown';
import { isSpecialClick } from './utils';

import {
  GetRootProps,
  GetFormProps,
  GetInputProps,
  GetItemProps,
  GetLabelProps,
  GetMenuProps,
  AutocompleteStore,
  RequiredAutocompleteOptions,
  AutocompleteSetters,
} from './types';

interface GetPropGettersOptions<TItem> extends AutocompleteSetters<TItem> {
  store: AutocompleteStore<TItem>;
  props: RequiredAutocompleteOptions<TItem>;
}

export function getPropGetters<TItem>({
  store,
  props,
  setHighlightedIndex,
  setQuery,
  setSuggestions,
  setIsOpen,
  setStatus,
  setContext,
}: GetPropGettersOptions<TItem>) {
  const getRootProps: GetRootProps = rest => {
    return {
      role: 'combobox',
      'aria-expanded': store.getState().isOpen,
      'aria-haspopup': 'listbox',
      'aria-owns': store.getState().isOpen ? `${props.id}-menu` : null,
      'aria-labelledby': `${props.id}-label`,
      ...rest,
    };
  };

  const getFormProps: GetFormProps = rest => {
    return {
      onSubmit: event => {
        event.preventDefault();

        props.onSubmit({
          state: store.getState(),
          setHighlightedIndex,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
          event,
        });

        store.setState(
          stateReducer(store.getState(), { type: 'submit', value: null }, props)
        );
        props.onStateChange({ state: store.getState() });

        if (rest?.inputElement) {
          rest.inputElement.blur();
        }
      },
      onReset: event => {
        event.preventDefault();

        if (props.minLength === 0) {
          onInput({
            query: '',
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

        store.setState(
          stateReducer(store.getState(), { type: 'reset', value: {} }, props)
        );
        props.onStateChange({ state: store.getState() });

        if (rest?.inputElement) {
          rest.inputElement.focus();
        }
      },
      ...rest,
    };
  };

  const getInputProps: GetInputProps = rest => {
    function onFocus() {
      // We want to trigger a query when `minLength` is reached because the
      // dropdown should open with the current query.
      if (store.getState().query.length >= props.minLength) {
        onInput({
          query: store.getState().query,
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

      store.setState(
        stateReducer(store.getState(), { type: 'focus', value: {} }, props)
      );
      props.onStateChange({ state: store.getState() });
    }

    return {
      'aria-autocomplete': 'list',
      'aria-activedescendant':
        store.getState().isOpen && store.getState().highlightedIndex >= 0
          ? `${props.id}-item-${store.getState().highlightedIndex}`
          : null,
      'aria-controls': store.getState().isOpen ? `${props.id}-menu` : null,
      'aria-labelledby': `${props.id}-label`,
      value: store.getState().query,
      id: `${props.id}-input`,
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'off',
      spellCheck: false,
      autofocus: props.autoFocus,
      placeholder: props.placeholder,
      // @TODO: see if this accessibility attribute is necessary
      // 'aria-expanded': store.getStore().isOpen,
      onInput: (event: InputEvent) => {
        onInput({
          query: (event.currentTarget as HTMLInputElement).value,
          store,
          props,
          setHighlightedIndex,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
        });
      },
      onKeyDown: (event: KeyboardEvent) => {
        onKeyDown({
          event,
          store,
          props,
          setHighlightedIndex,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
        });
      },
      onFocus,
      onBlur: () => {
        store.setState(
          stateReducer(
            store.getState(),
            {
              type: 'blur',
              value: null,
            },
            props
          )
        );
        props.onStateChange({ state: store.getState() });
      },
      onClick: () => {
        // When the dropdown is closed and you click on the input while
        // the input is focused, the `onFocus` event is not triggered
        // (default browser behavior).
        // In an autocomplete context, it makes sense to open the menu in this
        // case.
        // We mimic this event by catching the `onClick` event which
        // triggers the `onFocus` for the dropdown to open.
        if (
          rest?.inputElement === props.environment.document.activeElement &&
          !store.getState().isOpen &&
          store.getState().query.length >= props.minLength
        ) {
          onFocus();
        }
      },
      ...rest,
    };
  };

  const getItemProps: GetItemProps<any> = rest => {
    if (rest.item === undefined) {
      throw new Error('`getItemProps` expects an `item`.');
    }

    return {
      id: `${props.id}-item-${rest.item.__autocomplete_id}`,
      role: 'option',
      'aria-selected':
        store.getState().highlightedIndex === rest.item.__autocomplete_id,
      onMouseMove() {
        if (rest.item.__autocomplete_id === store.getState().highlightedIndex) {
          return;
        }

        store.setState(
          stateReducer(
            store.getState(),
            {
              type: 'mousemove',
              value: rest.item.__autocomplete_id,
            },
            props
          )
        );
        props.onStateChange({ state: store.getState() });
      },
      onMouseDown(event: MouseEvent) {
        // Prevents the `activeElement` from being changed to the item so it
        // can remain with the current `activeElement`.
        event.preventDefault();
      },
      onClick(event: MouseEvent) {
        // We ignore all modified clicks to support default browsers' behavior.
        if (isSpecialClick(event)) {
          return;
        }

        onInput({
          query: rest.source.getInputValue({
            suggestion: rest.item,
            state: store.getState(),
          }),
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
      },
      ...rest,
    };
  };

  const getLabelProps: GetLabelProps = rest => {
    return {
      htmlFor: `${props.id}-input`,
      id: `${props.id}-label`,
      ...rest,
    };
  };

  const getMenuProps: GetMenuProps = rest => {
    return {
      role: 'listbox',
      'aria-labelledby': `${props.id}-label`,
      id: `${props.id}-menu`,
      onMouseLeave() {
        store.setState(
          stateReducer(
            store.getState(),
            {
              type: 'mouseleave',
              value: null,
            },
            props
          )
        );
        props.onStateChange({ state: store.getState() });
      },
      ...rest,
    };
  };

  return {
    getRootProps,
    getFormProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
  };
}
