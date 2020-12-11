import {
  AutocompleteApi as AutocompleteCoreApi,
  AutocompleteScopeApi,
} from '@algolia/autocomplete-core';
import { BaseItem } from '@algolia/autocomplete-core/src';

import {
  PanelLayout,
  SourceContainer,
  SourceFooter,
  SourceHeader,
  SourceItem,
  SourceList,
} from './components';
import { renderTemplate } from './renderTemplate';
import {
  AutocompleteClassNames,
  AutocompleteDom,
  AutocompletePropGetters,
  AutocompleteRenderer,
  AutocompleteState,
} from './types';
import { setProperties, setPropertiesWithoutEvents } from './utils';

type RenderProps<TItem extends BaseItem> = {
  autocomplete: AutocompleteCoreApi<TItem>;
  autocompleteScopeApi: AutocompleteScopeApi<TItem>;
  classNames: Partial<AutocompleteClassNames>;
  dom: AutocompleteDom;
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
  setPropertiesWithoutEvents(dom.resetButton, { hidden: !state.query });
  setProperties(dom.label, { hidden: state.status === 'stalled' });
  setProperties(dom.loadingIndicator, { hidden: state.status !== 'stalled' });
}

export function renderPanel<TItem extends BaseItem>(
  renderer: AutocompleteRenderer<TItem>,
  {
    autocomplete,
    autocompleteScopeApi,
    classNames,
    dom,
    isTouch,
    panelContainer,
    propGetters,
    state,
  }: RenderProps<TItem>
): void {
  dom.panel.innerHTML = '';

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

  const sourceElements = state.collections.map(({ source, items }) => {
    const sourceElement = SourceContainer({ classNames });

    if (source.templates.header) {
      const headerElement = SourceHeader({ classNames });

      renderTemplate({
        template: source.templates.header({
          root: headerElement,
          state,
          source,
          items,
        }),
        parent: sourceElement,
        element: headerElement,
      });
    }

    if (items.length > 0) {
      const listElement = SourceList({
        classNames,
        ...propGetters.getListProps({
          state,
          props: autocomplete.getListProps({}),
          ...autocompleteScopeApi,
        }),
      });
      const listFragment = document.createDocumentFragment();

      items.forEach((item) => {
        const itemElement = SourceItem({
          classNames,
          ...propGetters.getItemProps({
            state,
            props: autocomplete.getItemProps({ item, source }),
            ...autocompleteScopeApi,
          }),
        });

        renderTemplate({
          template: source.templates.item({ root: itemElement, item, state }),
          parent: listFragment,
          element: itemElement,
        });
      });

      listElement.appendChild(listFragment);
      sourceElement.appendChild(listElement);
    }

    if (source.templates.footer) {
      const footerElement = SourceFooter({
        classNames,
      });

      renderTemplate({
        template: source.templates.footer({
          root: footerElement,
          state,
          source,
          items,
        }),
        parent: sourceElement,
        element: footerElement,
      });
    }

    return sourceElement;
  });

  const panelLayoutElement = PanelLayout({ classNames });
  dom.panel.appendChild(panelLayoutElement);

  renderer({ root: panelLayoutElement, sections: sourceElements, state });
}
