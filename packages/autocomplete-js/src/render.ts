import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';
import { BaseItem } from '@algolia/autocomplete-core/src';

import {
  AutocompleteClassNames,
  AutocompleteDom,
  AutocompletePropGetters,
  AutocompleteRender,
  AutocompleteState,
  Pragma,
  PragmaFrag,
} from './types';
import { setProperties, setPropertiesWithoutEvents } from './utils';

type RenderProps<TItem extends BaseItem> = {
  autocomplete: AutocompleteCoreApi<TItem>;
  autocompleteScopeApi: AutocompleteScopeApi<TItem>;
  classNames: AutocompleteClassNames;
  createElement: Pragma;
  dom: AutocompleteDom;
  Fragment: PragmaFrag;
  isTouch: boolean;
  panelContainer: HTMLElement;
  propGetters: AutocompletePropGetters<TItem>;
  state: AutocompleteState<TItem>;
};

export function renderSearchBox<TItem extends BaseItem>({
  autocomplete,
  autocompleteScopeApi,
  dom,
  propGetters,
  state,
}: RenderProps<TItem>): void {
  setPropertiesWithoutEvents(
    dom.root,
    propGetters.getRootProps({
      state,
      props: autocomplete.getRootProps({}),
      ...autocompleteScopeApi,
    })
  );
  setPropertiesWithoutEvents(
    dom.input,
    propGetters.getInputProps({
      state,
      props: autocomplete.getInputProps({ inputElement: dom.input }),
      inputElement: dom.input,
      ...autocompleteScopeApi,
    })
  );
  setProperties(dom.label, { hidden: state.status === 'stalled' });
  setProperties(dom.loadingIndicator, { hidden: state.status !== 'stalled' });
  setProperties(dom.resetButton, { hidden: !state.query });
}

export function renderPanel<TItem extends BaseItem>(
  render: AutocompleteRender<TItem>,
  {
    autocomplete,
    autocompleteScopeApi,
    classNames,
    createElement,
    dom,
    Fragment,
    isTouch,
    panelContainer,
    propGetters,
    state,
  }: RenderProps<TItem>
): void {
  if (!state.isOpen) {
    if (panelContainer.contains(dom.panel)) {
      panelContainer.removeChild(dom.panel);
    }

    return;
  }

  // We add the panel element to the DOM when it's not yet appended and that the
  // items are fetched.
  if (!panelContainer.contains(dom.panel) && state.status !== 'loading') {
    panelContainer.appendChild(dom.panel);
  }

  dom.panel.classList.toggle('aa-Panel--desktop', !isTouch);
  dom.panel.classList.toggle('aa-Panel--touch', isTouch);
  dom.panel.classList.toggle('aa-Panel--stalled', state.status === 'stalled');

  const sections = state.collections.map(({ source, items }, sourceIndex) => {
    return createElement('section', {
      key: sourceIndex,
      className: classNames.source,
      children: createElement('ul', {
        className: classNames.list,
        ...propGetters.getListProps({
          state,
          props: autocomplete.getListProps({}),
          ...autocompleteScopeApi,
        }),
        children: [
          source.templates.header &&
            createElement('div', {
              className: classNames.sourceHeader,
              children: [
                source.templates.header({
                  createElement,
                  Fragment,
                  items,
                  source,
                  state,
                }),
              ],
            }),
          items.length === 0 && source.templates.empty
            ? createElement('div', {
                className: classNames.sourceEmpty,
                children: [
                  source.templates.empty({
                    createElement,
                    Fragment,
                    source,
                    state,
                  }),
                ],
              })
            : createElement('ul', {
                className: classNames.list,
                children: [
                  ...items.map((item) => {
                    const itemProps = autocomplete.getItemProps({
                      item,
                      source,
                    });

                    return createElement('li', {
                      key: itemProps.id,
                      className: classNames.item,
                      ...propGetters.getItemProps({
                        state,
                        props: itemProps,
                        ...autocompleteScopeApi,
                      }),
                      children: [
                        source.templates.item({
                          createElement,
                          Fragment,
                          item,
                          state,
                        }),
                      ],
                    });
                  }),
                ],
              }),
          source.templates.footer &&
            createElement('div', {
              className: classNames.sourceFooter,
              children: [
                source.templates.footer({
                  createElement,
                  Fragment,
                  items,
                  source,
                  state,
                }),
              ],
            }),
        ],
      }),
    });
  });
  const children = createElement('div', {
    className: 'aa-PanelLayout',
    children: sections,
  });

  render({ children, state, sections }, dom.panel);
}
