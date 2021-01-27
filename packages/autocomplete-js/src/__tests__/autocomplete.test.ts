import { fireEvent, waitFor } from '@testing-library/dom';

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
            getItems() {
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
              class="aa-InputWrapperPrefix"
            >
              <label
                class="aa-Label"
                for="autocomplete-input"
                id="autocomplete-label"
              >
                <button
                  class="aa-SubmitButton"
                  type="submit"
                >
                  <svg
                    class="aa-SubmitIcon"
                    height="20"
                    viewBox="0 0 20 20"
                    width="20"
                  >
                    <path
                      d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                      fill="none"
                      fill-rule="evenodd"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.4"
                    />
                  </svg>
                </button>
              </label>
              <div
                class="aa-LoadingIndicator"
                hidden=""
              >
                <svg
                  class="aa-LoadingIcon"
                  height="20"
                  viewBox="0 0 100 100"
                  width="20"
                >
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="35"
                    stroke="currentColor"
                    stroke-dasharray="164.93361431346415 56.97787143782138"
                    stroke-width="6"
                  >
                    
        
                    <animatetransform
                      attributeName="transform"
                      dur="1s"
                      keyTimes="0;0.40;0.65;1"
                      repeatCount="indefinite"
                      type="rotate"
                      values="0 50 50;90 50 50;180 50 50;360 50 50"
                    />
                    

                  </circle>
                </svg>
              </div>
            </div>
            <div
              class="aa-InputWrapper"
            >
              <input
                aria-autocomplete="both"
                aria-labelledby="autocomplete-label"
                autocapitalize="off"
                autocomplete="off"
                autocorrect="off"
                class="aa-Input"
                enterkeyhint="search"
                id="autocomplete-input"
                maxlength="512"
                placeholder=""
                spellcheck="false"
                type="search"
              />
            </div>
            <div
              class="aa-InputWrapperSuffix"
            >
              <button
                class="aa-ResetButton"
                hidden=""
                type="reset"
              >
                <svg
                  class="aa-ResetIcon"
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
                    stroke-width="1.4"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    `);
  });

  test('renders empty template on no results', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
      getSources() {
        return [
          {
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
              empty() {
                return 'No results template';
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    expect(
      panelContainer.querySelector<HTMLElement>('.aa-Panel')
    ).toHaveTextContent('No results template');
  });

  test("doesn't render empty template on no query when openOnFocus is false", async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: false,
      getSources() {
        return [
          {
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
              empty() {
                return 'No results template';
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: '' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).not.toBeInTheDocument();
    });
  });

  test('render empty template on query when openOnFocus is false', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
      getSources() {
        return [
          {
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
              empty() {
                return 'No results template';
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'Query' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    expect(
      panelContainer.querySelector<HTMLElement>('.aa-Panel')
    ).toHaveTextContent('No results template');
  });

  test('calls renderEmpty without empty template on no results', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const renderEmpty = jest.fn((_params, root) => {
      const div = document.createElement('div');
      div.innerHTML = 'No results render';

      root.appendChild(div);
    });

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
      getSources() {
        return [
          {
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      renderEmpty,
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    expect(renderEmpty).toHaveBeenCalledWith(
      {
        state: expect.anything(),
        children: expect.anything(),
        sections: expect.any(Array),
        createElement: expect.anything(),
        Fragment: expect.anything(),
      },
      expect.any(HTMLElement)
    );

    expect(
      panelContainer.querySelector<HTMLElement>('.aa-Panel')
    ).toHaveTextContent('No results render');
  });

  test('renders empty template over renderEmpty method on no results', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
      getSources() {
        return [
          {
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
              empty() {
                return 'No results template';
              },
            },
          },
        ];
      },
      renderEmpty(_params, root) {
        const div = document.createElement('div');
        div.innerHTML = 'No results render';

        root.appendChild(div);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    expect(
      panelContainer.querySelector<HTMLElement>('.aa-Panel')
    ).toHaveTextContent('No results template');
  });

  test('allows user-provided shouldPanelShow', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      shouldPanelShow: () => false,
      getSources() {
        return [
          {
            getItems() {
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

    fireEvent.input(input, { target: { value: 'a' } });

    expect(
      panelContainer.querySelector<HTMLElement>('.aa-Panel')
    ).not.toBeInTheDocument();
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
            getItems() {
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
            getItems() {
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
            getItems() {
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
            getItems() {
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

    fireEvent.input(input, { target: { value: 'a' } });

    expect(input).toHaveValue('a');
  });
});
