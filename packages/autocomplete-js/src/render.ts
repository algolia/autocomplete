import { AutocompleteApi as AutocompleteCoreApi } from '@algolia/autocomplete-core';
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
  state: AutocompleteState<TItem>;
  classNames: Partial<AutocompleteClassNames>;
  panelRoot: HTMLElement;
  autocomplete: AutocompleteCoreApi<TItem>;
} & AutocompleteDom &
  AutocompletePropGetters<TItem>;

export function render<TItem extends BaseItem>(
  renderer: AutocompleteRenderer<TItem>,
  {
    autocomplete,
    state,
    getRootProps,
    getInputProps,
    getListProps,
    getItemProps,
    classNames,
    panelRoot,
    root,
    input,
    resetButton,
    submitButton,
    loadingIndicator,
    panel,
  }: RenderProps<TItem>
): () => void {
  setPropertiesWithoutEvents(
    root,
    getRootProps({ state, props: autocomplete.getRootProps({}) })
  );
  setPropertiesWithoutEvents(
    input,
    getInputProps({
      state,
      props: autocomplete.getInputProps({ inputElement: input }),
      inputElement: input,
    })
  );
  setPropertiesWithoutEvents(resetButton, { hidden: !state.query });
  setProperties(submitButton, { hidden: state.status === 'stalled' });
  setProperties(loadingIndicator, { hidden: state.status !== 'stalled' });

  panel.innerHTML = '';

  if (!state.isOpen) {
    if (panelRoot.contains(panel)) {
      panelRoot.removeChild(panel);
    }

    return () => {};
  }

  // We add the panel element to the DOM when it's not yet appended and that the
  // items are fetched.
  if (!panelRoot.contains(panel) && state.status !== 'loading') {
    panelRoot.appendChild(panel);
  }

  panel.classList.toggle('aa-Panel--stalled', state.status === 'stalled');

  const sections = state.collections.map(({ source, items }) => {
    const sectionElement = SourceContainer({ classNames });

    if (source.templates.header) {
      const headerElement = SourceHeader({ classNames });

      renderTemplate({
        template: source.templates.header({
          root: headerElement,
          state,
          source,
          items,
        }),
        parent: sectionElement,
        element: headerElement,
      });
    }

    if (items.length > 0) {
      const listElement = SourceList({
        classNames,
        ...getListProps({ state, props: autocomplete.getListProps({}) }),
      });
      const listFragment = document.createDocumentFragment();

      items.forEach((item) => {
        const itemElement = SourceItem({
          classNames,
          ...getItemProps({
            state,
            props: autocomplete.getItemProps({ item, source }),
          }),
        });

        renderTemplate({
          template: source.templates.item({ root: itemElement, item, state }),
          parent: listFragment,
          element: itemElement,
        });
      });

      listElement.appendChild(listFragment);
      sectionElement.appendChild(listElement);
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
        parent: sectionElement,
        element: footerElement,
      });
    }

    return sectionElement;
  });

  const panelLayoutElement = PanelLayout({ classNames });
  panel.appendChild(panelLayoutElement);

  renderer({ root: panelLayoutElement, sections, state });

  return () => {
    panelRoot.removeChild(panel);
  };
}
