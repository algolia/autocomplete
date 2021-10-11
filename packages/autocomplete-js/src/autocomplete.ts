import {
  AutocompleteScopeApi,
  BaseItem,
  createAutocomplete,
} from '@algolia/autocomplete-core';
import {
  createRef,
  debounce,
  getItemsCount,
} from '@algolia/autocomplete-shared';

import { createAutocompleteDom } from './createAutocompleteDom';
import { createEffectWrapper } from './createEffectWrapper';
import { createReactiveWrapper } from './createReactiveWrapper';
import { getDefaultOptions } from './getDefaultOptions';
import { getPanelPlacementStyle } from './getPanelPlacementStyle';
import { renderPanel, renderSearchBox } from './render';
import {
  AutocompleteApi,
  AutocompleteOptions,
  AutocompletePropGetters,
  AutocompleteSource,
  AutocompleteState,
} from './types';
import { focusAndOpenKeyboard, mergeDeep, setProperties } from './utils';

export function autocomplete<TItem extends BaseItem>(
  options: AutocompleteOptions<TItem>
): AutocompleteApi<TItem> {
  const { runEffect, cleanupEffects, runEffects } = createEffectWrapper();
  const { reactive, runReactives } = createReactiveWrapper();

  const hasNoResultsSourceTemplateRef = createRef(false);
  const optionsRef = createRef(options);
  const onStateChangeRef = createRef<
    AutocompleteOptions<TItem>['onStateChange']
  >(undefined);
  const props = reactive(() => getDefaultOptions(optionsRef.current));
  const isDetached = reactive(
    () =>
      props.value.core.environment.matchMedia(
        props.value.renderer.detachedMediaQuery
      ).matches
  );

  const autocomplete = reactive(() =>
    createAutocomplete<TItem>({
      ...props.value.core,
      onStateChange(params) {
        hasNoResultsSourceTemplateRef.current = params.state.collections.some(
          (collection) =>
            (collection.source as AutocompleteSource<TItem>).templates.noResults
        );
        onStateChangeRef.current?.(params as any);
        props.value.core.onStateChange?.(params as any);
      },
      shouldPanelOpen:
        optionsRef.current.shouldPanelOpen ||
        (({ state }) => {
          if (isDetached.value) {
            return true;
          }

          const hasItems = getItemsCount(state) > 0;

          if (!props.value.core.openOnFocus && !state.query) {
            return hasItems;
          }

          const hasNoResultsTemplate = Boolean(
            hasNoResultsSourceTemplateRef.current ||
              props.value.renderer.renderNoResults
          );

          return (!hasItems && hasNoResultsTemplate) || hasItems;
        }),
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
      environment: props.value.core.environment,
      isDetached: isDetached.value,
      placeholder: props.value.core.placeholder,
      propGetters,
      setIsModalOpen,
      state: lastStateRef.current,
      translations: props.value.renderer.translations,
    })
  );

  function setPanelPosition() {
    setProperties(dom.value.panel, {
      style: isDetached.value
        ? {}
        : getPanelPlacementStyle({
            panelPlacement: props.value.renderer.panelPlacement,
            container: dom.value.root,
            form: dom.value.form,
            environment: props.value.core.environment,
          }),
    });
  }

  function scheduleRender(state: AutocompleteState<TItem>) {
    lastStateRef.current = state;

    const renderProps = {
      autocomplete: autocomplete.value,
      autocompleteScopeApi,
      classNames: props.value.renderer.classNames,
      components: props.value.renderer.components,
      container: props.value.renderer.container,
      createElement: props.value.renderer.renderer.createElement,
      dom: dom.value,
      Fragment: props.value.renderer.renderer.Fragment,
      panelContainer: isDetached.value
        ? dom.value.detachedContainer
        : props.value.renderer.panelContainer,
      propGetters,
      state: lastStateRef.current,
    };

    const render =
      (!getItemsCount(state) &&
        !hasNoResultsSourceTemplateRef.current &&
        props.value.renderer.renderNoResults) ||
      props.value.renderer.render;

    renderSearchBox(renderProps);
    renderPanel(render, renderProps);
  }

  runEffect(() => {
    const environmentProps = autocomplete.value.getEnvironmentProps({
      formElement: dom.value.form,
      panelElement: dom.value.panel,
      inputElement: dom.value.input,
    });

    setProperties(props.value.core.environment as any, environmentProps);

    return () => {
      setProperties(
        props.value.core.environment as any,
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
    const panelContainerElement = isDetached.value
      ? props.value.core.environment.document.body
      : props.value.renderer.panelContainer;
    const panelElement = isDetached.value
      ? dom.value.detachedOverlay
      : dom.value.panel;

    if (isDetached.value && lastStateRef.current.isOpen) {
      setIsModalOpen(true);
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
      if (isDetached.value && prevState.isOpen !== state.isOpen) {
        setIsModalOpen(state.isOpen);
      }

      // The outer DOM might have changed since the last time the panel was
      // positioned. The layout might have shifted vertically for instance.
      // It's therefore safer to re-calculate the panel position before opening
      // it again.
      if (!isDetached.value && state.isOpen && !prevState.isOpen) {
        setPanelPosition();
      }

      // We scroll to the top of the panel whenever the query changes (i.e. new
      // results come in) so that users don't have to.
      if (state.query !== prevState.query) {
        const scrollablePanels = props.value.core.environment.document.querySelectorAll(
          '.aa-Panel--scrollable'
        );
        scrollablePanels.forEach((scrollablePanel) => {
          if (scrollablePanel.scrollTop !== 0) {
            scrollablePanel.scrollTop = 0;
          }
        });
      }

      debouncedRender({ state });
    };

    return () => {
      onStateChangeRef.current = undefined;
    };
  });

  runEffect(() => {
    const onResize = debounce<Event>(() => {
      const previousIsDetached = isDetached.value;
      isDetached.value = props.value.core.environment.matchMedia(
        props.value.renderer.detachedMediaQuery
      ).matches;

      if (previousIsDetached !== isDetached.value) {
        update({});
      } else {
        requestAnimationFrame(setPanelPosition);
      }
    }, 20);
    props.value.core.environment.addEventListener('resize', onResize);

    return () => {
      props.value.core.environment.removeEventListener('resize', onResize);
    };
  });

  runEffect(() => {
    if (!isDetached.value) {
      return () => {};
    }

    function toggleModalClassname(isActive: boolean) {
      dom.value.detachedContainer.classList.toggle(
        'aa-DetachedContainer--modal',
        isActive
      );
    }

    function onChange(event: MediaQueryListEvent) {
      toggleModalClassname(event.matches);
    }

    const isModalDetachedMql = props.value.core.environment.matchMedia(
      getComputedStyle(
        props.value.core.environment.document.documentElement
      ).getPropertyValue('--aa-detached-modal-media-query')
    );

    toggleModalClassname(isModalDetachedMql.matches);

    // Prior to Safari 14, `MediaQueryList` isn't based on `EventTarget`,
    // so we must use `addListener` and `removeListener` to observe media query lists.
    // See https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener
    const hasModernEventListener = Boolean(isModalDetachedMql.addEventListener);

    hasModernEventListener
      ? isModalDetachedMql.addEventListener('change', onChange)
      : isModalDetachedMql.addListener(onChange);

    return () => {
      hasModernEventListener
        ? isModalDetachedMql.removeEventListener('change', onChange)
        : isModalDetachedMql.removeListener(onChange);
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

  function setIsModalOpen(value: boolean) {
    requestAnimationFrame(() => {
      const prevValue = props.value.core.environment.document.body.contains(
        dom.value.detachedOverlay
      );

      if (value === prevValue) {
        return;
      }

      if (value) {
        props.value.core.environment.document.body.appendChild(
          dom.value.detachedOverlay
        );
        props.value.core.environment.document.body.classList.add('aa-Detached');
        focusAndOpenKeyboard(dom.value.input);
      } else {
        props.value.core.environment.document.body.removeChild(
          dom.value.detachedOverlay
        );
        props.value.core.environment.document.body.classList.remove(
          'aa-Detached'
        );
        autocomplete.value.setQuery('');
        autocomplete.value.refresh();
      }
    });
  }

  return {
    ...autocompleteScopeApi,
    update,
    destroy,
  };
}
