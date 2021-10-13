import { createLocalStorageRecentSearchesPlugin } from '../createLocalStorageRecentSearchesPlugin';

describe('createLocalStorageRecentSearchesPlugin', () => {
  test('has a name', () => {
    const plugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
    });

    expect(plugin.name).toBe('aa.localStorageRecentSearchesPlugin');
  });

  test('exposes passed options and excludes default ones', () => {
    const plugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
      limit: 3,
    });

    expect(plugin.__autocomplete_pluginOptions).toEqual({
      key: expect.any(String),
      limit: expect.any(Number),
    });
  });
});
