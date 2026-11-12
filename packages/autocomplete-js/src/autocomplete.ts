import {
  AutocompleteScopeApi,
  BaseItem,
  createAutocomplete,
} from '@algolia/autocomplete-core';
import {
  createRef,
  debounce,
  getItemsCount,
  warn,
} from '@algolia/autocomplete-shared';
import htm from 'htm';

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
  VNode,
} from './types';
import { userAgents } from './userAgents';
import { mergeDeep, pickBy, setProperties } from './utils';

let instancesCount = 0;

export function autocomplete<TItem extends BaseItem>(
  options: AutocompleteOptions<TItem>
): AutocompleteApi<TItem> {
  const { runEffect, cleanupEffects, runEffects } = createEffectWrapper();
  const { reactive, runReactives } = createReactiveWrapper();

  const hasNoResultsSourceTemplateRef = createRef(false);
  const optionsRef = createRef(options);
  const onStateChangeRef =
    createRef<AutocompleteOptions<TItem>['onStateChange']>(undefined);
  const props = reactive(() => getDefaultOptions(optionsRef.current));
  const isDetached = reactive(
    () =>
      props.value.core.environment.matchMedia(
        props.value.renderer.detachedMediaQuery
      ).matches
  );

  function warnAboutOpenOnFocusInDetachedMode() {
    // `openOnFocus` isn't resolved to its default at this layer yet (that
    // happens inside `autocomplete-core`'s `createAutocomplete`), so we
    // mirror its documented default (`false`) explicitly here rather than
    // relying on falsiness, or reaching for `getDefaultProps` from
    // `autocomplete-core` — that function has side effects (it generates
    // an autocomplete id, builds the full `getSources` pipeline) that make
    // it unsuitable for just reading one resolved option.
    const openOnFocus = props.value.core.openOnFocus ?? false;

    warn(
      !(isDetached.value && !openOnFocus),
      `\`openOnFocus: false\` can lead to unexpected behavior in detached mode. We recommend using \`openOnFocus: true\` when detached mode is enabled.

See: https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-openonfocus`
    );
  }

  warnAboutOpenOnFocusInDetachedMode();

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
      __autocomplete_metadata: {
        userAgents,
        options,
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
    navigator: autocomplete.value.navigator,
  };

  const html = reactive(() =>
    htm.bind<VNode>(props.value.renderer.renderer.createElement)
  );

  const dom = reactive(() =>
    createAutocompleteDom({
      autocomplete: autocomplete.value,
      autocompleteScopeApi,
      classNames: props.value.renderer.classNames,
      environment: props.value.core.environment,
      isDetached: isDetached.value,
      announcements: props.value.renderer.announcements,
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
            panel: dom.value.panel,
            environment: props.value.core.environment,
          }),
    });
  }

  // Whether the search cycle that settled delivered its collections.
  // Escape and Tab cancel the pending requests
  // (packages/autocomplete-core/src/onKeyDown.ts), and cancelling a request
  // runs its `finally` handler right away (`cancel()` in
  // packages/autocomplete-core/src/utils/createCancelablePromise.ts), which
  // settles the status to `idle` without ever updating the collections. Such a
  // cycle is a search the user aborted, not a search that came back empty, and
  // once the panel is closed there is nothing left in the state that
  // distinguishes the two.
  let searchCycleCompleted = false;

  function isSearchCycleStarted(
    state: AutocompleteState<TItem>,
    prevState: AutocompleteState<TItem>
  ) {
    // `onInput` sets the status to `loading` right after it applies the query,
    // so a status that just became `loading` is a search going out.
    return state.status === 'loading' && prevState.status !== 'loading';
  }

  function updateResultsAnnouncer() {
    const resultsAnnouncer = dom.value.resultsAnnouncer;
    const state = lastStateRef.current;

    // Announcements are opt-in, and only settled searches should be
    // announced: pending requests would announce stale or intermediate
    // counts.
    if (
      !props.value.renderer.announcements ||
      !resultsAnnouncer ||
      state.status !== 'idle'
    ) {
      return;
    }

    // An aborted search must stay silent: cancelling it settles the status
    // without any collection, which is otherwise indistinguishable from an
    // empty search closing the panel, and would be announced as "No results".
    if (!searchCycleCompleted) {
      return;
    }

    // Whether a search is worth announcing is decided here, when the timer
    // fires, and not when it is scheduled: `onInput` sets the status to `idle`
    // before it updates the collections and the panel visibility
    // (packages/autocomplete-core/src/onInput.ts), so the state carried by the
    // `loading` to `idle` notification is still the previous search's.
    // A closed panel that still has items is a search the user dismissed
    // (Escape, Tab, click outside) before the announcement fired, so we stay
    // silent.
    if (!state.isOpen && getItemsCount(state) > 0) {
      return;
    }

    // A closed panel without items is an empty search: in inline mode it closes
    // the panel on completion and that closure is the only feedback sighted
    // users get, so it is announced. That reasoning needs a query: an emptied
    // input (backspace, the clear button) also closes the panel, and telling
    // the user there are no results when they just deleted their query is
    // noise, not feedback.
    if (!state.isOpen && !state.query) {
      return;
    }

    const text = props.value.renderer.translations.resultsAnnouncement({
      nbItems: getItemsCount(state),
    });

    if (resultsAnnouncer.textContent !== text) {
      resultsAnnouncer.textContent = text;
    }
  }

  // Announcements are debounced so that typing settles into a single
  // announcement instead of one per keystroke (same as accessible-autocomplete
  // and the InstantSearch `stats` widget). The timer is only scheduled when a
  // search settles — never on unrelated renders such as highlight navigation,
  // which would otherwise postpone the announcement indefinitely.
  let announcementTimerId: number | undefined;

  function clearAnnouncement() {
    if (announcementTimerId !== undefined) {
      props.value.core.environment.clearTimeout(announcementTimerId);
      announcementTimerId = undefined;
    }
  }

  function scheduleResultsAnnouncement() {
    clearAnnouncement();
    announcementTimerId = props.value.core.environment.setTimeout(() => {
      announcementTimerId = undefined;
      updateResultsAnnouncer();
    }, 1400);
  }

  function scheduleRender(state: AutocompleteState<TItem>) {
    lastStateRef.current = state;

    const renderProps = {
      autocomplete: autocomplete.value,
      autocompleteScopeApi,
      classNames: props.value.renderer.classNames,
      components: props.value.renderer.components,
      container: props.value.renderer.container,
      html: html.value,
      dom: dom.value,
      panelContainer: isDetached.value
        ? dom.value.detachedContainer
        : props.value.renderer.panelContainer,
      propGetters,
      state: lastStateRef.current,
      renderer: props.value.renderer.renderer,
    };

    const render =
      (!getItemsCount(state) &&
        !hasNoResultsSourceTemplateRef.current &&
        props.value.renderer.renderNoResults) ||
      props.value.renderer.render;

    renderSearchBox(renderProps);
    renderPanel(render, renderProps);
    requestAnimationFrame(setPanelPosition);
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
        panelContainerElement.classList.remove('aa-Detached');
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
        const scrollablePanels =
          props.value.core.environment.document.querySelectorAll(
            '.aa-Panel--scrollable'
          );
        scrollablePanels.forEach((scrollablePanel) => {
          if (scrollablePanel.scrollTop !== 0) {
            scrollablePanel.scrollTop = 0;
          }
        });
      }

      // A new search invalidates the previous announcement: empty the live
      // region (screen readers don't re-announce identical text) and cancel any
      // announcement still scheduled for the previous search.
      // This keys on the start of a search cycle, not only on the query,
      // because a search can run without changing the query: `refresh()`, or
      // reopening a dismissed panel with ArrowUp/ArrowDown
      // (packages/autocomplete-core/src/onKeyDown.ts). Those would otherwise
      // leave the previous, identical announcement in place, which screen
      // readers never announce a second time.
      if (
        props.value.renderer.announcements &&
        (state.query !== prevState.query ||
          isSearchCycleStarted(state, prevState))
      ) {
        const resultsAnnouncer = dom.value.resultsAnnouncer;
        if (resultsAnnouncer) {
          clearAnnouncement();
          resultsAnnouncer.textContent = '';
        }
      }

      if (isSearchCycleStarted(state, prevState)) {
        searchCycleCompleted = false;
      } else if (
        state.status === 'idle' &&
        prevState.status === 'idle' &&
        state.collections !== prevState.collections
      ) {
        // `onInput` settles the status right before it applies the collections,
        // so a collections update on an already settled status is a search
        // completing. Cancellations never get here: their handlers are skipped
        // and the reducer only ever clears the collections while it settles the
        // status in the same notification.
        searchCycleCompleted = true;
      }

      // Announce result counts when a search settles. Scheduling only on
      // `loading`/`stalled` to `idle` transitions keeps unrelated state
      // changes (e.g. highlight navigation) from restarting the debounce.
      // Neither the state nor the completion flag can be trusted at this point
      // (see `updateResultsAnnouncer`): a cancelled search settles here too, so
      // every settled search schedules an announcement that is only kept if it
      // still makes sense once the timer fires.
      if (
        props.value.renderer.announcements &&
        state.status === 'idle' &&
        (prevState.status === 'loading' || prevState.status === 'stalled')
      ) {
        scheduleResultsAnnouncement();
      }

      debouncedRender({ state });
    };

    return () => {
      onStateChangeRef.current = undefined;
    };
  });

  runEffect(() => {
    if (!props.value.renderer.announcements) {
      return () => {};
    }

    const inputElement = dom.value.input;

    function onInputBlur() {
      // Leaving the input ends the search interaction, whatever comes next:
      // Tab, a click on a result, a click outside. An announcement for the
      // query that was just left would be read while the user is already
      // interacting with something else, so it is dropped.
      // This can't be derived from the state changes: blurring an already
      // closed panel with no active item (`defaultActiveItemId` is `null`)
      // dispatches a `blur` that leaves every state field as it was.
      clearAnnouncement();
    }

    inputElement.addEventListener('blur', onInputBlur);

    return () => {
      inputElement.removeEventListener('blur', onInputBlur);
    };
  });

  runEffect(() => {
    const onResize = debounce<Event>(() => {
      const previousIsDetached = isDetached.value;
      isDetached.value = props.value.core.environment.matchMedia(
        props.value.renderer.detachedMediaQuery
      ).matches;

      if (previousIsDetached !== isDetached.value) {
        warnAboutOpenOnFocusInDetachedMode();

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
    if (!isDetached.value) {
      return () => {};
    }

    const container = dom.value.detachedContainer;
    const input = dom.value.input;

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === 'Escape') {
        // Use the core handler so pending requests are also cancelled.
        autocomplete.value
          .getInputProps({ inputElement: input })
          .onKeyDown(event);
        return;
      }

      if (event.key !== 'Tab' || event.ctrlKey || event.metaKey) {
        return;
      }

      // Results and custom template controls can change while the modal is open.
      const elements = Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button, input, select, textarea, [tabindex]'
        )
      ).filter(
        (element) =>
          element.tabIndex >= 0 &&
          !element.matches(':disabled') &&
          !element.closest('[hidden]')
      );
      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = props.value.core.environment.document.activeElement;

      if (!first || (event.shiftKey ? active === first : active === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    }

    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
    };
  });

  runEffect(() => {
    requestAnimationFrame(setPanelPosition);

    return () => {};
  });

  function destroy() {
    instancesCount--;
    // The announcement timer is not owned by an effect, so `cleanupEffects`
    // doesn't cancel it: an announcement scheduled right before `destroy()`
    // would still fire and write a result count into the detached live region
    // of an instance that no longer exists.
    clearAnnouncement();
    cleanupEffects();
  }

  function update(updatedOptions: Partial<AutocompleteOptions<TItem>> = {}) {
    cleanupEffects();

    const { components, ...rendererProps } = props.value.renderer;

    optionsRef.current = mergeDeep(
      rendererProps,
      props.value.core,
      {
        // We need to filter out default components so they can be replaced with
        // a new `renderer`, without getting rid of user components.
        // @MAJOR Deal with registering components with the same name as the
        // default ones. If we disallow overriding default components, we'd just
        // need to pass all `components` here.
        components: pickBy(
          components,
          ({ value }) => !value.hasOwnProperty('__autocomplete_componentName')
        ),
        initialState: lastStateRef.current,
      },
      updatedOptions
    );

    runReactives();
    runEffects();

    autocomplete.value.refresh().then(() => {
      scheduleRender(lastStateRef.current);
    });
  }

  function setIsModalOpen(value: boolean) {
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
      dom.value.input.focus();
    } else {
      const shouldRestoreFocus = dom.value.detachedOverlay.contains(
        props.value.core.environment.document.activeElement
      );

      props.value.core.environment.document.body.removeChild(
        dom.value.detachedOverlay
      );
      props.value.core.environment.document.body.classList.remove(
        'aa-Detached'
      );

      if (shouldRestoreFocus) {
        dom.value.detachedSearchButton?.focus();
      }
    }
  }

  warn(
    instancesCount === 0,
    `Autocomplete doesn't support multiple instances running at the same time. Make sure to destroy the previous instance before creating a new one.

See: https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-destroy`
  );

  instancesCount++;

  return {
    ...autocompleteScopeApi,
    update,
    destroy,
  };
}
