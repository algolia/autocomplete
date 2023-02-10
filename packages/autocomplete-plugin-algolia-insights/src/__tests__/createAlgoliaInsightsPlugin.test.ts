import { createAutocomplete } from '@algolia/autocomplete-core';
import {
  getAlgoliaFacets,
  getAlgoliaResults,
} from '@algolia/autocomplete-preset-algolia';
import { noop } from '@algolia/autocomplete-shared';
import userEvent from '@testing-library/user-event';
import insightsClient from 'search-insights';

import {
  createMultiSearchResponse,
  createPlayground,
  createSearchClient,
  createSource,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createAlgoliaInsightsPlugin } from '../createAlgoliaInsightsPlugin';

jest.useFakeTimers();

describe('createAlgoliaInsightsPlugin', () => {
  test('has a name', () => {
    const plugin = createAlgoliaInsightsPlugin({ insightsClient });

    expect(plugin.name).toBe('aa.algoliaInsightsPlugin');
  });

  test('exposes passed options and excludes default ones', () => {
    const plugin = createAlgoliaInsightsPlugin({
      insightsClient,
      onItemsChange: noop,
    });

    expect(plugin.__autocomplete_pluginOptions).toEqual({
      insightsClient: expect.any(Function),
      onItemsChange: expect.any(Function),
    });
  });

  test('exposes the Search Insights API on the context', () => {
    const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });
    const onStateChange = jest.fn();

    createPlayground(createAutocomplete, {
      onStateChange,
      plugins: [insightsPlugin],
    });

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          context: expect.objectContaining({
            algoliaInsightsPlugin: expect.objectContaining({
              insights: expect.objectContaining({
                init: expect.any(Function),
                setUserToken: expect.any(Function),
                clickedObjectIDsAfterSearch: expect.any(Function),
                clickedObjectIDs: expect.any(Function),
                clickedFilters: expect.any(Function),
                convertedObjectIDsAfterSearch: expect.any(Function),
                convertedObjectIDs: expect.any(Function),
                convertedFilters: expect.any(Function),
                viewedObjectIDs: expect.any(Function),
                viewedFilters: expect.any(Function),
              }),
            }),
          }),
        }),
      })
    );
  });

  test('sets a user agent on the Insights client on subscribe', () => {
    const insightsClient = jest.fn();
    const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

    expect(insightsClient).not.toHaveBeenCalled();

    createPlayground(createAutocomplete, { plugins: [insightsPlugin] });

    expect(insightsClient).toHaveBeenCalledTimes(1);
    expect(insightsClient).toHaveBeenCalledWith(
      'addAlgoliaAgent',
      'insights-plugin'
    );
  });

  test('sets `clickAnalytics=true` for requests to Algolia', async () => {
    const insightsClient = jest.fn();
    const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

    const searchClient = createSearchClient({
      search: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse<{ label: string }>(
            {
              hits: [{ objectID: '1', label: 'Hit 1' }],
            },
            {
              facetHits: [{ count: 2, value: 'Hit 2' }],
            }
          )
        )
      ),
    });

    const playground = createPlayground(createAutocomplete, {
      plugins: [insightsPlugin],
      getSources({ query }) {
        return [
          {
            sourceId: 'hits',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                ],
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'facets',
            getItems() {
              return getAlgoliaFacets({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    facet: 'categories',
                    params: {
                      facetQuery: query,
                    },
                  },
                ],
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
        ];
      },
    });

    userEvent.type(playground.inputElement, 'a');
    await runAllMicroTasks();

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      expect.objectContaining({
        params: expect.objectContaining({ clickAnalytics: true }),
      }),
      expect.objectContaining({
        params: expect.objectContaining({ clickAnalytics: true }),
      }),
    ]);
  });

  describe('onItemsChange', () => {
    test('sends a `viewedObjectIDs` event by default', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();
      jest.runAllTimers();

      expect(insightsClient).toHaveBeenCalledWith('viewedObjectIDs', {
        eventName: 'Items Viewed',
        index: 'index1',
        objectIDs: ['1'],
      });
    });

    test('sends as many `viewedObjectIDs` events as there are compatible sources', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              sourceId: 'source1',
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
            createSource({
              sourceId: 'source2',
              getItems: () => [
                {
                  label: '2',
                  objectID: '2',
                  __autocomplete_indexName: 'index2',
                  __autocomplete_queryID: 'queryID2',
                },
              ],
            }),
          ];
        },
      });

      insightsClient.mockClear();

      inputElement.focus();

      await runAllMicroTasks();
      jest.runAllTimers();

      expect(insightsClient).toHaveBeenCalledTimes(2);
      expect(insightsClient).toHaveBeenNthCalledWith(1, 'viewedObjectIDs', {
        eventName: 'Items Viewed',
        index: 'index1',
        objectIDs: ['1'],
      });
      expect(insightsClient).toHaveBeenNthCalledWith(2, 'viewedObjectIDs', {
        eventName: 'Items Viewed',
        index: 'index2',
        objectIDs: ['2'],
      });
    });

    test('sends a custom event', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({
        insightsClient,
        onItemsChange({ insights, insightsEvents }) {
          const events = insightsEvents.map((insightsEvent) => ({
            ...insightsEvent,
            eventName: 'Product Viewed from Autocomplete',
          }));
          insights.viewedObjectIDs(...events);
        },
      });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();
      jest.runAllTimers();

      expect(insightsClient).toHaveBeenCalledWith('viewedObjectIDs', {
        eventName: 'Product Viewed from Autocomplete',
        index: 'index1',
        objectIDs: ['1'],
      });
    });

    test('does not send an event without parameters', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({
        insightsClient,
        onItemsChange({ insights }) {
          insights.viewedObjectIDs();
        },
      });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();
      jest.runAllTimers();

      expect(insightsClient).not.toHaveBeenCalledWith(
        'viewedObjectIDs',
        expect.any(Object)
      );
    });

    test('debounces calls', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        getSources() {
          return [
            createSource({
              getItems: ({ query }) =>
                [
                  {
                    label: 'hello',
                    objectID: '1',
                    __autocomplete_indexName: 'index1',
                    __autocomplete_queryID: 'queryID1',
                  },
                  {
                    label: 'hey',
                    objectID: '2',
                    __autocomplete_indexName: 'index1',
                    __autocomplete_queryID: 'queryID1',
                  },
                  {
                    label: 'help',
                    objectID: '3',
                    __autocomplete_indexName: 'index1',
                    __autocomplete_queryID: 'queryID1',
                  },
                ].filter(({ label }) => label.startsWith(query)),
            }),
          ];
        },
      });

      inputElement.focus();
      userEvent.type(inputElement, 'h');
      userEvent.type(inputElement, 'e');
      userEvent.type(inputElement, 'l');

      await runAllMicroTasks();
      jest.runAllTimers();

      userEvent.type(inputElement, 'p');

      await runAllMicroTasks();
      jest.runAllTimers();

      // The first calls triggered with "h", "he" and "hel" were debounced,
      // so the item with label "hey" was never reported as viewed.
      expect(insightsClient).toHaveBeenCalledWith('viewedObjectIDs', {
        eventName: 'Items Viewed',
        index: 'index1',
        objectIDs: ['1', '3'],
      });

      // The call triggered with "help" occurred after the timeout, so the item
      // with label "help" was reported as viewed a second time.
      expect(insightsClient).toHaveBeenCalledWith('viewedObjectIDs', {
        eventName: 'Items Viewed',
        index: 'index1',
        objectIDs: ['3'],
      });
    });

    test('does not send an event with non-Algolia Insights hits', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [{ label: '1' }],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();
      jest.runAllTimers();

      expect(insightsClient).not.toHaveBeenCalledWith(
        'viewedObjectIDs',
        expect.any(Object)
      );
    });

    test('does not send an event when there are no results', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();
      jest.runAllTimers();

      expect(insightsClient).not.toHaveBeenCalledWith(
        'viewedObjectIDs',
        expect.any(Object)
      );
    });
  });

  describe('onSelect', () => {
    test('sends a `clickedObjectIDsAfterSearch` event by default', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();

      userEvent.type(inputElement, '{enter}');

      await runAllMicroTasks();

      expect(insightsClient).toHaveBeenCalledWith(
        'clickedObjectIDsAfterSearch',
        {
          eventName: 'Item Selected',
          index: 'index1',
          objectIDs: ['1'],
          positions: [0],
          queryID: 'queryID1',
        }
      );
    });

    test('sends a custom event', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({
        insightsClient,
        onSelect({ insights, insightsEvents }) {
          const events = insightsEvents.map((insightsEvent) => ({
            ...insightsEvent,
            eventName: 'Product Selected from Autocomplete',
          }));

          insights.clickedObjectIDsAfterSearch(...events);
        },
      });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();

      userEvent.type(inputElement, '{enter}');

      await runAllMicroTasks();

      expect(insightsClient).toHaveBeenCalledWith(
        'clickedObjectIDsAfterSearch',
        {
          eventName: 'Product Selected from Autocomplete',
          index: 'index1',
          objectIDs: ['1'],
          positions: [0],
          queryID: 'queryID1',
        }
      );
    });

    test('does not send an event without parameters', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({
        insightsClient,
        onSelect({ insights }) {
          insights.clickedObjectIDsAfterSearch();
        },
      });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();

      userEvent.type(inputElement, '{enter}');

      await runAllMicroTasks();

      expect(insightsClient).not.toHaveBeenCalledWith(
        'clickedObjectIDsAfterSearch',
        expect.any(Object)
      );
    });

    test('does not send an event with non-Algolia Insights hits', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [{ label: '1' }],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();

      userEvent.type(inputElement, '{enter}');

      await runAllMicroTasks();

      expect(insightsClient).not.toHaveBeenCalledWith(
        'viewedObjectIDs',
        expect.any(Object)
      );
    });
  });

  describe('onActive', () => {
    test('does not send an event by default', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
          ];
        },
      });

      // The client is always called once with `addAlgoliaAgent` on `subscribe`
      insightsClient.mockClear();

      inputElement.focus();

      await runAllMicroTasks();

      expect(insightsClient).not.toHaveBeenCalled();
    });

    test('sends a custom event', async () => {
      const insightsClient = jest.fn();
      const track = jest.fn();

      const insightsPlugin = createAlgoliaInsightsPlugin({
        insightsClient,
        onActive({ insightsEvents }) {
          insightsEvents.forEach((insightsEvent) => {
            track('Product Browsed from Autocomplete', insightsEvent);
          });
        },
      });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();

      expect(track).toHaveBeenCalledWith('Product Browsed from Autocomplete', {
        eventName: 'Item Active',
        index: 'index1',
        objectIDs: ['1'],
        positions: [0],
        queryID: 'queryID1',
      });
    });

    test('does not send an event with non-Algolia Insights hits', async () => {
      const insightsClient = jest.fn();
      const track = jest.fn();

      const insightsPlugin = createAlgoliaInsightsPlugin({
        insightsClient,
        onActive({ insightsEvents }) {
          insightsEvents.forEach((insightsEvent) => {
            track('Product Browsed from Autocomplete', insightsEvent);
          });
        },
      });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              getItems: () => [{ label: '1' }],
            }),
          ];
        },
      });

      inputElement.focus();

      await runAllMicroTasks();

      expect(track).not.toHaveBeenCalled();
    });
  });
});
