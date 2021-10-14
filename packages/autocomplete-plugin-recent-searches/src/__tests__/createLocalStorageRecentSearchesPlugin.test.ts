import { createLocalStorageRecentSearchesPlugin } from '../createLocalStorageRecentSearchesPlugin';

describe('createLocalStorageRecentSearchesPlugin', () => {
  test('has a name', () => {
    const plugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
    });

    expect(plugin.name).toBe('aa.localStorageRecentSearchesPlugin');
  });
});
