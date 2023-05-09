import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';

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

      expect(insightsClient).toHaveBeenCalledTimes(1);
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
      expect(userInsightsClient).toHaveBeenCalledTimes(1);
      expect(userInsightsClient).toHaveBeenCalledWith(
        'addAlgoliaAgent',
        'insights-plugin'
      );
    });
  });
});
