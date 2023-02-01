import { createRedirectUrlPlugin } from '../createRedirectUrlPlugin';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('createQuerySuggestionsPlugin', () => {
  test('has a name', () => {
    const plugin = createRedirectUrlPlugin({});

    expect(plugin.name).toBe('aa.redirectUrlPlugin');
  });
});
