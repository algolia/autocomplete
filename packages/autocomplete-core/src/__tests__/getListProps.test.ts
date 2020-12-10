import { createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getListProps', () => {
  test('forwards the remaining props', () => {
    const { getListProps } = createPlayground(createAutocomplete, {});
    const listProps = getListProps({ customProps: {} });

    expect(listProps).toEqual(expect.objectContaining({ customProps: {} }));
  });

  test('returns role to listbox', () => {
    const { getListProps } = createPlayground(createAutocomplete, {
      id: 'autocomplete',
    });
    const listProps = getListProps({});

    expect(listProps.role).toEqual('listbox');
  });

  test('returns aria-labelledby to label ID', () => {
    const { getListProps } = createPlayground(createAutocomplete, {
      id: 'autocomplete',
    });
    const listProps = getListProps({});

    expect(listProps['aria-labelledby']).toEqual('autocomplete-label');
  });

  test('returns id to list ID', () => {
    const { getListProps } = createPlayground(createAutocomplete, {
      id: 'autocomplete',
    });
    const listProps = getListProps({});

    expect(listProps.id).toEqual('autocomplete-list');
  });
});
