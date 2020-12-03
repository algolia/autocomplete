import { createAutocomplete } from '../createAutocomplete';

describe('autoFocus', () => {
  test('provides the default autoFocus input prop', () => {
    const { getInputProps } = createAutocomplete({});
    const inputProps = getInputProps({ inputElement: null });

    expect(inputProps.autoFocus).toEqual(false);
  });

  test('provides the autoFocus input prop', () => {
    const { getInputProps } = createAutocomplete({ autoFocus: true });
    const inputProps = getInputProps({ inputElement: null });

    expect(inputProps.autoFocus).toEqual(true);
  });
});
