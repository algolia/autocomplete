import { createPlayground, runAllMicroTasks } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';
import { AutocompleteReshapeSource } from '../types';

const recentSearchesPlugin = {
  getSources() {
    return [
      {
        sourceId: 'recentSearchesPlugin',
        getItems() {
          return [
            { label: 'macbook' },
            { label: 'macbook pro' },
            { label: 'macbook air' },
          ];
        },
      },
    ];
  },
};

const querySuggestionsPlugin = {
  getSources() {
    return [
      {
        sourceId: 'querySuggestionsPlugin',
        getItems() {
          return [
            { query: 'iphone' },
            { query: 'iphone pro' },
            { query: 'iphone pro max' },
          ];
        },
      },
    ];
  },
};

const customLimit = (value: number) => {
  return function runCustomLimit(
    ...sources: Array<AutocompleteReshapeSource<any>>
  ) {
    return sources.map((source) => {
      const items = source.getItems();

      return {
        ...source,
        getItems() {
          return items.slice(0, value);
        },
      };
    });
  };
};

const limitToOnePerSource = customLimit(1);

describe('reshape', () => {
  test('gets called with sourcesBySourceId, sources and state', async () => {
    const reshape = jest.fn(({ sources }) => sources);
    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      plugins: [recentSearchesPlugin, querySuggestionsPlugin],
      reshape,
    });

    inputElement.focus();
    await runAllMicroTasks();

    expect(reshape).toHaveBeenCalledTimes(1);
    expect(reshape).toHaveBeenCalledWith({
      sourcesBySourceId: {
        recentSearchesPlugin: expect.objectContaining({
          sourceId: 'recentSearchesPlugin',
        }),
        querySuggestionsPlugin: expect.objectContaining({
          sourceId: 'querySuggestionsPlugin',
        }),
      },
      sources: expect.arrayContaining([
        expect.objectContaining({ sourceId: 'recentSearchesPlugin' }),
        expect.objectContaining({ sourceId: 'querySuggestionsPlugin' }),
      ]),
      state: expect.any(Object),
    });
  });

  test('provides resolved items in sources', async () => {
    const reshape = jest.fn(({ sources }) => sources);
    const asyncPlugin = {
      getSources() {
        return [
          {
            sourceId: 'asyncPlugin',
            getItems() {
              return Promise.resolve([{ label: 'macbook' }]);
            },
          },
        ];
      },
    };
    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      plugins: [asyncPlugin],
      reshape,
    });

    inputElement.focus();
    await runAllMicroTasks();

    expect(reshape).toHaveBeenCalledTimes(1);

    const call = reshape.mock.calls[0][0];
    const source: AutocompleteReshapeSource<any> = call.sources[0];
    const sourcesBySourceId = call.sourcesBySourceId;

    expect(source.getItems()).toEqual([{ label: 'macbook' }]);
    expect(sourcesBySourceId.asyncPlugin.getItems()).toEqual([
      { label: 'macbook' },
    ]);
  });

  test('supports a reshaped source in return', async () => {
    const onStateChange = jest.fn();
    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      onStateChange,
      plugins: [recentSearchesPlugin, querySuggestionsPlugin],
      reshape({ sources }) {
        return limitToOnePerSource(...sources);
      },
    });

    inputElement.focus();
    await runAllMicroTasks();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          collections: [
            expect.objectContaining({
              items: [{ __autocomplete_id: 0, label: 'macbook' }],
            }),
            expect.objectContaining({
              items: [{ __autocomplete_id: 1, query: 'iphone' }],
            }),
          ],
        }),
      })
    );
  });

  test('supports an array of reshaped sources in return', async () => {
    const onStateChange = jest.fn();

    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      onStateChange,
      plugins: [recentSearchesPlugin, querySuggestionsPlugin],
      reshape({ sources }) {
        return [limitToOnePerSource(...sources)];
      },
    });

    inputElement.focus();
    await runAllMicroTasks();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          collections: [
            expect.objectContaining({
              items: [{ __autocomplete_id: 0, label: 'macbook' }],
            }),
            expect.objectContaining({
              items: [{ __autocomplete_id: 1, query: 'iphone' }],
            }),
          ],
        }),
      })
    );
  });

  test('ignores undefined sources', async () => {
    const onStateChange = jest.fn();
    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      onStateChange,
      plugins: [recentSearchesPlugin, querySuggestionsPlugin],
      reshape({ sources }) {
        return [limitToOnePerSource(...sources), undefined];
      },
    });

    inputElement.focus();
    await runAllMicroTasks();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          collections: [
            expect.objectContaining({
              items: [{ __autocomplete_id: 0, label: 'macbook' }],
            }),
            expect.objectContaining({
              items: [{ __autocomplete_id: 1, query: 'iphone' }],
            }),
          ],
        }),
      })
    );
  });
});
