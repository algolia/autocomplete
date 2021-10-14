import { noop } from '@algolia/autocomplete-shared';

import { createRecentSearchesPlugin } from '../createRecentSearchesPlugin';

describe('createRecentSearchesPlugin', () => {
  test('has a name', () => {
    const plugin = createRecentSearchesPlugin({
      storage: { onAdd: noop, onRemove: noop, getAll: () => [] },
    });

    expect(plugin.name).toBe('aa.recentSearchesPlugin');
  });

  test.todo('saves the query on select');

  test.todo('does not save the query on select without item input value');

  test.todo('saves the query on submit');

  test.todo('does not save empty query on submit');

  test.todo('does not add source without recent searches');

  test.todo('adds source with recent searches');

  test.todo('renders the template');

  test.todo('supports custom templates');

  test.todo('removes the recent searche on action button click');

  test.todo('exports `getAlgoliaSearchParams` data');
});
