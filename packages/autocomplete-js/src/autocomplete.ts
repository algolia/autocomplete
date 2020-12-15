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
import { renderPanel, renderSearchBox } from './render';
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
  const lastStateRef = createRef<AutocompleteState<TItem>>({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    activeItemId: null,
    status: 'idle',
    ...props.value.core.initialState,
  });
  const isTouch = reactive(
    () => window.matchMedia(props.value.renderer.touchMediaQuery).matches
  );

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
    setActiveItemId: autocomplete.value.setActiveItemId,
    setQuery: autocomplete.value.setQuery,
    setCollections: autocomplete.value.setCollections,
    setIsOpen: autocomplete.value.setIsOpen,
    setStatus: autocomplete.value.setStatus,
    setContext: autocomplete.value.setContext,
    refresh: autocomplete.value.refresh,
  };

  const dom = reactive(() =>
    createAutocompleteDom({
      autocomplete: autocomplete.value,
      autocompleteScopeApi,
      classNames: props.value.renderer.classNames,
      isTouch: isTouch.value,
      placeholder: props.value.core.placeholder,
      propGetters,
      state: lastStateRef.current,
    })
  );

  function setPanelPosition() {
    setProperties(dom.value.panel, {
      style: isTouch.value
        ? {}
        : getPanelPositionStyle({
            panelPlacement: props.value.renderer.panelPlacement,
            container: dom.value.root,
            form: dom.value.form,
            environment: props.value.core.environment,
          }),
    });
  }

  function runRender() {
    const renderProps = {
      autocomplete: autocomplete.value,
      autocompleteScopeApi,
      classNames: props.value.renderer.classNames,
      container: props.value.renderer.container,
      dom: dom.value,
      isTouch: isTouch.value,
      panelContainer: isTouch.value
        ? dom.value.touchOverlay
        : props.value.renderer.panelContainer,
      pragma: props.value.renderer.pragma,
      pragmaFrag: props.value.renderer.pragmaFrag,
      propGetters,
      state: lastStateRef.current,
    };

    renderSearchBox(renderProps);
    renderPanel(props.value.renderer.render, renderProps);
  }

  function scheduleRender(state: AutocompleteState<TItem>) {
    lastStateRef.current = state;
    runRender();
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
    const panelContainerElement = isTouch.value
      ? document.body
      : props.value.renderer.panelContainer;
    const panelElement = isTouch.value
      ? dom.value.touchOverlay
      : dom.value.panel;

    if (isTouch.value && lastStateRef.current.isOpen) {
      dom.value.openTouchOverlay();
    }

    scheduleRender(lastStateRef.current);

    return () => {
      if (panelContainerElement.contains(panelElement)) {
        panelContainerElement.removeChild(panelElement);
      }
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
      const previousIsTouch = isTouch.value;
      isTouch.value = window.matchMedia(
        props.value.renderer.touchMediaQuery
      ).matches;

      if (previousIsTouch !== isTouch.value) {
        update({});
      } else {
        requestAnimationFrame(setPanelPosition);
      }
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
