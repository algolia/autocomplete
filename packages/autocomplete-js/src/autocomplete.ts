import {
  createAutocomplete,
  AutocompleteState as AutocompleteCoreState,
} from '@algolia/autocomplete-core';

import { concatClassNames } from './concatClassNames';
import { debounce } from './debounce';
import { getDropdownPositionStyle } from './getDropdownPositionStyle';
import { getHTMLElement } from './getHTMLElement';
import { renderTemplate } from './renderTemplate';
import { setProperties, setPropertiesWithoutEvents } from './setProperties';
import {
  AutocompleteOptions,
  AutocompleteApi,
  AutocompleteSource,
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
  const completion = document.createElement('span');
  const input = document.createElement('input');
  const root = document.createElement('div');
  const form = document.createElement('form');
  const label = document.createElement('label');
  const resetButton = document.createElement('button');
  const dropdown = document.createElement('div');

  const autocomplete = createAutocomplete<TItem>({
    onStateChange(options) {
      const { state } = options;
      render(state as any);

      if (props.onStateChange) {
        props.onStateChange(options);
      }
    },
    ...props,
  });

  const onResize = debounce(() => {
    if (!dropdown.hasAttribute('hidden')) {
      setDropdownPosition();
    }
  }, 100);

  function setDropdownPosition() {
    setProperties(dropdown, {
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
      dropdownElement: dropdown,
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
  setProperties(label, {
    ...autocomplete.getLabelProps(),
    class: concatClassNames(['aa-Label', classNames.label]),
    innerHTML: `<svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
>
  <path
    d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
    stroke="currentColor"
    fill="none"
    fillRule="evenodd"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>`,
  });
  setProperties(inputWrapper, {
    class: ['aa-InputWrapper', classNames.inputWrapper]
      .filter(Boolean)
      .join(' '),
  });
  setProperties(input, {
    ...autocomplete.getInputProps({ inputElement: input }),
    class: concatClassNames(['aa-Input', classNames.input]),
  });
  setProperties(completion, {
    class: concatClassNames(['aa-Completion', classNames.completion]),
  });
  setProperties(resetButton, {
    type: 'reset',
    textContent: 'ｘ',
    onClick: formProps.onReset,
    class: concatClassNames(['aa-ResetButton', classNames.resetButton]),
  });
  setProperties(dropdown, {
    ...autocomplete.getDropdownProps(),
    hidden: true,
    class: concatClassNames(['aa-Dropdown', classNames.dropdown]),
  });

  function render(state: AutocompleteCoreState<TItem>) {
    setPropertiesWithoutEvents(root, autocomplete.getRootProps());
    setPropertiesWithoutEvents(
      input,
      autocomplete.getInputProps({ inputElement: input })
    );

    if (props.enableCompletion) {
      completion.textContent = state.completion;
    }

    dropdown.innerHTML = '';

    if (state.isOpen) {
      setProperties(dropdown, {
        hidden: false,
      });
    } else {
      setProperties(dropdown, {
        hidden: true,
      });
      return;
    }

    if (state.status === 'stalled') {
      dropdown.classList.add('aa-Dropdown--stalled');
    } else {
      dropdown.classList.remove('aa-Dropdown--stalled');
    }

    const sections = state.suggestions.map((suggestion) => {
      const items = suggestion.items;
      const source = suggestion.source as AutocompleteSource<TItem>;

      const section = document.createElement('section');
      setProperties(section, {
        class: concatClassNames(['aa-Section', classNames.section]),
      });

      if (source.templates.header) {
        const header = document.createElement('header');
        setProperties(header, {
          class: concatClassNames([
            'aa-SectionHeader',
            classNames.sectionHeader,
          ]),
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
          class: concatClassNames(['aa-Menu', classNames.menu]),
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
        const footer = document.createElement('footer');
        setProperties(footer, {
          class: concatClassNames([
            'aa-SectionFooter',
            classNames.sectionFooter,
          ]),
        });
        renderTemplate(
          source.templates.footer({ root: footer, state }),
          footer
        );
        section.appendChild(footer);
      }

      return section;
    });

    renderDropdown({ root: dropdown, sections, state });
  }

  inputWrapper.appendChild(label);
  if (props.enableCompletion) {
    inputWrapper.appendChild(completion);
  }
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(resetButton);
  form.appendChild(inputWrapper);
  root.appendChild(form);
  root.appendChild(dropdown);
  containerElement.appendChild(root);

  setDropdownPosition();

  function destroy() {
    containerElement.innerHTML = '';
    setProperties(window as any, {
      onResize: null,
    });
  }

  return {
    setHighlightedIndex: autocomplete.setHighlightedIndex,
    setQuery: autocomplete.setQuery,
    setSuggestions: autocomplete.setSuggestions,
    setIsOpen: autocomplete.setIsOpen,
    setStatus: autocomplete.setStatus,
    setContext: autocomplete.setContext,
    refresh: autocomplete.refresh,
    destroy,
  };
}
