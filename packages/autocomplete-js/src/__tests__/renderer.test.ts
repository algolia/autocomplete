import { fireEvent, waitFor } from '@testing-library/dom';
import {
  createElement as preactCreateElement,
  Fragment as PreactFragment,
} from 'preact';

import { autocomplete } from '../autocomplete';

describe('renderer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('accepts a custom renderer', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);

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
      renderer: {
        createElement: mockCreateElement,
        Fragment: PreactFragment,
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();

      expect(panelContainer).toHaveTextContent('1');
      expect(mockCreateElement).toHaveBeenCalled();
    });
  });
});
