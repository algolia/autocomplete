import { waitFor } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';

describe('panelContainer', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('default value is `document.body`', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    autocomplete({
      container,
      initialState: {
        isOpen: true,
      },
    });

    await waitFor(() => {
      expect(document.body.lastChild).toHaveClass('aa-Panel');
    });
  });

  test('create panel in the specified element', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    document.body.appendChild(container);
    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      initialState: {
        isOpen: true,
      },
    });

    await waitFor(() => {
      expect(panelContainer).toContainElement(
        document.querySelector('.aa-Panel')
      );
    });
  });

  test('create panel in the element targeted by the selector', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    panelContainer.className = 'customPanelContainer';
    document.body.appendChild(container);
    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer: '.customPanelContainer',
      initialState: {
        isOpen: true,
      },
    });

    await waitFor(() => {
      expect(panelContainer).toContainElement(
        document.querySelector('.aa-Panel')
      );
    });
  });
});
