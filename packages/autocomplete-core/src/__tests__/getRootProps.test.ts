import { createCollection } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getRootProps', () => {
  test('forwards the remaining props', () => {
    const autocomplete = createAutocomplete({});
    const rootProps = autocomplete.getRootProps({ customProps: {} });

    expect(rootProps).toEqual(expect.objectContaining({ customProps: {} }));
  });

  test('returns a combobox role', () => {
    const autocomplete = createAutocomplete({});
    const rootProps = autocomplete.getRootProps({});

    expect(rootProps.role).toEqual('combobox');
  });

  test('returns aria-expanded false when panel is closed', () => {
    const autocomplete = createAutocomplete({
      initialState: {
        isOpen: false,
      },
    });
    const rootProps = autocomplete.getRootProps({});

    expect(rootProps['aria-expanded']).toEqual(false);
  });

  test('returns aria-expanded true when panel is open', () => {
    const autocomplete = createAutocomplete({
      initialState: {
        isOpen: true,
      },
    });
    const rootProps = autocomplete.getRootProps({});

    expect(rootProps['aria-expanded']).toEqual(true);
  });

  test('returns aria-haspopup to listbox', () => {
    const autocomplete = createAutocomplete({});
    const rootProps = autocomplete.getRootProps({});

    expect(rootProps['aria-haspopup']).toEqual('listbox');
  });

  test('returns undefined aria-owns when panel is closed', () => {
    const autocomplete = createAutocomplete({
      initialState: {
        isOpen: false,
      },
    });
    const rootProps = autocomplete.getRootProps({});

    expect(rootProps['aria-owns']).toBeUndefined();
  });

  test('returns list id in aria-owns when panel is open', () => {
    const autocomplete = createAutocomplete({
      id: 'autocomplete',
      initialState: {
        isOpen: true,
        collections: [
          createCollection({
            source: { sourceId: 'testSource' },
          }),
        ],
      },
    });
    const rootProps = autocomplete.getRootProps({});

    expect(rootProps['aria-owns']).toEqual('autocomplete-testSource-list');
  });

  test('returns label id in aria-labelledby', () => {
    const autocomplete = createAutocomplete({
      id: 'autocomplete',
      initialState: {
        isOpen: true,
      },
    });
    const rootProps = autocomplete.getRootProps({});

    expect(rootProps['aria-labelledby']).toEqual('autocomplete-label');
  });
});
