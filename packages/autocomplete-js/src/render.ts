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
  AutocompleteRenderer,
  AutocompleteState,
} from './types';
import { setPropertiesWithoutEvents } from './utils';

type RenderProps<TItem extends BaseItem> = {
  state: AutocompleteState<TItem>;
  classNames: AutocompleteClassNames;
  panelRoot: HTMLElement;
} & AutocompleteCoreApi<TItem> &
  AutocompleteDom;

export function render<TItem extends BaseItem>(
  renderer: AutocompleteRenderer<TItem>,
  {
    state,
    getRootProps,
    getInputProps,
    getListProps,
    getItemProps,
    classNames,
    panelRoot,
    root,
    input,
    panel,
  }: RenderProps<TItem>
): () => void {
  setPropertiesWithoutEvents(root, getRootProps());
  setPropertiesWithoutEvents(input, getInputProps({ inputElement: input }));

  panel.innerHTML = '';

  if (!state.isOpen) {
    if (panelRoot.contains(panel)) {
      panelRoot.removeChild(panel);
    }

    return () => {};
  }

  if (!panelRoot.contains(panel)) {
    panelRoot.appendChild(panel);
  }

  if (state.status === 'stalled') {
    panel.classList.add('aa-Panel--stalled');
  } else {
    panel.classList.remove('aa-Panel--stalled');
  }

  const sections = state.collections.map(({ source, items }) => {
    const sectionElement = SourceContainer({ classNames });

    if (source.templates.header) {
      const headerElement = SourceHeader({ classNames });

      renderTemplate({
        template: source.templates.header({ root: headerElement, state }),
        parent: sectionElement,
        element: headerElement,
      });
    }

    if (items.length > 0) {
      const listElement = SourceList({
        classNames,
        ...getListProps(),
      });
      const listFragment = document.createDocumentFragment();

      items.forEach((item) => {
        const itemElement = SourceItem({
          classNames,
          ...getItemProps({ item, source }),
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
        template: source.templates.footer({ root: footerElement, state }),
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
