import {
  AutocompleteState as AutocompleteCoreState,
  AutocompleteApi as AutocompleteCoreApi,
} from '@algolia/autocomplete-core';

import { renderTemplate } from './renderTemplate';
import {
  AutocompleteClassNames,
  AutocompleteDom,
  AutocompleteRenderer,
  InternalAutocompleteSource,
} from './types';
import {
  concatClassNames,
  setProperties,
  setPropertiesWithoutEvents,
} from './utils';

type RenderProps<TItem> = {
  state: AutocompleteCoreState<TItem>;
  classNames: AutocompleteClassNames;
} & AutocompleteCoreApi<TItem> &
  AutocompleteDom;

export function render<TItem>(
  renderer: AutocompleteRenderer<TItem>,
  {
    state,
    getRootProps,
    getInputProps,
    getListProps,
    getItemProps,
    classNames,
    root,
    input,
    panel,
  }: RenderProps<TItem>
): void {
  setPropertiesWithoutEvents(root, getRootProps());
  setPropertiesWithoutEvents(input, getInputProps({ inputElement: input }));

  panel.innerHTML = '';

  if (state.isOpen) {
    setProperties(panel, {
      hidden: false,
    });
  } else {
    setProperties(panel, {
      hidden: true,
    });
    return;
  }

  if (state.status === 'stalled') {
    panel.classList.add('aa-Panel--stalled');
  } else {
    panel.classList.remove('aa-Panel--stalled');
  }

  const sections = state.collections.map((collection) => {
    const items = collection.items;
    const source = collection.source as InternalAutocompleteSource<TItem>;

    const section = document.createElement('section');
    setProperties(section, {
      class: concatClassNames(['aa-Source', classNames.source]),
    });

    if (source.templates.header) {
      const header = document.createElement('div');
      setProperties(header, {
        class: concatClassNames(['aa-SourceHeader', classNames.sourceHeader]),
      });
      renderTemplate(source.templates.header({ root: header, state }), header);
      section.appendChild(header);
    }

    if (items.length > 0) {
      const list = document.createElement('ul');
      setProperties(list, {
        ...getListProps(),
        class: concatClassNames(['aa-List', classNames.list]),
      });

      const listItems = items.map((item) => {
        const li = document.createElement('li');
        setProperties(li, {
          ...getItemProps({ item, source }),
          class: concatClassNames(['aa-Item', classNames.item]),
        });
        renderTemplate(source.templates.item({ root: li, item, state }), li);

        return li;
      });

      for (const listItem of listItems) {
        list.appendChild(listItem);
      }

      section.appendChild(list);
    }

    if (source.templates.footer) {
      const footer = document.createElement('div');
      setProperties(footer, {
        class: concatClassNames(['aa-SourceFooter', classNames.sourceFooter]),
      });
      renderTemplate(source.templates.footer({ root: footer, state }), footer);
      section.appendChild(footer);
    }

    return section;
  });

  renderer({ root: panel, sections, state });
}
