import { fireEvent, waitFor } from '@testing-library/dom';
import { render } from 'preact';

import { autocomplete } from '../autocomplete';

describe('renderNoResults', () => {
  test('renders when no results are returned', async () => {
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
            },
          },
        ];
      },
      renderNoResults({ createElement }, root) {
        render(createElement('div', null, 'No results render'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toHaveTextContent('No results render');
    });
  });

  test("doesn't render with a closed panel", async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
      shouldPanelOpen: () => false,
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
            },
          },
        ];
      },
      renderNoResults({ createElement }, root) {
        render(createElement('div', null, 'No results render'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).not.toBeInTheDocument();
    });
  });

  test('retrieves all the sources', async () => {
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
            },
          },
          {
            sourceId: 'testSource2',
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
      renderNoResults({ sections, createElement }, root) {
        const [testSource, testSource2] = sections;

        expect(testSource.props['data-autocomplete-source-id']).toEqual(
          'testSource'
        );
        expect(testSource2.props['data-autocomplete-source-id']).toEqual(
          'testSource2'
        );

        render(createElement('div', null, 'testSource'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();

      expect(panelContainer).toHaveTextContent('testSource');
    });
  });

  test('renders noResults template over renderNoResults method on no results', async () => {
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
      renderNoResults({ createElement }, root) {
        render(createElement('div', null, 'No results method'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toHaveTextContent('No results template');
    });
  });
});
