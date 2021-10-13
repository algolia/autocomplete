import insightsClient from 'search-insights';

import { createAlgoliaInsightsPlugin } from '../createAlgoliaInsightsPlugin';

describe('createAlgoliaInsightsPlugin', () => {
  test('has a name', () => {
    const plugin = createAlgoliaInsightsPlugin({ insightsClient });

    expect(plugin.name).toBe('aa.algoliaInsightsPlugin');
  });
  test.todo('tests');
});
