import { fireEvent, waitFor } from '@testing-library/dom';

import { createMatchMedia, runAllMicroTasks } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

beforeEach(() => {
  document.body.innerHTML = '';
});

// Announcements are debounced so that typing settles into a single
// announcement; wait long enough for the debounce to elapse.
const ANNOUNCEMENT_TIMEOUT = 3000;

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
      getSources() {
        return [createSource(() => [{ label: 'Item 1' }])];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
        ''
      );
    });
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
