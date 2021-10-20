import { createAutocomplete } from '@algolia/autocomplete-core';
import { noop } from '@algolia/autocomplete-shared';
import insightsClient from 'search-insights';

import { createPlayground } from '../../../../test/utils';
import { createAlgoliaInsightsPlugin } from '../createAlgoliaInsightsPlugin';

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

  describe('onItemsChange', () => {
    test.todo('sends a `viewedObjectIDs` event by default');

    test.todo('sends a custom event');

    test.todo('debounces calls');

    test.todo('does not send an event with non-Algolia Insights hits');
  });

  describe('onSelect', () => {
    test.todo('sends a `clickedObjectIDsAfterSearch` event by default');

    test.todo('sends a custom event');

    test.todo('does not send an event with non-Algolia Insights hits');
  });

  describe('onActive', () => {
    test.todo('does not send an event by default');

    test.todo('sends a custom event');

    test.todo('does not send an event with non-Algolia Insights hits');
  });
});
