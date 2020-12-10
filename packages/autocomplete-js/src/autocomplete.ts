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
      ...props.current.core,
      onStateChange(options) {
        onStateChangeRef.current?.(options as any);
        props.current.core.onStateChange?.(options as any);
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
    ...props.current.core.initialState,
  });

  const propGetters: AutocompletePropGetters<TItem> = {
    getEnvironmentProps: props.current.renderer.getEnvironmentProps,
    getFormProps: props.current.renderer.getFormProps,
    getInputProps: props.current.renderer.getInputProps,
    getItemProps: props.current.renderer.getItemProps,
    getLabelProps: props.current.renderer.getLabelProps,
    getListProps: props.current.renderer.getListProps,
    getPanelProps: props.current.renderer.getPanelProps,
    getRootProps: props.current.renderer.getRootProps,
  };
  const autocompleteScopeApi: AutocompleteScopeApi<TItem> = {
    setSelectedItemId: autocomplete.current.setSelectedItemId,
    setQuery: autocomplete.current.setQuery,
    setCollections: autocomplete.current.setCollections,
    setIsOpen: autocomplete.current.setIsOpen,
    setStatus: autocomplete.current.setStatus,
    setContext: autocomplete.current.setContext,
    refresh: autocomplete.current.refresh,
  };

  const dom = reactive(() =>
    createAutocompleteDom({
      state: lastStateRef.current,
      autocomplete: autocomplete.current,
      classNames: props.current.renderer.classNames,
      propGetters,
      autocompleteScopeApi,
    })
  );

  function setPanelPosition() {
    setProperties(dom.current.panel, {
      style: getPanelPositionStyle({
        panelPlacement: props.current.renderer.panelPlacement,
        container: dom.current.root,
        form: dom.current.form,
        environment: props.current.core.environment,
      }),
    });
  }

  function runRender() {
    render(props.current.renderer.render, {
      state: lastStateRef.current,
      autocomplete: autocomplete.current,
      propGetters,
      dom: dom.current,
      classNames: props.current.renderer.classNames,
      panelContainer: props.current.renderer.panelContainer,
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
    const environmentProps = autocomplete.current.getEnvironmentProps({
      formElement: dom.current.form,
      panelElement: dom.current.panel,
      inputElement: dom.current.input,
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
    const containerElement = props.current.renderer.container;
    invariant(
      containerElement.tagName !== 'INPUT',
      'The `container` option does not support `input` elements. You need to change the container to a `div`.'
    );
    containerElement.appendChild(dom.current.root);

    return () => {
      containerElement.removeChild(dom.current.root);
    };
  });

  runEffect(() => {
    const panelContainerElement = props.current.renderer.panelContainer;
    scheduleRender(lastStateRef.current);

    return () => {
      if (panelContainerElement.contains(dom.current.panel)) {
        panelContainerElement.removeChild(dom.current.panel);
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
      props.current.renderer,
      props.current.core,
      { initialState: lastStateRef.current },
      updatedOptions
    );

    runReactives();
    runEffects();

    autocomplete.current.refresh().then(() => {
      scheduleRender(lastStateRef.current);
    });
  }

  return {
    ...autocompleteScopeApi,
    update,
    destroy,
  };
}
