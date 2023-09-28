import { createPlayground, createSource } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getItemProps', () => {
  const defaultItemProps = {
    item: { label: '1', __autocomplete_id: 0 },
    source: createSource({
      getItems() {
        return [{ label: '1' }];
      },
    }),
  };

  test('forwards the remaining props', () => {
    const { getItemProps } = createPlayground(createAutocomplete, {});
    const itemProps = getItemProps({
      ...defaultItemProps,
      customProps: {},
    });

    expect(itemProps).toEqual(expect.objectContaining({ customProps: {} }));
  });

  test('returns the id', () => {
    const { getItemProps } = createPlayground(createAutocomplete, {
      id: 'autocomplete',
    });
    const itemProps = getItemProps({
      ...defaultItemProps,
    });

    expect(itemProps.id).toEqual('autocomplete-testSource-item-0');
  });

  test('returns the role to option', () => {
    const { getItemProps } = createPlayground(createAutocomplete, {});
    const itemProps = getItemProps({
      ...defaultItemProps,
    });

    expect(itemProps.role).toEqual('option');
  });

  test('does not return aria-selected when not selected', () => {
    const { getItemProps } = createPlayground(createAutocomplete, {});
    const itemProps = getItemProps({
      ...defaultItemProps,
    });

    expect(itemProps['aria-selected']).toEqual(false);
  });

  test('returns aria-selected when selected', () => {
    const { getItemProps } = createPlayground(createAutocomplete, {
      initialState: {
        activeItemId: 0,
      },
    });
    const itemProps = getItemProps({
      ...defaultItemProps,
    });

    expect(itemProps['aria-selected']).toEqual(true);
  });

  describe('onMouseMove', () => {});
  describe('onMouseDown', () => {});
  describe('onClick', () => {});
});
