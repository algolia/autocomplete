import { fireEvent, waitFor } from '@testing-library/dom';

import { createMatchMedia } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

describe('detached', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({ matches: true }),
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({}),
    });
  });

  test('closes after onSelect', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
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

    const searchButton = container.querySelector<HTMLButtonElement>(
      '.aa-DetachedSearchButton'
    );

    // Open detached overlay
    searchButton.click();

    await waitFor(() => {
      const input = document.querySelector<HTMLInputElement>('.aa-Input');

      expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
      expect(document.body).toHaveClass('aa-Detached');
      expect(input).toHaveFocus();

      fireEvent.input(input, { target: { value: 'a' } });
    });

    // Wait for the panel to open
    await waitFor(() => {
      expect(
        document.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    const firstItem = document.querySelector<HTMLLIElement>(
      '#autocomplete-item-0'
    );

    // Select the first item
    firstItem.click();

    // The detached overlay should close
    await waitFor(() => {
      expect(
        document.querySelector('.aa-DetachedOverlay')
      ).not.toBeInTheDocument();
      expect(document.body).not.toHaveClass('aa-Detached');
    });
  });

  test('closes after cancel', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
      container,
    });

    const searchButton = container.querySelector<HTMLButtonElement>(
      '.aa-DetachedSearchButton'
    );

    // Open detached overlay
    searchButton.click();

    await waitFor(() => {
      expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
      expect(document.body).toHaveClass('aa-Detached');
    });

    const cancelButton = document.querySelector<HTMLButtonElement>(
      '.aa-DetachedCancelButton'
    );

    const bodyClickListener = jest.fn();
    document.querySelector('body').addEventListener('click', bodyClickListener);

    // Close detached overlay
    cancelButton.click();

    expect(bodyClickListener).toHaveBeenCalledTimes(0);

    document
      .querySelector('body')
      .removeEventListener('click', bodyClickListener);

    // The detached overlay should close
    await waitFor(() => {
      expect(
        document.querySelector('.aa-DetachedOverlay')
      ).not.toBeInTheDocument();
      expect(document.body).not.toHaveClass('aa-Detached');
    });
  });
});
