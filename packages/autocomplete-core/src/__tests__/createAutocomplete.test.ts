import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import userEvent from '@testing-library/user-event';

import {
  createMultiSearchResponse,
  createPlayground,
  createSearchClient,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('createAutocomplete', () => {
  test('returns the API', () => {
    const autocomplete = createAutocomplete({});

    expect(autocomplete).toEqual({
      getEnvironmentProps: expect.any(Function),
      getFormProps: expect.any(Function),
      getInputProps: expect.any(Function),
      getItemProps: expect.any(Function),
      getLabelProps: expect.any(Function),
      getListProps: expect.any(Function),
      getPanelProps: expect.any(Function),
      getRootProps: expect.any(Function),
      navigator: expect.any(Object),
      refresh: expect.any(Function),
      setCollections: expect.any(Function),
      setContext: expect.any(Function),
      setIsOpen: expect.any(Function),
      setQuery: expect.any(Function),
      setActiveItemId: expect.any(Function),
      setStatus: expect.any(Function),
    });
  });

  test('subscribes all plugins', () => {
    const plugin = { subscribe: jest.fn() };
    const autocomplete = createAutocomplete({ plugins: [plugin] });

    expect(plugin.subscribe).toHaveBeenCalledTimes(1);
    expect(plugin.subscribe).toHaveBeenLastCalledWith({
      onActive: expect.any(Function),
      onResolve: expect.any(Function),
      onSelect: expect.any(Function),
      navigator: expect.any(Object),
      refresh: autocomplete.refresh,
      setCollections: autocomplete.setCollections,
      setContext: autocomplete.setContext,
      setIsOpen: autocomplete.setIsOpen,
      setQuery: autocomplete.setQuery,
      setActiveItemId: autocomplete.setActiveItemId,
      setStatus: autocomplete.setStatus,
    });
  });

  describe('Insights plugin', () => {
    test('does not add Insights plugin by default', () => {
      const onStateChange = jest.fn();

      createAutocomplete({ onStateChange });

      expect(onStateChange).toHaveBeenCalledTimes(0);
    });

    test('`insights: true` adds only one Insights plugin', () => {
      const onStateChange = jest.fn();

      createAutocomplete({
        onStateChange,
        insights: true,
      });

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
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

    test('`insights` with options still creates one plugin only', () => {
      const onStateChange = jest.fn();
      const insightsClient = jest.fn();

      createAutocomplete({
        onStateChange,
        insights: { insightsClient },
      });

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
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

    test('`insights` with options passes options to plugin', () => {
      const insightsClient = jest.fn();

      createAutocomplete({
        insights: { insightsClient },
      });

      expect(insightsClient).toHaveBeenCalledTimes(5);
      expect(insightsClient).toHaveBeenCalledWith(
        'addAlgoliaAgent',
        'insights-plugin'
      );
    });

    test('`insights: false` disables default Insights plugin', () => {
      const onStateChange = jest.fn();

      createAutocomplete({
        insights: false,
        onStateChange,
      });

      expect(onStateChange).toHaveBeenCalledTimes(0);
    });

    test("users' Insights plugin overrides the default one when `insights: true`", () => {
      const defaultInsightsClient = jest.fn();
      const userInsightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({
        insightsClient: userInsightsClient,
      });

      createAutocomplete({
        insights: { insightsClient: defaultInsightsClient },
        plugins: [insightsPlugin],
      });

      expect(defaultInsightsClient).toHaveBeenCalledTimes(0);
      expect(userInsightsClient).toHaveBeenCalledTimes(5);
      expect(userInsightsClient).toHaveBeenCalledWith(
        'addAlgoliaAgent',
        'insights-plugin'
      );
    });

    describe('from the response', () => {
      let insightsClient: ReturnType<typeof jest.spyOn> = undefined;

      beforeEach(() => {
        insightsClient = jest.spyOn(window, 'aa');
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
      });

      test('opt-in adds the Insights plugin', async () => {
        const onStateChange = jest.fn();

        const searchClient = createSearchClient({
          search: jest.fn((requests) => {
            return Promise.resolve(
              createMultiSearchResponse<{ label: string }>(
                ...requests.map(({ indexName, query = '' }, index) => ({
                  hits: Array.from({ length: 2 }).map((_, i, arr) => ({
                    objectID: `${String(index * arr.length + i + 1)}-${query}`,
                    label: query,
                  })),
                  index: indexName,
                  queryID: `queryID${index}`,
                  query,
                  _automaticInsights: true as const,
                }))
              )
            );
          }),
        });

        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          defaultActiveItemId: 0,
          getSources({ query }) {
            return [
              {
                sourceId: 'items',
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
              },
              {
                sourceId: 'items2',
                getItems() {
                  return getAlgoliaResults({
                    searchClient,
                    queries: [
                      {
                        indexName: 'indexName2',
                        query,
                      },
                    ],
                  });
                },
              },
            ];
          },
        });

        inputElement.focus();
        await runAllMicroTasks();
        jest.runAllTimers();

        // The Insights plugin was properly added
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

        // Typing to change hits and trigger `view` events
        userEvent.type(inputElement, 'a');
        await runAllMicroTasks();
        jest.runAllTimers();

        // Subsequent requests don't send `clickAnalytics`
        expect(searchClient.search).toHaveBeenLastCalledWith([
          expect.objectContaining({
            query: 'a',
            params: expect.not.objectContaining({
              clickAnalytics: expect.anything(),
            }),
          }),
          expect.objectContaining({
            query: 'a',
            params: expect.not.objectContaining({
              clickAnalytics: expect.anything(),
            }),
          }),
        ]);

        // Default `view` events are sent for all
        expect(insightsClient).toHaveBeenCalledWith(
          'viewedObjectIDs',
          expect.objectContaining({
            eventName: 'Items Viewed',
            index: 'indexName',
            objectIDs: ['1-a', '2-a'],
            algoliaSource: [
              'autocomplete',
              'autocomplete-internal',
              'autocomplete-automatic',
            ],
          })
        );
        expect(insightsClient).toHaveBeenCalledWith(
          'viewedObjectIDs',
          expect.objectContaining({
            eventName: 'Items Viewed',
            index: 'indexName2',
            objectIDs: ['3-a', '4-a'],
            algoliaSource: [
              'autocomplete',
              'autocomplete-internal',
              'autocomplete-automatic',
            ],
          })
        );
      });

      test('partial opt-in adds the Insights plugin', async () => {
        const onStateChange = jest.fn();

        const searchClient = createSearchClient({
          search: jest.fn((requests) => {
            return Promise.resolve(
              createMultiSearchResponse<{ label: string }>(
                ...requests.map(({ indexName, query = '' }, index) => ({
                  hits: Array.from({ length: 2 }).map((_, i, arr) => ({
                    objectID: `${String(index * arr.length + i + 1)}-${query}`,
                    label: query,
                  })),
                  index: indexName,
                  query,
                }))
              )
            );
          }),
        });

        const searchClient2 = createSearchClient({
          search: jest.fn((requests) => {
            return Promise.resolve(
              createMultiSearchResponse<{ label: string }>(
                ...requests.map(({ indexName, query = '' }, index) => ({
                  hits: Array.from({ length: 2 }).map((_, i, arr) => ({
                    objectID: `${String(
                      (index + 1) * arr.length + i + 1
                    )}-${query}`,
                    label: query,
                  })),
                  index: indexName,
                  query,
                  queryID: `queryID${index}`,
                  _automaticInsights: true as const,
                }))
              )
            );
          }),
        });

        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          defaultActiveItemId: 0,
          getSources({ query }) {
            return [
              {
                sourceId: 'items',
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
              },
              {
                sourceId: 'items2',
                getItems() {
                  return getAlgoliaResults({
                    searchClient: searchClient2,
                    queries: [
                      {
                        indexName: 'indexName2',
                        query,
                      },
                    ],
                  });
                },
              },
            ];
          },
        });

        inputElement.focus();
        await runAllMicroTasks();
        jest.runAllTimers();

        // The Insights plugin was properly added
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

        // Typing to change hits and trigger `view` events
        userEvent.type(inputElement, 'a');
        await runAllMicroTasks();
        jest.runAllTimers();

        // Subsequent requests don't send `clickAnalytics`
        expect(searchClient.search).toHaveBeenLastCalledWith([
          expect.objectContaining({
            query: 'a',
            params: expect.not.objectContaining({
              clickAnalytics: expect.anything(),
            }),
          }),
        ]);
        expect(searchClient2.search).toHaveBeenLastCalledWith([
          expect.objectContaining({
            query: 'a',
            params: expect.not.objectContaining({
              clickAnalytics: expect.anything(),
            }),
          }),
        ]);

        // Default `view` events are not sent for the first set of items
        expect(insightsClient).not.toHaveBeenCalledWith(
          'viewedObjectIDs',
          expect.objectContaining({
            eventName: 'Items Viewed',
            index: 'indexName',
            objectIDs: ['1-a', '2-a'],
            algoliaSource: [
              'autocomplete',
              'autocomplete-internal',
              'autocomplete-automatic',
            ],
          })
        );
        // Default `view` events are sent for the second set of items
        expect(insightsClient).toHaveBeenCalledWith(
          'viewedObjectIDs',
          expect.objectContaining({
            eventName: 'Items Viewed',
            index: 'indexName2',
            objectIDs: ['3-a', '4-a'],
            algoliaSource: [
              'autocomplete',
              'autocomplete-internal',
              'autocomplete-automatic',
            ],
          })
        );
      });

      test('opt-out or unset does not add the Insights plugin', async () => {
        const onStateChange = jest.fn();

        const searchClient = createSearchClient({
          search: jest.fn((requests) => {
            return Promise.resolve(
              createMultiSearchResponse<{ label: string }>(
                ...requests.map(({ indexName, query = '' }, index) => ({
                  hits: Array.from({ length: 2 }).map((_, i, arr) => ({
                    objectID: String(index * arr.length + i + 1),
                    label: query,
                  })),
                  index: indexName,
                  query,
                }))
              )
            );
          }),
        });

        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          defaultActiveItemId: 0,
          getSources({ query }) {
            return [
              {
                sourceId: 'items',
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
              },
              {
                sourceId: 'items2',
                getItems() {
                  return getAlgoliaResults({
                    searchClient,
                    queries: [
                      {
                        indexName: 'indexName2',
                        query,
                      },
                    ],
                  });
                },
              },
            ];
          },
        });

        inputElement.focus();
        await runAllMicroTasks();
        jest.runAllTimers();

        // The Insights plugin was not added
        expect(onStateChange).not.toHaveBeenCalledWith(
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

        // Typing to change hits and trigger `view` events
        userEvent.type(inputElement, 'a');
        await runAllMicroTasks();

        // No default events are sent
        expect(insightsClient).not.toHaveBeenCalled();
      });

      test('opt-in + `insights: false` does not add the Insights plugin', async () => {
        const onStateChange = jest.fn();

        const searchClient = createSearchClient({
          search: jest.fn((requests) => {
            return Promise.resolve(
              createMultiSearchResponse<{ label: string }>(
                ...requests.map(({ indexName, query = '' }, index) => ({
                  hits: Array.from({ length: 2 }).map((_, i, arr) => ({
                    objectID: String(index * arr.length + i + 1),
                    label: query,
                  })),
                  index: indexName,
                  queryID: `queryID${index}`,
                  query,
                  _automaticInsights: true as const,
                }))
              )
            );
          }),
        });

        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          defaultActiveItemId: 0,
          insights: false,
          getSources({ query }) {
            return [
              {
                sourceId: 'items',
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
              },
              {
                sourceId: 'items2',
                getItems() {
                  return getAlgoliaResults({
                    searchClient,
                    queries: [
                      {
                        indexName: 'indexName2',
                        query,
                      },
                    ],
                  });
                },
              },
            ];
          },
        });

        inputElement.focus();
        await runAllMicroTasks();
        jest.runAllTimers();

        // The Insights plugin was not added
        expect(onStateChange).not.toHaveBeenCalledWith(
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

        // Typing to change hits and trigger `view` events
        userEvent.type(inputElement, 'a');
        await runAllMicroTasks();

        // No default events are sent
        expect(insightsClient).not.toHaveBeenCalled();
      });

      test('opt-in + `insights: true` does not add the Insights plugin a second time', async () => {
        const onStateChange = jest.fn();

        const searchClient = createSearchClient({
          search: jest.fn((requests) => {
            return Promise.resolve(
              createMultiSearchResponse<{ label: string }>(
                ...requests.map(({ indexName, query = '' }, index) => ({
                  hits: Array.from({ length: 2 }).map((_, i, arr) => ({
                    objectID: String(index * arr.length + i + 1),
                    label: query,
                  })),
                  index: indexName,
                  queryID: `queryID${index}`,
                  query,
                  _automaticInsights: true as const,
                }))
              )
            );
          }),
        });

        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          defaultActiveItemId: 0,
          insights: true,
          getSources({ query }) {
            return [
              {
                sourceId: 'items',
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
              },
              {
                sourceId: 'items2',
                getItems() {
                  return getAlgoliaResults({
                    searchClient,
                    queries: [
                      {
                        indexName: 'indexName2',
                        query,
                      },
                    ],
                  });
                },
              },
            ];
          },
        });

        inputElement.focus();
        await runAllMicroTasks();
        jest.runAllTimers();

        // The Insights plugin was added
        expect(insightsClient).toHaveBeenCalledWith(
          'addAlgoliaAgent',
          'insights-plugin'
        );

        insightsClient.mockClear();

        // Typing to change hits and trigger `view` events
        userEvent.type(inputElement, 'a');
        await runAllMicroTasks();

        // The Insights plugin was not added a second time
        expect(insightsClient).not.toHaveBeenCalledWith(
          'addAlgoliaAgent',
          'insights-plugin'
        );
      });
    });
  });
});
