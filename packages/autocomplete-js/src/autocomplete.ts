import {
  createAutocomplete,
  AutocompleteState,
} from '@algolia/autocomplete-core';

import { createAutocompleteDom } from './createAutocompleteDom';
import { createEffectWrapper } from './createEffectWrapper';
import { getPanelPositionStyle } from './getPanelPositionStyle';
import { render } from './render';
import { AutocompleteApi, AutocompleteOptions } from './types';
import { debounce, getHTMLElement, setProperties } from './utils';

function defaultRenderer({ root, sections }) {
  for (const section of sections) {
    root.appendChild(section);
  }
}

export function autocomplete<TItem>({
  container,
  render: renderer = defaultRenderer,
  panelPlacement = 'input-wrapper-width',
  classNames = {},
  ...props
}: AutocompleteOptions<TItem>): AutocompleteApi<TItem> {
  const { effects, triggerEffect } = createEffectWrapper();
  const autocomplete = createAutocomplete<TItem>({
    ...props,
    onStateChange(options) {
      onStateChange(options.state as any);

      if (props.onStateChange) {
        props.onStateChange(options);
      }
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

  function onStateChange(state: AutocompleteState<TItem>) {
    render(renderer, {
      state,
      ...autocomplete,
      classNames,
      root,
      form,
      input,
      inputWrapper,
      label,
      panel,
      resetButton,
    });
  }

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

  function destroy() {
    effects.forEach((cleanUp) => cleanUp());
  }

  requestAnimationFrame(() => {
    setPanelPosition();
  });

  triggerEffect(() => {
    const containerElement = getHTMLElement(container);
    containerElement.appendChild(root);

    return () => {
      containerElement.removeChild(root);
    };
  });

  triggerEffect(() => {
    const onResize = debounce(() => {
      setPanelPosition();
    }, 100);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return {
    setSelectedItemId: autocomplete.setSelectedItemId,
    setQuery: autocomplete.setQuery,
    setCollections: autocomplete.setCollections,
    setIsOpen: autocomplete.setIsOpen,
    setStatus: autocomplete.setStatus,
    setContext: autocomplete.setContext,
    refresh: autocomplete.refresh,
    destroy,
  };
}
