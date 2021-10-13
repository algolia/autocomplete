import { createSearchClient } from '../../../../test/utils';
import { createQuerySuggestionsPlugin } from '../createQuerySuggestionsPlugin';

const searchClient = createSearchClient();

describe('createQuerySuggestionsPlugin', () => {
  test('has a name', () => {
    const plugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
    });

    expect(plugin.name).toBe('aa.querySuggestionsPlugin');
  });

  test.todo('adds a source');

  test.todo('fills the input with the query item key');

  test.todo('renders the template');

  test.todo('supports custom templates');

  test.todo('fills the query on action button click');

  test.todo('supports user search params');
});
