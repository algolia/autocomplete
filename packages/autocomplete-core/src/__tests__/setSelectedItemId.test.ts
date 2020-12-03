import { createAutocomplete } from '../createAutocomplete';

describe('setSelectedItemId', () => {
  test('sets the selected item ID', () => {
    const onStateChange = jest.fn();
    const { setSelectedItemId } = createAutocomplete({ onStateChange });

    setSelectedItemId(1);

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ selectedItemId: 1 }),
      })
    );

    setSelectedItemId(null);

    expect(onStateChange).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ selectedItemId: null }),
      })
    );
  });
});
