import {
  createAutocomplete,
  AutocompleteOptions as AutocompleteCoreOptions,
  AutocompleteSource as AutocompleteCoreSource,
  AutocompleteState,
  GetSourcesParams,
} from '@francoischalifour/autocomplete-core';

import { getHTMLElement } from './getHTMLElement';
import { setProperties } from './setProperties';

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
  extends AutocompleteCoreOptions<TItem> {
  container: string | HTMLElement;
  render(params: { root: HTMLElement; sections: HTMLElement[] }): void;
  getSources: GetSources<TItem>;
}

export function autocomplete<TItem>({
  container,
  render: renderDropdown = defaultRender,
  ...props
}: AutocompleteOptions<TItem>) {
  const containerElement = getHTMLElement(container, props.environment);
  const inputWrapper = document.createElement('div');
  const input = document.createElement('input');
  const root = document.createElement('div');
  const form = document.createElement('form');
  const label = document.createElement('label');
  const resetButton = document.createElement('button');
  const dropdown = document.createElement('div');

  const autocomplete = createAutocomplete({
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

  const formProps = autocomplete.getFormProps({ inputElement: input });
  setProperties(form, formProps);
  form.setAttribute('action', '');
  form.setAttribute('role', 'search');
  form.setAttribute('no-validate', '');
  form.classList.add('algolia-autocomplete-form');

  const labelProps = autocomplete.getLabelProps();
  setProperties(label, labelProps);
  label.textContent = 'Search items';

  inputWrapper.classList.add('autocomplete-input-wrapper');

  const inputProps = autocomplete.getInputProps({ inputElement: input });
  setProperties(input, inputProps);

  const completion = document.createElement('span');
  completion.classList.add('autocomplete-completion');

  resetButton.setAttribute('type', 'reset');
  resetButton.textContent = 'ｘ';
  resetButton.addEventListener('click', formProps.onReset);

  const dropdownProps = autocomplete.getDropdownProps({});
  setProperties(dropdown, dropdownProps);
  dropdown.classList.add('autocomplete-dropdown');
  dropdown.setAttribute('hidden', '');

  function render(state: AutocompleteState<TItem>) {
    input.value = state.query;

    if (props.showCompletion) {
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
      dropdown.classList.add('autocomplete-dropdown--stalled');
    } else {
      dropdown.classList.remove('autocomplete-dropdown--stalled');
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

    renderDropdown({ root: dropdown, sections });
  }

  form.appendChild(label);
  if (props.showCompletion) {
    inputWrapper.appendChild(completion);
  }
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(resetButton);
  form.appendChild(inputWrapper);
  root.appendChild(form);
  root.appendChild(dropdown);
  containerElement.appendChild(root);

  return autocomplete;
}
