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

  test.each(['', 'soap'])(
    'returns focus after Escape with query %p',
    async (query) => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      autocomplete({ container, detachedMediaQuery: '', openOnFocus: true });
      const opener = container.querySelector<HTMLButtonElement>('button')!;
      opener.click();
      const input = document.querySelector<HTMLInputElement>('.aa-Input')!;
      fireEvent.input(input, { target: { value: query } });
      await waitFor(() =>
        expect(container.firstElementChild).toHaveAttribute(
          'aria-expanded',
          'true'
        )
      );
      fireEvent.keyDown(input, { key: 'Escape' });
      await waitFor(() => {
        expect(
          document.querySelector('.aa-DetachedOverlay')
        ).not.toBeInTheDocument();
        expect(opener).toHaveFocus();
      });
    }
  );

  test('returns focus to the detached opener when the root has another button', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const api = autocomplete({
      container,
      detachedMediaQuery: '',
      openOnFocus: true,
    });
    api.update({ placeholder: 'Updated search' });
    const root = container.firstElementChild!;
    const extraButton = document.createElement('button');
    root.prepend(extraButton);
    const opener = root.querySelector<HTMLButtonElement>(
      '.aa-DetachedSearchButton'
    )!;

    opener.click();
    fireEvent.keyDown(document.querySelector('.aa-Input')!, { key: 'Escape' });

    await waitFor(() => expect(opener).toHaveFocus());
    expect(extraButton).not.toHaveFocus();
    api.destroy();
  });

  test('returns focus after cancel and allows reopening', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete({ container, detachedMediaQuery: '' });
    const opener = container.querySelector<HTMLButtonElement>('button')!;
    opener.click();
    userEvent.click(
      document.querySelector<HTMLButtonElement>('.aa-DetachedCancelButton')!
    );
    expect(opener).toHaveFocus();
    opener.click();
    expect(document.querySelector('.aa-Input')).toHaveFocus();
  });

  test('preserves focus moved outside before closing', () => {
    const container = document.createElement('div');
    const outside = document.createElement('button');
    document.body.append(container, outside);
    const api = autocomplete({ container, detachedMediaQuery: '' });
    container.querySelector<HTMLButtonElement>('button')!.click();
    outside.focus();
    fireEvent.mouseDown(
      document.querySelector<HTMLDivElement>('.aa-DetachedOverlay')!
    );
    expect(outside).toHaveFocus();
    api.destroy();
  });

  test.each([
    ['mouse', new MouseEvent('mousedown', { bubbles: true, cancelable: true })],
    [
      'touch',
      new TouchEvent('touchstart', { bubbles: true, cancelable: true }),
    ],
  ])('returns focus after closing from the backdrop with %s', (_, event) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const api = autocomplete({ container, detachedMediaQuery: '' });
    const opener = container.querySelector<HTMLButtonElement>('button')!;
    opener.click();
    const overlay = document.querySelector<HTMLDivElement>(
      '.aa-DetachedOverlay'
    )!;

    overlay.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(overlay).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    api.destroy();
  });

  test('does not prevent touch events from the detached container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const api = autocomplete({ container, detachedMediaQuery: '' });
    container.querySelector<HTMLButtonElement>('button')!.click();
    const input = document.querySelector<HTMLInputElement>('.aa-Input')!;
    const event = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
    api.destroy();
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
    )!;

    // Open detached overlay
    searchButton.click();

    const input = document.querySelector<HTMLInputElement>('.aa-Input')!;

    expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
    expect(document.body).toHaveClass('aa-Detached');

    // Input should immediately be focused, to ensure the keyboard is shown on mobile
    expect(input).toHaveFocus();

    // Type a query in the focused input
    fireEvent.input(input, { target: { value: 'a' } });

    // Wait for the panel to open
    await waitFor(() => {
      expect(
        document.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    const firstItem = document.querySelector<HTMLLIElement>(
      '#autocomplete-testSource-item-0'
    )!;

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
    )!;

    // Open detached overlay
    searchButton.click();

    await waitFor(() => {
      expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
      expect(document.body).toHaveClass('aa-Detached');
    });

    const cancelButton = document.querySelector<HTMLButtonElement>(
      '.aa-DetachedCancelButton'
    )!;

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

  test('preserves `query` in the detached search `button` after closing', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onStateChange = jest.fn();
    autocomplete({
      id: 'autocomplete',
      detachedMediaQuery: '',
      container,
      onStateChange,
    });

    const searchButton = container.querySelector<HTMLButtonElement>(
      '.aa-DetachedSearchButton'
    )!;

    // Open detached overlay
    searchButton.click();

    const input = document.querySelector<HTMLInputElement>('.aa-Input')!;

    expect(document.querySelector('.aa-DetachedOverlay')).toBeInTheDocument();
    expect(document.body).toHaveClass('aa-Detached');
    // Input should immediately be focused, to ensure the keyboard is shown on mobile
    expect(input).toHaveFocus();

    // Type a query in the focused input
    fireEvent.input(input, { target: { value: 'a' } });

    // Wait for the panel to open
    await waitFor(() => {
      expect(
        document.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    const cancelButton = document.querySelector<HTMLButtonElement>(
      '.aa-DetachedCancelButton'
    )!;

    // Close detached overlay
    cancelButton.click();

    // The detached overlay should close
    await waitFor(() => {
      expect(
        document.querySelector('.aa-DetachedOverlay')
      ).not.toBeInTheDocument();
      expect(document.body).not.toHaveClass('aa-Detached');
    });

    // The `query` should still be present
    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ query: 'a' }),
      })
    );

    // The detached search `button` should contain the `query`
    expect(
      container.querySelector('.aa-DetachedSearchButtonQuery')
    ).toHaveTextContent('a');

    // The detached search `button` placeholder should be hidden when `query` exists
    expect(
      container.querySelector('.aa-DetachedSearchButtonPlaceholder')
    ).toHaveAttribute('hidden');
  });

  test('reflects the initial `query` in the detached search `button`', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete({
      id: 'autocomplete',
      detachedMediaQuery: '',
      container,
      initialState: {
        query: 'a',
      },
    });

    await waitFor(() => {
      // The detached search `button` should have the initial `query`
      expect(
        container.querySelector('.aa-DetachedSearchButtonQuery')
      ).toHaveTextContent('a');

      // The detached search `button` placeholder should be hidden when `query` exists
      expect(
        container.querySelector('.aa-DetachedSearchButtonPlaceholder')
      ).toHaveAttribute('hidden');
    });
  });

  test('removes aa-Detached when no longer matching', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({ matches: true }),
    });

    const container = document.createElement('div');

    document.body.appendChild(container);
    const { update } = autocomplete<{ label: string }>({
      container,
      detachedMediaQuery: 'something',
    });

    const searchButton = container.querySelector<HTMLButtonElement>(
      '.aa-DetachedSearchButton'
    )!;

    // Open detached overlay
    searchButton.click();

    await waitFor(() => expect(document.body).toHaveClass('aa-Detached'));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({ matches: false }),
    });

    // schedule a render (normally this is done by the matchMedia listener, but that's not accessible here)
    update({ detachedMediaQuery: 'something' });

    await waitFor(() => expect(document.body).not.toHaveClass('aa-Detached'));
  });
});
