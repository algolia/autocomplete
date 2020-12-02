import { createAutocomplete } from '../createAutocomplete';

describe('Validate options', () => {
  test('debug option warns about development usage', () => {
    expect(() => {
      createAutocomplete({ debug: true });
    }).toWarnDev(
      '[Autocomplete] The `debug` option is meant for development debugging and should not be used in production.'
    );
  });
});
