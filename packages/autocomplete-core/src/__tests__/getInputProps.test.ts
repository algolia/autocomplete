import { createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getInputProps', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('forwards the remaining props', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement, customProps: {} });

    expect(inputProps).toEqual(expect.objectContaining({ customProps: {} }));
  });

  test('returns aria-autocomplete to both', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-autocomplete']).toEqual('both');
  });

  test('returns undefined aria-activedescendant when panel is closed', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-activedescendant']).toBeUndefined();
  });

  test('returns undefined aria-activedescendant when panel is open and but no selected item', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        initialState: {
          isOpen: true,
          selectedItemId: null,
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-activedescendant']).toBeUndefined();
  });

  test('returns aria-activedescendant with item ID when panel is open', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        id: 'autocomplete',
        initialState: {
          isOpen: true,
          selectedItemId: 0,
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-activedescendant']).toEqual('autocomplete-item-0');
  });

  test('returns undefined aria-controls when panel is closed', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-controls']).toBeUndefined();
  });

  test('returns aria-controls with list ID when panel is open', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      { id: 'autocomplete', initialState: { isOpen: true } }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-controls']).toEqual('autocomplete-list');
  });

  test('returns aria-labelledby with label ID', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        id: 'autocomplete',
        initialState: { isOpen: true },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-labelledby']).toEqual('autocomplete-label');
  });

  test('returns completion as value if exists', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        initialState: {
          query: 'i',
          completion: 'ipa',
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.value).toEqual('ipa');
  });

  test('returns value', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        initialState: {
          query: 'i',
          completion: null,
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.value).toEqual('i');
  });

  test('returns id with input ID', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        id: 'autocomplete',
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.id).toEqual('autocomplete-input');
  });

  test('returns autoComplete to off', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoComplete).toEqual('off');
  });

  test('returns autoCorrect to off', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoCorrect).toEqual('off');
  });

  test('returns autoCapitalize to off', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoCapitalize).toEqual('off');
  });

  test('returns spellCheck to false', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.spellCheck).toEqual('false');
  });

  test('returns autoFocus to false by default', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoFocus).toEqual(false);
  });

  test('returns autoFocus to true with autoFocus prop', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      { autoFocus: true }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoFocus).toEqual(true);
  });

  test('returns placeholder with placeholder prop', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      { placeholder: 'My placeholder' }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.placeholder).toEqual('My placeholder');
  });

  test('returns default maxLength to 512', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.maxLength).toEqual(512);
  });

  test('returns custom maxLength', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement, maxLength: 60 });

    expect(inputProps.maxLength).toEqual(60);
  });

  test('returns search type', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.type).toEqual('search');
  });

  describe('onChange', () => {});
  describe('onKeyDown', () => {});
  describe('onFocus', () => {});
  describe('onBlur', () => {});
  describe('onClick', () => {});
});
