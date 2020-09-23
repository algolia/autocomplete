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
            templates: {
              item({ item }) {
                return item.label;
              },
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
          class="aa-Autocomplete"
          role="combobox"
        >
          <form
            action=""
            class="aa-Form"
            novalidate=""
            role="search"
          >
            <div
              class="aa-InputWrapper"
            >
              <input
                aria-autocomplete="list"
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
              <label
                class="aa-Label"
                for="autocomplete-input"
                id="autocomplete-label"
              >
                <svg
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                >
                  
        
                  <path
                    d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                    fill="none"
                    fillrule="evenodd"
                    stroke="currentColor"
                    strokelinecap="round"
                    strokelinejoin="round"
                  />
                  

                </svg>
              </label>
              <button
                class="aa-ResetButton"
                type="reset"
              >
                <svg
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                >
                  
        
                  <path
                    d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
                    fill="none"
                    fill-rule="evenodd"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  

                </svg>
              </button>
            </div>
          </form>
          <div
            class="aa-Dropdown"
            hidden=""
            style="top: 0px; left: 0px; right: 0px; max-width: unset;"
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
