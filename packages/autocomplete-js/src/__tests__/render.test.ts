import { fireEvent, waitFor } from '@testing-library/dom';
import { render } from 'preact';

import { autocomplete } from '../autocomplete';

describe('render', () => {
  test('provides a default implementation', async () => {
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
              return [{ label: '1' }];
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

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();

      expect(panelContainer).toHaveTextContent('1');
    });
  });

  test('accepts a custom render method', async () => {
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
              return [{ label: '1' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      render({ createElement }, root) {
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
              return [{ label: '1' }];
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
              return [{ label: '2' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      render({ sections, createElement }, root) {
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
});
