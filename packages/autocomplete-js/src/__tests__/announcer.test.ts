import { fireEvent, waitFor } from '@testing-library/dom';

import { createMatchMedia, runAllMicroTasks } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

beforeEach(() => {
  document.body.innerHTML = '';
});

// Announcements are debounced so that typing settles into a single
// announcement; wait long enough for the debounce to elapse.
const ANNOUNCEMENT_TIMEOUT = 3000;
const ANNOUNCEMENT_DEBOUNCE = 1400;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const createSource = (getItems: () => any[] | Promise<any[]>) => ({
  sourceId: 'testSource',
  getItems,
  templates: {
    item({ item }: any) {
      return item.label;
    },
  },
});

describe('results announcer', () => {
  test('does not render an announcer by default', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete({
      container,
      getSources() {
        return [createSource(() => [])];
      },
    });

    expect(container.querySelector('.aa-ResultsAnnouncer')).toBeNull();
  });

  test('renders a status live region inside the root when enabled', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete({
      announcements: true,
      container,
      getSources() {
        return [createSource(() => [])];
      },
    });

    const announcer = container.querySelector('.aa-ResultsAnnouncer');

    expect(announcer).toBeInTheDocument();
    expect(announcer).toHaveAttribute('role', 'status');
    // The announcer is a sibling of the form, not nested in it, so it never
    // interferes with form semantics.
    expect(announcer?.parentElement).toHaveClass('aa-Autocomplete');
  });

  test('announces the number of results once they resolve', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      getSources() {
        return [
          createSource(() => [
            { label: 'Item 1' },
            { label: 'Item 2' },
            { label: 'Item 3' },
          ]),
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('3 suggestions available');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );
  });

  test('debounces announcements until typing settles', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      getSources() {
        return [createSource(() => [{ label: 'Item 1' }])];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });
    fireEvent.input(input, { target: { value: 'ab' } });

    await runAllMicroTasks();
    // The debounce has not elapsed yet, so nothing is announced.
    expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
      ''
    );

    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('1 suggestion available');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );
  });

  test('announces a singular result', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      getSources() {
        return [createSource(() => [{ label: 'Item 1' }])];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('1 suggestion available');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );
  });

  test('announces when there are no results', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems() {
              return [];
            },
            templates: {
              item({ item }: any) {
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

    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('No results');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );
  });

  test('does not announce while requests are pending', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let resolveItems: (items: Array<{ label: string }>) => void = () => {};
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      getSources() {
        return [
          createSource(
            () =>
              new Promise<Array<{ label: string }>>((resolve) => {
                resolveItems = resolve;
              })
          ),
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    await runAllMicroTasks();
    expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
      ''
    );

    resolveItems([{ label: 'Item 1' }, { label: 'Item 2' }]);

    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('2 suggestions available');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );
  });

  test('does not announce while the panel is closed', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      shouldPanelOpen: () => false,
      getSources() {
        return [createSource(() => [{ label: 'Item 1' }])];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    // Results resolve but the panel stays closed, so nothing is announced,
    // even after the debounce elapsed.
    await wait(ANNOUNCEMENT_DEBOUNCE + 400);
    expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
      ''
    );
  });

  test('does not announce results dismissed while the announcement is pending', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      getSources() {
        return [createSource(() => [{ label: 'Item 1' }, { label: 'Item 2' }])];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    // The search settled but the debounce hasn't elapsed yet: dismissing the
    // results with Escape before the announcement fires means the user moved
    // on, so the announcement must not happen.
    await waitFor(() => {
      expect(document.querySelector('.aa-Panel')).toBeInTheDocument();
    });
    fireEvent.keyDown(input, { key: 'Escape' });
    await waitFor(() => {
      expect(document.querySelector('.aa-Panel')).not.toBeInTheDocument();
    });

    await wait(ANNOUNCEMENT_DEBOUNCE + 400);
    expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
      ''
    );
  });

  test('announces results when a new search reopens a dismissed panel', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      getSources() {
        return [createSource(() => [{ label: 'Item 1' }, { label: 'Item 2' }])];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(document.querySelector('.aa-Panel')).toBeInTheDocument();
    });
    fireEvent.keyDown(input, { key: 'Escape' });
    await waitFor(() => {
      expect(document.querySelector('.aa-Panel')).not.toBeInTheDocument();
    });

    // Typing again reopens the panel with results. The `loading` to `idle`
    // transition is notified before the collections and panel visibility are
    // updated, so eligibility can only be decided when the announcement
    // fires: otherwise this search stays silent because the state still
    // reflects the dismissed one.
    fireEvent.input(input, { target: { value: 'ab' } });

    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('2 suggestions available');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );
  });

  test('announces "No results" when an empty search closes the panel', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      getSources() {
        return [createSource(() => [])];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    // Without a `noResults` template, the panel closes on empty results in
    // inline mode; the closure is still announced so that screen reader
    // users get completion feedback.
    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('No results');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );
  });

  test('re-announces a new search with the same result count', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      getSources() {
        return [
          createSource(() => [
            { label: 'Item 1' },
            { label: 'Item 2' },
            { label: 'Item 3' },
          ]),
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('3 suggestions available');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );

    fireEvent.input(input, { target: { value: 'ab' } });

    // The live region is emptied when a new search starts so that the same
    // count is announced again.
    await runAllMicroTasks();
    expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
      ''
    );

    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('3 suggestions available');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );
  });

  test('supports custom translations', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      announcements: true,
      container,
      openOnFocus: true,
      translations: {
        resultsAnnouncement: ({ nbItems }) =>
          `${nbItems} résultat${nbItems === 1 ? '' : 's'}`,
      },
      getSources() {
        return [createSource(() => [{ label: 'Item 1' }])];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(
      () => {
        expect(
          container.querySelector('.aa-ResultsAnnouncer')
        ).toHaveTextContent('1 résultat');
      },
      { timeout: ANNOUNCEMENT_TIMEOUT }
    );
  });

  describe('in detached mode', () => {
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

    test('renders the announcer inside the modal container', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const api = autocomplete<{ label: string }>({
        announcements: true,
        container,
        detachedMediaQuery: '',
        openOnFocus: true,
        getSources() {
          return [createSource(() => [{ label: 'Item 1' }])];
        },
      });

      container
        .querySelector<HTMLButtonElement>('.aa-DetachedSearchButton')!
        .click();

      const modal = document.querySelector('.aa-DetachedContainer')!;

      await waitFor(() => {
        const announcer = modal.querySelector('.aa-ResultsAnnouncer');
        expect(announcer).toBeInTheDocument();
        expect(announcer).toHaveAttribute('role', 'status');
      });

      api.destroy();
    });

    test('announces results inside the modal once they resolve', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const api = autocomplete<{ label: string }>({
        announcements: true,
        container,
        detachedMediaQuery: '',
        openOnFocus: true,
        getSources() {
          return [
            createSource(() => [{ label: 'Item 1' }, { label: 'Item 2' }]),
          ];
        },
      });

      container
        .querySelector<HTMLButtonElement>('.aa-DetachedSearchButton')!
        .click();

      const modal = document.querySelector('.aa-DetachedContainer')!;

      await waitFor(
        () => {
          expect(modal.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
            '2 suggestions available'
          );
        },
        { timeout: ANNOUNCEMENT_TIMEOUT }
      );

      api.destroy();
    });
  });
});
