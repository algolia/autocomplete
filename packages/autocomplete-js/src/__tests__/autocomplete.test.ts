import { fireEvent } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';

describe('autocomplete-js', () => {
  test('renders with default options', () => {
    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      getSources() {
        return [
          {
            getSuggestions() {
              return [
                { label: 'Item 1' },
                { label: 'Item 2' },
                { label: 'Item 3' },
              ];
            },
          },
        ];
      },
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          aria-expanded="false"
          aria-haspopup="listbox"
          aria-labelledby="autocomplete-label"
          aria-owns="undefined"
          class="aa-Autocomplete"
          role="combobox"
        >
          <form
            action=""
            class="aa-Form"
            novalidate=""
            role="search"
          >
            <label
              for="autocomplete-input"
              id="autocomplete-label"
            >
              Search items
            </label>
            <div
              class="aa-InputWrapper"
            >
              <input
                aria-activedescendant="undefined"
                aria-autocomplete="list"
                aria-controls="undefined"
                aria-labelledby="autocomplete-label"
                autocapitalize="off"
                autocomplete="off"
                autocorrect="off"
                class="aa-Input"
                id="autocomplete-input"
                maxlength="512"
                placeholder=""
                spellcheck="false"
                type="search"
              />
              <button
                type="reset"
              >
                ｘ
              </button>
            </div>
          </form>
          <div
            class="aa-Dropdown"
            hidden=""
          />
        </div>
      </div>
    `);
  });

  test('renders with autoFocus', () => {
    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      autoFocus: true,
      getSources() {
        return [
          {
            getSuggestions() {
              return [
                { label: 'Item 1' },
                { label: 'Item 2' },
                { label: 'Item 3' },
              ];
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    expect(input).toHaveAttribute('autofocus', 'true');
  });

  test('renders with placeholder', () => {
    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      placeholder: 'Placeholder',
      getSources() {
        return [
          {
            getSuggestions() {
              return [
                { label: 'Item 1' },
                { label: 'Item 2' },
                { label: 'Item 3' },
              ];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    expect(input).toHaveAttribute('placeholder', 'Placeholder');
  });

  test('renders with initial query', () => {
    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      initialState: {
        query: 'Query',
      },
      getSources() {
        return [
          {
            getSuggestions() {
              return [
                { label: 'Item 1' },
                { label: 'Item 2' },
                { label: 'Item 3' },
              ];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    expect(input).toHaveValue('Query');
  });

  test('renders on input', () => {
    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      getSources() {
        return [
          {
            getSuggestions() {
              return [
                { label: 'Item 1' },
                { label: 'Item 2' },
                { label: 'Item 3' },
              ];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, {
      target: { value: 'a' },
    });
    input.focus();

    expect(input).toHaveValue('a');
  });
});
