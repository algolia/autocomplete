import {
  createAutocomplete,
  AutocompleteState as AutocompleteCoreState,
} from '@algolia/autocomplete-core';

import { concatClassNames } from './concatClassNames';
import { debounce } from './debounce';
import { getDropdownPositionStyle } from './getDropdownPositionStyle';
import { getHTMLElement } from './getHTMLElement';
import { resetIcon, searchIcon } from './icons';
import { renderTemplate } from './renderTemplate';
import { setProperties, setPropertiesWithoutEvents } from './setProperties';
import {
  AutocompleteOptions,
  AutocompleteApi,
  InternalAutocompleteSource,
} from './types';

function defaultRender({ root, sections }) {
  for (const section of sections) {
    root.appendChild(section);
  }
}

export function autocomplete<TItem>({
  container,
  render: renderDropdown = defaultRender,
  dropdownPlacement = 'input-wrapper-width',
  classNames = {},
  ...props
}: AutocompleteOptions<TItem>): AutocompleteApi<TItem> {
  const containerElement = getHTMLElement(container);
  const inputWrapper = document.createElement('div');
  const input = document.createElement('input');
  const root = document.createElement('div');
  const form = document.createElement('form');
  const label = document.createElement('label');
  const resetButton = document.createElement('button');
  const panel = document.createElement('div');

  const autocomplete = createAutocomplete<TItem>({
    ...props,
    onStateChange(options) {
      const { state } = options;
      render(state as any);

      if (props.onStateChange) {
        props.onStateChange(options);
      }
    },
  });

  const onResize = debounce(() => {
    if (!panel.hasAttribute('hidden')) {
      setDropdownPosition();
    }
  }, 100);

  function setDropdownPosition() {
    setProperties(panel, {
      style: getDropdownPositionStyle({
        dropdownPlacement,
        container: root,
        inputWrapper,
        environment: props.environment,
      }),
    });
  }

  setProperties(window as any, {
    ...autocomplete.getEnvironmentProps({
      searchBoxElement: form,
      dropdownElement: panel,
      inputElement: input,
    }),
    onResize,
  });
  setProperties(root, {
    ...autocomplete.getRootProps(),
    class: concatClassNames(['aa-Autocomplete', classNames.root]),
  });
  const formProps = autocomplete.getFormProps({ inputElement: input });
  setProperties(form, {
    ...formProps,
    class: concatClassNames(['aa-Form', classNames.form]),
  });
  setProperties(inputWrapper, {
    class: concatClassNames(['aa-InputWrapper', classNames.inputWrapper]),
  });
  setProperties(input, {
    ...autocomplete.getInputProps({ inputElement: input }),
    class: concatClassNames(['aa-Input', classNames.input]),
  });
  setProperties(label, {
    ...autocomplete.getLabelProps(),
    class: concatClassNames(['aa-Label', classNames.label]),
    innerHTML: searchIcon,
  });
  setProperties(resetButton, {
    type: 'reset',
    onClick: formProps.onReset,
    class: concatClassNames(['aa-ResetButton', classNames.resetButton]),
    innerHTML: resetIcon,
  });
  setProperties(panel, {
    ...autocomplete.getDropdownProps(),
    hidden: true,
    class: concatClassNames(['aa-Panel', classNames.panel]),
  });

  function render(state: AutocompleteCoreState<TItem>) {
    setPropertiesWithoutEvents(root, autocomplete.getRootProps());
    setPropertiesWithoutEvents(
      input,
      autocomplete.getInputProps({ inputElement: input })
    );

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
      panel.classList.add('aa-panel--stalled');
    } else {
      panel.classList.remove('aa-panel--stalled');
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
        renderTemplate(
          source.templates.header({ root: header, state }),
          header
        );
        section.appendChild(header);
      }

      if (items.length > 0) {
        const menu = document.createElement('ul');
        setProperties(menu, {
          ...autocomplete.getMenuProps(),
          class: concatClassNames(['aa-List', classNames.list]),
        });

        const menuItems = items.map((item) => {
          const li = document.createElement('li');
          setProperties(li, {
            ...autocomplete.getItemProps({ item, source }),
            class: concatClassNames(['aa-Item', classNames.item]),
          });
          renderTemplate(source.templates.item({ root: li, item, state }), li);

          return li;
        });

        for (const menuItem of menuItems) {
          menu.appendChild(menuItem);
        }

        section.appendChild(menu);
      }

      if (source.templates.footer) {
        const footer = document.createElement('div');
        setProperties(footer, {
          class: concatClassNames(['aa-SourceFooter', classNames.sourceFooter]),
        });
        renderTemplate(
          source.templates.footer({ root: footer, state }),
          footer
        );
        section.appendChild(footer);
      }

      return section;
    });

    renderDropdown({ root: panel, sections, state });
  }

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(label);
  inputWrapper.appendChild(resetButton);
  form.appendChild(inputWrapper);
  root.appendChild(form);
  root.appendChild(panel);
  containerElement.appendChild(root);

  setDropdownPosition();

  function destroy() {
    containerElement.innerHTML = '';
    setProperties(window as any, {
      onResize: null,
    });
  }

  return {
    setSelectedItemId: autocomplete.setSelectedItemId,
    setQuery: autocomplete.setQuery,
    setCollections: autocomplete.setCollections,
    setIsOpen: autocomplete.setIsOpen,
    setStatus: autocomplete.setStatus,
    setContext: autocomplete.setContext,
    refresh: autocomplete.refresh,
    destroy,
  };
}
