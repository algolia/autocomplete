import { createAutocomplete } from '../createAutocomplete';

describe('setIsOpen', () => {
  test('sets isOpen', () => {
    const onStateChange = jest.fn();
    const { setIsOpen } = createAutocomplete({ onStateChange });
    setIsOpen(true);

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ isOpen: true }),
      })
    );
  });
});
