import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';
import { BaseItem } from '@algolia/autocomplete-core/src';

import {
  AutocompleteClassNames,
  AutocompleteDom,
  AutocompletePropGetters,
  AutocompleteRenderer,
  AutocompleteState,
  Pragma,
  PragmaFrag,
} from './types';
import { setProperties, setPropertiesWithoutEvents } from './utils';

type RenderProps<TItem extends BaseItem> = {
  autocomplete: AutocompleteCoreApi<TItem>;
  autocompleteScopeApi: AutocompleteScopeApi<TItem>;
  classNames: AutocompleteClassNames;
  dom: AutocompleteDom;
  isTouch: boolean;
  panelContainer: HTMLElement;
  pragma: Pragma;
  pragmaFrag: PragmaFrag;
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
  render: AutocompleteRenderer<TItem>,
  {
    autocomplete,
    autocompleteScopeApi,
    classNames,
    dom,
    isTouch,
    panelContainer,
    pragma,
    pragmaFrag,
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

  const children = pragma('div', {
    className: 'aa-PanelLayout',
    children: state.collections.map(({ source, items }) => {
      return pragma('section', {
        className: classNames.source,
        children: pragma('ul', {
          className: classNames.list,
          ...propGetters.getListProps({
            state,
            props: autocomplete.getListProps({}),
            ...autocompleteScopeApi,
          }),
          children: [
            source.templates.header &&
              pragma('div', {
                className: classNames.sourceHeader,
                children: [
                  source.templates.header({
                    pragma,
                    pragmaFrag,
                    items,
                    source,
                    state,
                  }),
                ],
              }),
            ...items.map((item) => {
              return pragma('li', {
                className: classNames.item,
                ...propGetters.getItemProps({
                  state,
                  props: autocomplete.getItemProps({ item, source }),
                  ...autocompleteScopeApi,
                }),
                children: [
                  source.templates.item({
                    pragma,
                    pragmaFrag,
                    item,
                    state,
                  }),
                ],
              });
            }),
            source.templates.footer &&
              pragma('div', {
                className: classNames.sourceFooter,
                children: [
                  source.templates.footer({
                    pragma,
                    pragmaFrag,
                    items,
                    source,
                    state,
                  }),
                ],
              }),
          ],
        }),
      });
    }),
  });

  render({ children, state }, dom.panel);
}
