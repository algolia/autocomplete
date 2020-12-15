import { createAutocomplete } from '../createAutocomplete';

describe('setActiveItemId', () => {
  test('sets the active item ID', () => {
    const onStateChange = jest.fn();
    const { setActiveItemId } = createAutocomplete({ onStateChange });

    setActiveItemId(1);

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ activeItemId: 1 }),
      })
    );

    setActiveItemId(null);

    expect(onStateChange).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ activeItemId: null }),
      })
    );
  });
});
