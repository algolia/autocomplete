import { noop } from '@algolia/autocomplete-shared';
import insightsClient from 'search-insights';

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

  test.todo('tests');
});
