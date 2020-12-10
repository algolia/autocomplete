import { createAutocomplete } from '../createAutocomplete';

describe('setQuery', () => {
  test('sets the query', () => {
    const onStateChange = jest.fn();
    const { setQuery } = createAutocomplete({ onStateChange });

    setQuery('query');

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ query: 'query' }),
      })
    );
  });
});
