import { BaseItem, createAutocomplete } from '@algolia/autocomplete-core';
import { createRef } from '@algolia/autocomplete-shared';

import { createAutocompleteDom } from './createAutocompleteDom';
import { createEffectWrapper } from './createEffectWrapper';
import { getPanelPositionStyle } from './getPanelPositionStyle';
import { render } from './render';
import {
  AutocompleteApi,
  AutocompleteOptions,
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

  const {
    inputWrapper,
    form,
    label,
    input,
    resetButton,
    root,
    panel,
  } = createAutocompleteDom({
    ...autocomplete,
    classNames,
  });

  function setPanelPosition() {
    setProperties(panel, {
      style: getPanelPositionStyle({
        panelPlacement,
        container: root,
        inputWrapper,
        environment: props.environment,
      }),
    });
  }

  runEffect(() => {
    const environmentProps = autocomplete.getEnvironmentProps({
      formElement: form,
      panelElement: panel,
      inputElement: input,
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
    const unmountRef = createRef<(() => void) | undefined>(undefined);
    // This batches state changes to limit DOM mutations.
    // Every time we call a setter in `autocomplete-core` (e.g., in `onInput`),
    // the core `onStateChange` function is called.
    // We don't need to be notified of all these state changes to render.
    // As an example:
    //  - without debouncing: "iphone case" query → 85 renders
    //  - with debouncing: "iphone case" query → 12 renders
    onStateChangeRef.current = debounce(({ state }) => {
      unmountRef.current = render(renderer, {
        state,
        ...autocomplete,
        classNames,
        panelRoot,
        root,
        form,
        input,
        inputWrapper,
        label,
        panel,
        resetButton,
      });
    }, 0);

    return () => {
      unmountRef.current?.();
      onStateChangeRef.current = undefined;
    };
  });

  runEffect(() => {
    const containerElement = getHTMLElement(container);
    containerElement.appendChild(root);

    return () => {
      containerElement.removeChild(root);
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
    setSelectedItemId: autocomplete.setSelectedItemId,
    setQuery: autocomplete.setQuery,
    setCollections: autocomplete.setCollections,
    setIsOpen: autocomplete.setIsOpen,
    setStatus: autocomplete.setStatus,
    setContext: autocomplete.setContext,
    refresh: autocomplete.refresh,
    destroy() {
      cleanupEffects();
    },
  };
}
