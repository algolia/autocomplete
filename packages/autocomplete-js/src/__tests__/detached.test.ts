import {
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { createMatchMedia } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

beforeEach(() => {
  document.body.innerHTML = '';
});

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

    // Prevent `onTouchStart` event from closing detached overlay
    const windowTouchStartListener = jest.fn();
    window.addEventListener('touchstart', windowTouchStartListener);

    fireEvent(
      cancelButton,
      new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        composed: true,
      })
    );

    expect(windowTouchStartListener).toHaveBeenCalledTimes(0);

    window.removeEventListener('touchstart', windowTouchStartListener);

    await waitFor(() => {
      expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
      expect(document.body).toHaveClass('aa-Detached');
    });

    // Close detached overlay
    cancelButton.click();

    // The detached overlay should close
    await waitFor(() => {
      expect(
        document.querySelector('.aa-DetachedOverlay')
      ).not.toBeInTheDocument();
      expect(document.body).not.toHaveClass('aa-Detached');
    });
  });

  test('stays open after clear when `openOnFocus` is `true`', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
      openOnFocus: true,
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

    // Clear the query
    userEvent.click(
      document.querySelector<HTMLButtonElement>('.aa-ClearButton')!
    );

    // Ensures the overlay never disappears
    await waitForElementToBeRemoved(
      document.querySelector('.aa-DetachedOverlay')
    ).catch(() => {});

    await waitFor(() => {
      expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
      expect(document.body).toHaveClass('aa-Detached');
    });
  });

  test('closes after clear when `openOnFocus` is `false`', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
      openOnFocus: false,
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

    // Clear the query
    userEvent.click(
      document.querySelector<HTMLButtonElement>('.aa-ClearButton')!
    );

    await waitFor(() => {
      expect(
        document.querySelector('.aa-DetachedOverlay')
      ).not.toBeInTheDocument();
      expect(document.body).not.toHaveClass('aa-Detached');
    });
  });

  test('stays open and focuses the next focusable element on `Tab`', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
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

    userEvent.tab();

    // Ensures the overlay never disappears
    await waitForElementToBeRemoved(
      document.querySelector('.aa-DetachedOverlay')
    ).catch(() => {});

    await waitFor(() => {
      expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
      expect(document.body).toHaveClass('aa-Detached');
      expect(document.activeElement).toEqual(
        document.querySelector('.aa-ClearButton')
      );
    });
  });

  test('stays open and focuses the previous focusable element on `Shift+Tab`', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
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

    userEvent.tab({ shift: true });

    // Ensures the overlay never disappears
    await waitForElementToBeRemoved(
      document.querySelector('.aa-DetachedOverlay')
    ).catch(() => {});

    await waitFor(() => {
      expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
      expect(document.body).toHaveClass('aa-Detached');
      expect(document.activeElement).toEqual(
        document.querySelector('.aa-SubmitButton')
      );
    });
  });
});
