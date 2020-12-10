import {
  AutocompleteScopeApi,
  BaseItem,
  createAutocomplete,
} from '@algolia/autocomplete-core';
import { createRef, debounce, invariant } from '@algolia/autocomplete-shared';

import { createAutocompleteDom } from './createAutocompleteDom';
import { createEffectWrapper } from './createEffectWrapper';
import { createReactiveWrapper } from './createReactiveWrapper';
import { getDefaultOptions } from './getDefaultOptions';
import { getPanelPositionStyle } from './getPanelPositionStyle';
import { render } from './render';
import {
  AutocompleteApi,
  AutocompleteOptions,
  AutocompletePropGetters,
  AutocompleteState,
} from './types';
import { mergeDeep, setProperties } from './utils';

export function autocomplete<TItem extends BaseItem>(
  options: AutocompleteOptions<TItem>
): AutocompleteApi<TItem> {
  const { runEffect, cleanupEffects, runEffects } = createEffectWrapper();
  const { reactive, runReactives } = createReactiveWrapper();

  const optionsRef = createRef(options);
  const onStateChangeRef = createRef<
    AutocompleteOptions<TItem>['onStateChange']
  >(undefined);
  const props = reactive(() => getDefaultOptions(optionsRef.current));
  const autocomplete = reactive(() =>
    createAutocomplete<TItem>({
      ...props.value.core,
      onStateChange(options) {
        onStateChangeRef.current?.(options as any);
        props.value.core.onStateChange?.(options as any);
      },
    })
  );
  const renderRequestIdRef = createRef<number | null>(null);
  const lastStateRef = createRef<AutocompleteState<TItem>>({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    selectedItemId: null,
    status: 'idle',
    ...props.value.core.initialState,
  });

  const propGetters: AutocompletePropGetters<TItem> = {
    getEnvironmentProps: props.value.renderer.getEnvironmentProps,
    getFormProps: props.value.renderer.getFormProps,
    getInputProps: props.value.renderer.getInputProps,
    getItemProps: props.value.renderer.getItemProps,
    getLabelProps: props.value.renderer.getLabelProps,
    getListProps: props.value.renderer.getListProps,
    getPanelProps: props.value.renderer.getPanelProps,
    getRootProps: props.value.renderer.getRootProps,
  };
  const autocompleteScopeApi: AutocompleteScopeApi<TItem> = {
    setSelectedItemId: autocomplete.value.setSelectedItemId,
    setQuery: autocomplete.value.setQuery,
    setCollections: autocomplete.value.setCollections,
    setIsOpen: autocomplete.value.setIsOpen,
    setStatus: autocomplete.value.setStatus,
    setContext: autocomplete.value.setContext,
    refresh: autocomplete.value.refresh,
  };

  const dom = reactive(() =>
    createAutocompleteDom({
      state: lastStateRef.current,
      autocomplete: autocomplete.value,
      classNames: props.value.renderer.classNames,
      propGetters,
      autocompleteScopeApi,
    })
  );

  function setPanelPosition() {
    setProperties(dom.value.panel, {
      style: getPanelPositionStyle({
        panelPlacement: props.value.renderer.panelPlacement,
        container: dom.value.root,
        form: dom.value.form,
        environment: props.value.core.environment,
      }),
    });
  }

  function runRender() {
    render(props.value.renderer.render, {
      state: lastStateRef.current,
      autocomplete: autocomplete.value,
      propGetters,
      dom: dom.value,
      classNames: props.value.renderer.classNames,
      panelContainer: props.value.renderer.panelContainer,
      autocompleteScopeApi,
    });
  }

  function scheduleRender(state: AutocompleteState<TItem>) {
    if (renderRequestIdRef.current !== null) {
      cancelAnimationFrame(renderRequestIdRef.current);
    }

    lastStateRef.current = state;
    renderRequestIdRef.current = requestAnimationFrame(runRender);
  }

  runEffect(() => {
    const environmentProps = autocomplete.value.getEnvironmentProps({
      formElement: dom.value.form,
      panelElement: dom.value.panel,
      inputElement: dom.value.input,
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
    const containerElement = props.value.renderer.container;
    invariant(
      containerElement.tagName !== 'INPUT',
      'The `container` option does not support `input` elements. You need to change the container to a `div`.'
    );
    containerElement.appendChild(dom.value.root);

    return () => {
      containerElement.removeChild(dom.value.root);
    };
  });

  runEffect(() => {
    const panelContainerElement = props.value.renderer.panelContainer;
    scheduleRender(lastStateRef.current);

    return () => {
      if (panelContainerElement.contains(dom.value.panel)) {
        panelContainerElement.removeChild(dom.value.panel);
      }
    };
  });

  runEffect(() => {
    const debouncedRender = debounce<{
      state: AutocompleteState<TItem>;
    }>(({ state }) => {
      scheduleRender(state);
    }, 0);

    onStateChangeRef.current = ({ state, prevState }) => {
      // The outer DOM might have changed since the last time the panel was
      // positioned. The layout might have shifted vertically for instance.
      // It's therefore safer to re-calculate the panel position before opening
      // it again.
      if (state.isOpen && !prevState.isOpen) {
        setPanelPosition();
      }

      debouncedRender({ state });
    };

    return () => {
      onStateChangeRef.current = undefined;
    };
  });

  runEffect(() => {
    const onResize = debounce<Event>(() => {
      requestAnimationFrame(setPanelPosition);
    }, 20);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  runEffect(() => {
    requestAnimationFrame(setPanelPosition);

    return () => {};
  });

  function destroy() {
    cleanupEffects();
  }

  function update(updatedOptions: Partial<AutocompleteOptions<TItem>> = {}) {
    cleanupEffects();

    optionsRef.current = mergeDeep(
      props.value.renderer,
      props.value.core,
      { initialState: lastStateRef.current },
      updatedOptions
    );

    runReactives();
    runEffects();

    autocomplete.value.refresh().then(() => {
      scheduleRender(lastStateRef.current);
    });
  }

  return {
    ...autocompleteScopeApi,
    update,
    destroy,
  };
}
