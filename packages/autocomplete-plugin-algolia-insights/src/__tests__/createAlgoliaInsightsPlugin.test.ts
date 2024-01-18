import { createAutocomplete } from '@algolia/autocomplete-core';
import {
  getAlgoliaFacets,
  getAlgoliaResults,
} from '@algolia/autocomplete-preset-algolia';
import { noop } from '@algolia/autocomplete-shared';
import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import insightsClient from 'search-insights';

import {
  createMultiSearchResponse,
  createPlayground,
  createSearchClient,
  createSource,
  defer,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createAlgoliaInsightsPlugin } from '../createAlgoliaInsightsPlugin';

describe('createAlgoliaInsightsPlugin', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    (window as any).AlgoliaAnalyticsObject = undefined;
    (window as any).aa = undefined;

    document.body.innerHTML = '';
  });

  afterEach(() => {
    global.window = originalWindow;
  });

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
                setAuthenticatedUserToken: expect.any(Function),
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

  test('sets a user agent on subscribe', () => {
    const insightsClient = jest.fn();
    const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

    expect(insightsClient).not.toHaveBeenCalled();

    createPlayground(createAutocomplete, { plugins: [insightsPlugin] });

    expect(insightsClient).toHaveBeenCalledTimes(5);
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

  test('does not call `init` if `insightsInitParams` not passed', () => {
    const insightsClient = jest.fn();
    createAlgoliaInsightsPlugin({
      insightsClient,
    });

    expect(insightsClient).not.toHaveBeenCalled();
  });

  test('initializes insights with `insightsInitParams` if passed', () => {
    const insightsClient = jest.fn();
    createAlgoliaInsightsPlugin({
      insightsClient,
      insightsInitParams: { userToken: 'user' },
    });

    expect(insightsClient).toHaveBeenCalledWith('init', {
      partial: true,
      userToken: 'user',
    });
  });

  describe('user token', () => {
    afterEach(() => {
      insightsClient('setAuthenticatedUserToken', undefined);
    });

    test('forwards `userToken` from Search Insights to Algolia API requests', async () => {
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const searchClient = createSearchClient({
        search: jest.fn(() =>
          Promise.resolve(
            createMultiSearchResponse({
              hits: [{ objectID: '1' }],
            })
          )
        ),
      });

      insightsClient('setUserToken', 'customUserToken');

      const playground = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        getSources({ query }) {
          return [
            {
              sourceId: 'hits',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [{ indexName: 'indexName', query }],
                });
              },
              templates: {
                item({ item }) {
                  return item.objectID;
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
          params: expect.objectContaining({ userToken: 'customUserToken' }),
        }),
      ]);
    });

    test('forwards `authenticatedUserToken` from Search Insights to Algolia API requests', async () => {
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const searchClient = createSearchClient({
        search: jest.fn(() =>
          Promise.resolve(
            createMultiSearchResponse({
              hits: [{ objectID: '1' }],
            })
          )
        ),
      });

      insightsClient('setAuthenticatedUserToken', 'customAuthUserToken');

      const playground = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        getSources({ query }) {
          return [
            {
              sourceId: 'hits',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [{ indexName: 'indexName', query }],
                });
              },
              templates: {
                item({ item }) {
                  return item.objectID;
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
          params: expect.objectContaining({ userToken: 'customAuthUserToken' }),
        }),
      ]);
    });

    test('uses `authenticatedUserToken` in priority over `userToken`', async () => {
      const insightsPlugin = createAlgoliaInsightsPlugin({
        insightsClient,
        insightsInitParams: {
          userToken: 'customUserToken',
        },
      });

      const searchClient = createSearchClient({
        search: jest.fn(() =>
          Promise.resolve(
            createMultiSearchResponse({
              hits: [{ objectID: '1' }],
            })
          )
        ),
      });

      // Setting an authenticated user token should replace the user token
      insightsClient('setAuthenticatedUserToken', 'customAuthUserToken');

      const playground = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        getSources({ query }) {
          return [
            {
              sourceId: 'hits',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [{ indexName: 'indexName', query }],
                });
              },
              templates: {
                item({ item }) {
                  return item.objectID;
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
          params: expect.objectContaining({ userToken: 'customAuthUserToken' }),
        }),
      ]);

      // Updating a user token should have no effect if there is
      // an authenticated user token already set
      insightsClient('setUserToken', 'customUserToken2');

      userEvent.type(playground.inputElement, 'b');
      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(2);
      expect(searchClient.search).toHaveBeenLastCalledWith([
        expect.objectContaining({
          params: expect.objectContaining({ userToken: 'customAuthUserToken' }),
        }),
      ]);

      // Removing the authenticated user token should revert to
      // the latest user token set
      insightsClient('setAuthenticatedUserToken', undefined);

      userEvent.type(playground.inputElement, 'c');
      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(3);
      expect(searchClient.search).toHaveBeenLastCalledWith([
        expect.objectContaining({
          params: expect.objectContaining({ userToken: 'customUserToken2' }),
        }),
      ]);
    });
  });

  describe('automatic pulling', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    afterAll(() => {
      consoleError.mockReset();
    });

    it('does not load the script when the Insights client is passed', async () => {
      createPlayground(createAutocomplete, {
        plugins: [createAlgoliaInsightsPlugin({ insightsClient: noop })],
      });

      await defer(noop, 0);

      expect(document.body).toMatchInlineSnapshot(`
        <body>
          <form>
            <input />
            <button
              type="reset"
            />
          </form>
        </body>
      `);
      expect((window as any).AlgoliaAnalyticsObject).toBeUndefined();
      expect((window as any).aa).toBeUndefined();
    });

    it('does not load the script when the Insights client is present in the page', async () => {
      (window as any).AlgoliaAnalyticsObject = 'aa';
      const aa = noop;
      (window as any).aa = aa;

      createPlayground(createAutocomplete, {
        plugins: [createAlgoliaInsightsPlugin({})],
      });

      await defer(noop, 0);

      expect(document.body).toMatchInlineSnapshot(`
        <body>
          <form>
            <input />
            <button
              type="reset"
            />
          </form>
        </body>
      `);
      expect((window as any).AlgoliaAnalyticsObject).toBe('aa');
      expect((window as any).aa).toBe(aa);
      expect((window as any).aa.version).toBeUndefined();
    });

    it('loads the script when the Insights client is not passed and not present in the page', async () => {
      createPlayground(createAutocomplete, {
        plugins: [createAlgoliaInsightsPlugin({})],
      });

      await defer(noop, 0);

      expect(document.body).toMatchInlineSnapshot(`
        <body>
          <script
            src="https://cdn.jsdelivr.net/npm/search-insights@2.13.0/dist/search-insights.min.js"
          />
          <form>
            <input />
            <button
              type="reset"
            />
          </form>
        </body>
      `);
      expect((window as any).AlgoliaAnalyticsObject).toBe('aa');
      expect((window as any).aa).toEqual(expect.any(Function));
      expect((window as any).aa.version).toBe('2.13.0');
    });

    it('notifies when the script fails to be added', () => {
      // @ts-ignore `createElement` is a class method can thus only be called on
      // an instance of `Document`, not as a standalone function.
      // This is needed to call the actual implementation later in the test.
      document.originalCreateElement = document.createElement;

      document.createElement = (tagName) => {
        if (tagName === 'script') {
          throw new Error('error');
        }

        // @ts-ignore
        return document.originalCreateElement(tagName);
      };

      createPlayground(createAutocomplete, {
        plugins: [createAlgoliaInsightsPlugin({})],
      });

      expect(consoleError).toHaveBeenCalledWith(
        '[Autocomplete]: Could not load search-insights.js. Please load it manually following https://alg.li/insights-autocomplete'
      );

      // @ts-ignore
      document.createElement = document.originalCreateElement;
    });

    it('notifies when the script fails to load', async () => {
      createPlayground(createAutocomplete, {
        plugins: [createAlgoliaInsightsPlugin({})],
      });

      await defer(noop, 0);

      fireEvent(document.querySelector('script')!, new ErrorEvent('error'));

      expect(consoleError).toHaveBeenCalledWith(
        '[Autocomplete]: Could not load search-insights.js. Please load it manually following https://alg.li/insights-autocomplete'
      );
    });

    it('does not throw in server environments', () => {
      // @ts-expect-error
      delete global.window;

      expect(() => {
        createPlayground(createAutocomplete, {
          plugins: [createAlgoliaInsightsPlugin({})],
        });
      }).not.toThrow();
    });
  });

  describe('onItemsChange', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

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
        algoliaSource: ['autocomplete', 'autocomplete-internal'],
      });
    });

    test('sends `viewedObjectIDs` events with additional parameters if client supports it', async () => {
      const insightsClient = jest.fn();
      // @ts-ignore
      insightsClient.version = '2.4.0';
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              sourceId: 'testSource1',
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_algoliaCredentials: {
                    appId: 'algoliaAppId1',
                    apiKey: 'algoliaApiKey1',
                  },
                  __autocomplete_indexName: 'index1',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
            createSource({
              sourceId: 'testSource2',
              getItems: () => [
                {
                  label: '2',
                  objectID: '2',
                  __autocomplete_algoliaCredentials: {
                    appId: 'algoliaAppId2',
                    apiKey: 'algoliaApiKey2',
                  },
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
      expect(insightsClient).toHaveBeenNthCalledWith(
        1,
        'viewedObjectIDs',
        expect.objectContaining({
          index: 'index1',
          objectIDs: ['1'],
        }),
        {
          headers: {
            'X-Algolia-Application-Id': 'algoliaAppId1',
            'X-Algolia-API-Key': 'algoliaApiKey1',
          },
        }
      );
      expect(insightsClient).toHaveBeenNthCalledWith(
        2,
        'viewedObjectIDs',
        expect.objectContaining({
          index: 'index2',
          objectIDs: ['2'],
        }),
        {
          headers: {
            'X-Algolia-Application-Id': 'algoliaAppId2',
            'X-Algolia-API-Key': 'algoliaApiKey2',
          },
        }
      );
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
        algoliaSource: ['autocomplete', 'autocomplete-internal'],
      });
      expect(insightsClient).toHaveBeenNthCalledWith(2, 'viewedObjectIDs', {
        eventName: 'Items Viewed',
        index: 'index2',
        objectIDs: ['2'],
        algoliaSource: ['autocomplete', 'autocomplete-internal'],
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
        algoliaSource: ['autocomplete'],
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
        algoliaSource: ['autocomplete', 'autocomplete-internal'],
      });

      // The call triggered with "help" occurred after the timeout, so the item
      // with label "help" was reported as viewed a second time.
      expect(insightsClient).toHaveBeenCalledWith('viewedObjectIDs', {
        eventName: 'Items Viewed',
        index: 'index1',
        objectIDs: ['3'],
        algoliaSource: ['autocomplete', 'autocomplete-internal'],
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
          positions: [1],
          queryID: 'queryID1',
          algoliaSource: ['autocomplete', 'autocomplete-internal'],
        }
      );
    });

    test('sends a `clickedObjectIDsAfterSearch` event on non-first source by default', async () => {
      const insightsClient = jest.fn();
      const insightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

      const { inputElement } = createPlayground(createAutocomplete, {
        plugins: [insightsPlugin],
        defaultActiveItemId: 0,
        openOnFocus: true,
        getSources() {
          return [
            createSource({
              sourceId: 'not clicked',
              getItems: () => [
                {
                  label: '1',
                  objectID: '1',
                  __autocomplete_indexName: 'index0',
                  __autocomplete_queryID: 'queryID1',
                },
              ],
            }),
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

      // select second item
      userEvent.type(inputElement, '{arrowdown}{enter}');

      await runAllMicroTasks();

      expect(insightsClient).toHaveBeenCalledWith(
        'clickedObjectIDsAfterSearch',
        {
          eventName: 'Item Selected',
          index: 'index1',
          objectIDs: ['1'],
          positions: [1],
          queryID: 'queryID1',
          algoliaSource: ['autocomplete', 'autocomplete-internal'],
        }
      );
    });

    test('sends a `clickedObjectIDsAfterSearch` event with additional parameters if client supports it', async () => {
      const insightsClient = jest.fn();
      // @ts-ignore
      insightsClient.version = '2.13.0';
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
                  __autocomplete_algoliaCredentials: {
                    appId: 'algoliaAppId',
                    apiKey: 'algoliaApiKey',
                  },
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
        expect.objectContaining({
          objectIDs: ['1'],
        }),
        {
          headers: {
            'X-Algolia-Application-Id': 'algoliaAppId',
            'X-Algolia-API-Key': 'algoliaApiKey',
          },
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
          positions: [1],
          queryID: 'queryID1',
          algoliaSource: ['autocomplete'],
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
        items: [
          expect.objectContaining({
            label: '1',
            objectID: '1',
            __autocomplete_indexName: 'index1',
            __autocomplete_queryID: 'queryID1',
          }),
        ],
        positions: [1],
        queryID: 'queryID1',
        algoliaSource: ['autocomplete'],
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
