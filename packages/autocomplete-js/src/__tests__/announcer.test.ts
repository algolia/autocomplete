import { fireEvent, waitFor } from '@testing-library/dom';

import { createMatchMedia, runAllMicroTasks } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

beforeEach(() => {
  document.body.innerHTML = '';
});

const createSource = (getItems: () => any[]) => ({
  sourceId: 'testSource',
  getItems,
  templates: {
    item({ item }: any) {
      return item.label;
    },
  },
});

describe('results announcer', () => {
  test('renders a status live region inside the root', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete({
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

    await waitFor(() => {
      expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
        '3 suggestions available'
      );
    });
  });

  test('announces a singular result', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      container,
      openOnFocus: true,
      getSources() {
        return [createSource(() => [{ label: 'Item 1' }])];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input')!;
    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
        '1 suggestion available'
      );
    });
  });

  test('announces when there are no results', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
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

    await waitFor(() => {
      expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
        'No results'
      );
    });
  });

  test('does not announce while requests are pending', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let resolveItems: (items: Array<{ label: string }>) => void = () => {};
    autocomplete<{ label: string }>({
      container,
      openOnFocus: true,
      getSources() {
        return [
          createSource(
            () =>
              new Promise((resolve) => {
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

    await waitFor(() => {
      expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
        '2 suggestions available'
      );
    });
  });

  test('does not announce while the panel is closed', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
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

  test('supports custom translations', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
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

    await waitFor(() => {
      expect(container.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
        '1 résultat'
      );
    });
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

      await waitFor(() => {
        expect(modal.querySelector('.aa-ResultsAnnouncer')).toHaveTextContent(
          '2 suggestions available'
        );
      });

      api.destroy();
    });
  });
});
