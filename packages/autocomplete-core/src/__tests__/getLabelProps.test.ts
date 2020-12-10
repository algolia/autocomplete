import { createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getLabelProps', () => {
  test('forwards the remaining props', () => {
    const { getLabelProps } = createPlayground(createAutocomplete, {});
    const labelProps = getLabelProps({ customProps: {} });

    expect(labelProps).toEqual(expect.objectContaining({ customProps: {} }));
  });

  test('returns htmlFor to input ID', () => {
    const { getLabelProps } = createPlayground(createAutocomplete, {
      id: 'autocomplete',
    });
    const labelProps = getLabelProps({});

    expect(labelProps.htmlFor).toEqual('autocomplete-input');
  });

  test('returns id to label ID', () => {
    const { getLabelProps } = createPlayground(createAutocomplete, {
      id: 'autocomplete',
    });
    const labelProps = getLabelProps({});

    expect(labelProps.id).toEqual('autocomplete-label');
  });
});
