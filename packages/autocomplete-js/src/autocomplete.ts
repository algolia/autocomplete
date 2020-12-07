import {
  AutocompleteScopeApi,
  BaseItem,
  createAutocomplete,
} from '@algolia/autocomplete-core';
import { createRef, invariant } from '@algolia/autocomplete-shared';

import { createAutocompleteDom } from './createAutocompleteDom';
import { createEffectWrapper } from './createEffectWrapper';
import { getPanelPositionStyle } from './getPanelPositionStyle';
import { render } from './render';
import {
  AutocompleteApi,
  AutocompleteOptions,
  AutocompletePropGetters,
  AutocompleteState,
} from './types';
import { debounce, getHTMLElement, setProperties } from './utils';

function defaultRenderer({ root, sections }) {
  for (const section of sections) {
    root.appendChild(section);
  }
}

export function autocomplete<TItem extends BaseItem>({
  container,
  panelContainer = document.body,
  render: renderer = defaultRenderer,
  panelPlacement = 'input-wrapper-width',
  classNames = {},
  getEnvironmentProps = ({ props }) => props,
  getFormProps = ({ props }) => props,
  getInputProps = ({ props }) => props,
  getItemProps = ({ props }) => props,
  getLabelProps = ({ props }) => props,
  getListProps = ({ props }) => props,
  getPanelProps = ({ props }) => props,
  getRootProps = ({ props }) => props,
  ...props
}: AutocompleteOptions<TItem>): AutocompleteApi<TItem> {
  const { runEffect, cleanupEffects } = createEffectWrapper();
  const onStateChangeRef = createRef<
    | ((params: {
        state: AutocompleteState<TItem>;
        prevState: AutocompleteState<TItem>;
      }) => void)
    | undefined
  >(undefined);
  const autocomplete = createAutocomplete<TItem>({
    ...props,
    onStateChange(options) {
      onStateChangeRef.current?.(options as any);
      props.onStateChange?.(options);
    },
  });
  const initialState: AutocompleteState<TItem> = {
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    selectedItemId: null,
    status: 'idle',
    ...props.initialState,
  };

  const propGetters: AutocompletePropGetters<TItem> = {
    getEnvironmentProps,
    getFormProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getListProps,
    getPanelProps,
    getRootProps,
  };
  const autocompleteScopeApi: AutocompleteScopeApi<TItem> = {
    setSelectedItemId: autocomplete.setSelectedItemId,
    setQuery: autocomplete.setQuery,
    setCollections: autocomplete.setCollections,
    setIsOpen: autocomplete.setIsOpen,
    setStatus: autocomplete.setStatus,
    setContext: autocomplete.setContext,
    refresh: autocomplete.refresh,
  };
  const dom = createAutocompleteDom({
    state: initialState,
    autocomplete,
    classNames,
    propGetters,
    autocompleteScopeApi,
  });

  function setPanelPosition() {
    setProperties(dom.panel, {
      style: getPanelPositionStyle({
        panelPlacement,
        container: dom.root,
        form: dom.form,
        environment: props.environment,
      }),
    });
  }

  runEffect(() => {
    const environmentProps = autocomplete.getEnvironmentProps({
      formElement: dom.form,
      panelElement: dom.panel,
      inputElement: dom.input,
    });

    setProperties(window as any, environmentProps);

    return () => {
      setProperties(
        window as any,
        Object.keys(environmentProps).reduce((acc, key) => {
          return {
            ...acc,
            [key]: undefined,
          };
        }, {})
      );
    };
  });

  runEffect(() => {
    const panelRoot = getHTMLElement(panelContainer);
    render(renderer, {
      state: initialState,
      autocomplete,
      propGetters,
      dom,
      classNames,
      panelRoot,
      autocompleteScopeApi,
    });

    return () => {};
  });

  runEffect(() => {
    const panelRoot = getHTMLElement(panelContainer);
    const unmountRef = createRef<(() => void) | undefined>(undefined);
    // This batches state changes to limit DOM mutations.
    // Every time we call a setter in `autocomplete-core` (e.g., in `onInput`),
    // the core `onStateChange` function is called.
    // We don't need to be notified of all these state changes to render.
    // As an example:
    //  - without debouncing: "iphone case" query → 85 renders
    //  - with debouncing: "iphone case" query → 12 renders
    const debouncedOnStateChange = debounce<{
      state: AutocompleteState<TItem>;
    }>(({ state }) => {
      unmountRef.current = render(renderer, {
        state,
        autocomplete,
        propGetters,
        dom,
        classNames,
        panelRoot,
        autocompleteScopeApi,
      });
    }, 0);

    onStateChangeRef.current = ({ prevState, state }) => {
      // The outer DOM might have changed since the last time the panel was
      // positioned. The layout might have shifted vertically for instance.
      // It's therefore safer to re-calculate the panel position before opening
      // it again.
      if (state.isOpen && !prevState.isOpen) {
        setPanelPosition();
      }

      return debouncedOnStateChange({ state });
    };

    return () => {
      unmountRef.current?.();
      onStateChangeRef.current = undefined;
    };
  });

  runEffect(() => {
    const containerElement = getHTMLElement(container);
    invariant(
      containerElement.tagName !== 'INPUT',
      'The `container` option does not support `input` elements. You need to change the container to a `div`.'
    );
    containerElement.appendChild(dom.root);

    return () => {
      containerElement.removeChild(dom.root);
    };
  });

  runEffect(() => {
    const onResize = debounce<Event>(() => {
      setPanelPosition();
    }, 100);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  requestAnimationFrame(() => {
    setPanelPosition();
  });

  return {
    ...autocompleteScopeApi,
    destroy() {
      cleanupEffects();
    },
  };
}
