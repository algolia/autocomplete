import { createAutocomplete } from '../createAutocomplete';

describe('id', () => {
  test('gets auto-incremented for each instance', () => {
    expect(createAutocomplete({}).getRootProps({})['aria-labelledby']).toEqual(
      'autocomplete-0-label'
    );
    expect(createAutocomplete({}).getRootProps({})['aria-labelledby']).toEqual(
      'autocomplete-1-label'
    );
    expect(createAutocomplete({}).getRootProps({})['aria-labelledby']).toEqual(
      'autocomplete-2-label'
    );
  });

  test('allows custom id', () => {
    const autocomplete = createAutocomplete({ id: 'docsearch' });
    const rootProps = autocomplete.getRootProps({});

    expect(rootProps['aria-labelledby']).toEqual('docsearch-label');
  });
});
