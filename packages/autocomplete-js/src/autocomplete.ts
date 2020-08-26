import {
  createAutocomplete,
  AutocompleteSetters,
  AutocompleteSource as AutocompleteCoreSource,
  AutocompleteState,
  GetSourcesParams,
  PublicAutocompleteOptions as PublicAutocompleteCoreOptions,
} from '@francoischalifour/autocomplete-core';

import { getHTMLElement } from './getHTMLElement';
import { setProperties } from './setProperties';

/**
 * Renders the template in the root element.
 *
 * If the template is a string, we update the HTML of the root to this string.
 * If the template is empty, it means that users manipulated the root element
 * DOM programatically (e.g., attached events, used a renderer like Preact), so
 * this needs to be a noop.
 */
function renderTemplate(template: string | void, root: HTMLElement) {
  if (typeof template === 'string') {
    root.innerHTML = template;
  }
}

function defaultRender({ root, sections }) {
  for (const section of sections) {
    root.appendChild(section);
  }
}

type Template<TParams> = (params: TParams) => string | void;

type AutocompleteSource<TItem> = AutocompleteCoreSource<TItem> & {
  templates: {
    item: Template<{
      root: HTMLElement;
      item: TItem;
      state: AutocompleteState<TItem>;
    }>;
    header?: Template<{ root: HTMLElement; state: AutocompleteState<TItem> }>;
    footer?: Template<{ root: HTMLElement; state: AutocompleteState<TItem> }>;
  };
};

type GetSources<TItem> = (
  params: GetSourcesParams<TItem>
) => Promise<Array<AutocompleteSource<TItem>>>;

export interface AutocompleteOptions<TItem>
  extends PublicAutocompleteCoreOptions<TItem> {
  container: string | HTMLElement;
  render(params: {
    root: HTMLElement;
    sections: HTMLElement[];
    state: AutocompleteState<TItem>;
  }): void;
  getSources: GetSources<TItem>;
}

export interface AutocompleteApi<TItem> extends AutocompleteSetters<TItem> {
  /**
   * Triggers a search to refresh the state.
   */
  refresh(): Promise<void>;
}

export function autocomplete<TItem>({
  container,
  render: renderDropdown = defaultRender,
  ...props
}: AutocompleteOptions<TItem>): AutocompleteApi<TItem> {
  const containerElement = getHTMLElement(container);
  const inputWrapper = document.createElement('div');
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

  const environmentProps = autocomplete.getEnvironmentProps({
    searchBoxElement: form,
    dropdownElement: dropdown,
    inputElement: input,
  });

  setProperties(window, environmentProps);

  const rootProps = autocomplete.getRootProps();
  setProperties(root, rootProps);
  root.classList.add('aa-Autocomplete');

  const formProps = autocomplete.getFormProps({ inputElement: input });
  setProperties(form, formProps);
  form.classList.add('aa-Form');

  const labelProps = autocomplete.getLabelProps();
  setProperties(label, labelProps);
  // @TODO have a magnifier glass
  label.textContent = 'Search items';
  label.classList.add('aa-Label');

  inputWrapper.classList.add('aa-InputWrapper');

  const inputProps = autocomplete.getInputProps({ inputElement: input });
  setProperties(input, inputProps);
  input.classList.add('aa-Input');

  const completion = document.createElement('span');
  completion.classList.add('aa-Completion');

  resetButton.setAttribute('type', 'reset');
  resetButton.textContent = 'ｘ';
  resetButton.classList.add('aa-Reset');
  resetButton.addEventListener('click', formProps.onReset);

  const dropdownProps = autocomplete.getDropdownProps({});
  setProperties(dropdown, dropdownProps);
  dropdown.classList.add('aa-Dropdown');
  dropdown.setAttribute('hidden', '');

  function render(state: AutocompleteState<TItem>) {
    input.value = state.query;

    if (props.enableCompletion) {
      completion.textContent = state.completion;
    }

    dropdown.innerHTML = '';

    if (state.isOpen) {
      dropdown.removeAttribute('hidden');
    } else {
      dropdown.setAttribute('hidden', '');
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

      if (source.templates.header) {
        const header = document.createElement('header');
        renderTemplate(
          source.templates.header({ root: header, state }),
          header
        );
        section.appendChild(header);
      }

      if (items.length > 0) {
        const menu = document.createElement('ul');
        const menuProps = autocomplete.getMenuProps();
        setProperties(menu, menuProps);

        const menuItems = items.map((item) => {
          const li = document.createElement('li');
          const itemProps = autocomplete.getItemProps({ item, source });
          setProperties(li, itemProps);

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

  form.appendChild(label);
  if (props.enableCompletion) {
    inputWrapper.appendChild(completion);
  }
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(resetButton);
  form.appendChild(inputWrapper);
  root.appendChild(form);
  root.appendChild(dropdown);
  containerElement.appendChild(root);

  return {
    setHighlightedIndex: autocomplete.setHighlightedIndex,
    setQuery: autocomplete.setQuery,
    setSuggestions: autocomplete.setSuggestions,
    setIsOpen: autocomplete.setIsOpen,
    setStatus: autocomplete.setStatus,
    setContext: autocomplete.setContext,
    refresh: autocomplete.refresh,
  };
}
