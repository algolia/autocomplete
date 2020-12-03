import { createAutocomplete } from '../createAutocomplete';

describe('placeholder', () => {
  test('provides the default placeholder input prop', () => {
    const { getInputProps } = createAutocomplete({});
    const inputProps = getInputProps({ inputElement: null });

    expect(inputProps.placeholder).toEqual('');
  });

  test('provides the user placeholder input prop', () => {
    const { getInputProps } = createAutocomplete({
      placeholder: 'My placeholder',
    });
    const inputProps = getInputProps({ inputElement: null });

    expect(inputProps.placeholder).toEqual('My placeholder');
  });
});
