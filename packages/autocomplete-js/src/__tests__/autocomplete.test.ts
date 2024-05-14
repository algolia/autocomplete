import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import * as autocompleteShared from '@algolia/autocomplete-shared';
import { fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  castToJestMock,
  createMatchMedia,
  runAllMicroTasks,
} from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

jest.mock('@algolia/autocomplete-shared', () => {
  const module = jest.requireActual('@algolia/autocomplete-shared');

  return {
    ...module,
    generateAutocompleteId: jest.fn(() => `autocomplete-test`),
  };
});

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('autocomplete-js', () => {
  test('warns when more than one instance is detected in a document', () => {
    const firstContainer = document.createElement('div');
    expect(() =>
      autocomplete({
        container: firstContainer,
      })
    ).not.toWarnDev();

    const secondContainer = document.createElement('div');
    expect(() =>
      autocomplete({
        container: secondContainer,
      })
    ).toWarnDev(
      `[Autocomplete] Autocomplete doesn't support multiple instances running at the same time. Make sure to destroy the previous instance before creating a new one.

See: https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-destroy`
    );
  });

  test('renders with default options', () => {
    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      getSources() {
        return [
          {
            sourceId: 'testSource',
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
                  title="Submit"
                  type="submit"
                >
                  <svg
                    class="aa-SubmitIcon"
                    fill="currentColor"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                  >
                    <path
                      d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
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
                class="aa-ClearButton"
                hidden=""
                title="Clear"
                type="reset"
              >
                <svg
                  class="aa-ClearIcon"
                  fill="currentColor"
                  height="18"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <path
                    d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    `);
  });

  test("renders with an auto-incremented id if there's multiple instances", () => {
    const container = document.createElement('div');
    const initialNbCalls = castToJestMock(
      autocompleteShared.generateAutocompleteId
    ).mock.calls.length;

    document.body.appendChild(container);
    autocomplete({
      container,
    });

    expect(autocompleteShared.generateAutocompleteId).toHaveBeenCalledTimes(
      initialNbCalls + 1
    );

    autocomplete({
      container,
    });

    expect(autocompleteShared.generateAutocompleteId).toHaveBeenCalledTimes(
      initialNbCalls + 2
    );

    autocomplete({
      container,
    });

    expect(autocompleteShared.generateAutocompleteId).toHaveBeenCalledTimes(
      initialNbCalls + 3
    );
  });

  test("doesn't increment the id when toggling detached mode", () => {
    const container = document.createElement('div');

    document.body.appendChild(container);
    const { update } = autocomplete<{ label: string }>({
      container,
    });

    const initialNbCalls = castToJestMock(
      autocompleteShared.generateAutocompleteId
    ).mock.calls.length;

    expect(autocompleteShared.generateAutocompleteId).toHaveBeenCalledTimes(
      initialNbCalls
    );

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({ matches: true }),
    });

    update({ detachedMediaQuery: '' });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({}),
    });

    expect(autocompleteShared.generateAutocompleteId).toHaveBeenCalledTimes(
      initialNbCalls
    );
  });

  test('renders noResults template on no results', async () => {
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
            sourceId: 'testSource',
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
              noResults() {
                return 'No results template';
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toHaveTextContent('No results template');
    });
  });

  test("doesn't render noResults template on empty query when openOnFocus is false", async () => {
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
            sourceId: 'testSource',
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
              noResults() {
                return 'No results template';
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;

    fireEvent.focus(input);

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).not.toBeInTheDocument();
    });
  });

  test('renders noResults template on empty query when openOnFocus is true', async () => {
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
            sourceId: 'testSource',
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
              noResults() {
                return 'No results template';
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;

    fireEvent.focus(input);

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toHaveTextContent('No results template');
    });
  });

  test('renders noResults template on query when openOnFocus is false', async () => {
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
            sourceId: 'testSource',
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
              noResults() {
                return 'No results template';
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;

    fireEvent.input(input, { target: { value: 'Query' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toHaveTextContent('No results template');
    });
  });

  test('allows user-provided shouldPanelOpen', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      shouldPanelOpen: () => false,
      getSources() {
        return [
          {
            sourceId: 'testSource',
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

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;

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
            sourceId: 'testSource',
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
            sourceId: 'testSource',
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
            sourceId: 'testSource',
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

  test('renders on input', async () => {
    const container = document.createElement('div');
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      getSources() {
        return [
          {
            sourceId: 'testSource',
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

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;

    fireEvent.input(input, { target: { value: 'a' } });

    await runAllMicroTasks();

    expect(input).toHaveValue('a');
  });

  test('closes the panel and focuses the next focusable element on `Tab`', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      initialState: {
        query: 'a',
        isOpen: true,
      },
      getSources() {
        return [
          {
            sourceId: 'testSource',
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

    // Wait for the panel to open
    await waitFor(() => {
      expect(
        document.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    userEvent.click(document.querySelector('.aa-Input')!);
    userEvent.tab();

    await waitFor(() => {
      expect(
        document.querySelector('.aa-DetachedOverlay')
      ).not.toBeInTheDocument();
      expect(document.body).not.toHaveClass('aa-Detached');
      expect(document.activeElement).toEqual(
        document.querySelector('.aa-ClearButton')
      );
    });
  });

  test('closes the panel and focuses the next focusable element on `Shift+Tab`', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      container,
      initialState: {
        query: 'a',
        isOpen: true,
      },
      getSources() {
        return [
          {
            sourceId: 'testSource',
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

    // Wait for the panel to open
    await waitFor(() => {
      expect(
        document.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    userEvent.click(document.querySelector('.aa-Input')!);
    userEvent.tab({ shift: true });

    await waitFor(() => {
      expect(
        document.querySelector('.aa-DetachedOverlay')
      ).not.toBeInTheDocument();
      expect(document.body).not.toHaveClass('aa-Detached');
      expect(document.activeElement).toEqual(
        document.querySelector('.aa-SubmitButton')
      );
    });
  });

  describe('Insights plugin', () => {
    test('does not add Insights plugin by default', () => {
      const onStateChange = jest.fn();

      const container = document.createElement('div');
      autocomplete({
        container,
        onStateChange,
      });

      expect(onStateChange).toHaveBeenCalledTimes(0);
    });

    test('`insights: true` adds only one Insights plugin', () => {
      const onStateChange = jest.fn();

      const container = document.createElement('div');
      autocomplete({
        container,
        insights: true,
        onStateChange,
      });

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            context: expect.objectContaining({
              algoliaInsightsPlugin: expect.objectContaining({
                insights: expect.objectContaining({
                  init: expect.any(Function),
                  setAuthenticatedUserToken: expect.any(Function),
                  setUserToken: expect.any(Function),
                  clickedObjectIDsAfterSearch: expect.any(Function),
                  clickedObjectIDs: expect.any(Function),
                  clickedFilters: expect.any(Function),
                  convertedObjectIDsAfterSearch: expect.any(Function),
                  convertedObjectIDs: expect.any(Function),
                  convertedFilters: expect.any(Function),
                  viewedObjectIDs: expect.any(Function),
                  viewedFilters: expect.any(Function),
                }),
              }),
            }),
          }),
        })
      );
    });

    test("users' Insights plugin overrides the default one using `update`", () => {
      const defaultInsightsClient = jest.fn();
      const userInsightsClient = jest.fn();

      const container = document.createElement('div');
      const { update } = autocomplete({
        container,
        insights: { insightsClient: defaultInsightsClient },
      });

      expect(defaultInsightsClient).toHaveBeenCalledTimes(5);
      expect(userInsightsClient).toHaveBeenCalledTimes(0);

      const insightsPlugin = createAlgoliaInsightsPlugin({
        insightsClient: userInsightsClient,
      });
      update({ plugins: [insightsPlugin] });

      expect(defaultInsightsClient).toHaveBeenCalledTimes(5);
      expect(userInsightsClient).toHaveBeenCalledTimes(5);
    });
  });
});
