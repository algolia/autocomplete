import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions/src';

import { createRedirectUrlPlugin } from '../createRedirectUrlPlugin';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('createRedirectUrlPlugin', () => {
  test('has a name', () => {
    const plugin = createRedirectUrlPlugin({});

    expect(plugin.name).toBe('aa.redirectUrlPlugin');
  });

  test('exposes passed options and excludes default ones', () => {
    const plugin = createRedirectUrlPlugin({
      transformResponse: jest.fn(),
      templates: { item: () => 'hey'},
      onRedirect: jest.fn(),
    });

    expect(plugin.__autocomplete_pluginOptions).toEqual({
      transformResponse: expect.any(Function),
      templates: expect.any(Object),
      onRedirect: expect.any(Function),
    });
  });
});
