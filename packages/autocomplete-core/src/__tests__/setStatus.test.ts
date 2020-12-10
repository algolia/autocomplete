import { createAutocomplete } from '../createAutocomplete';

describe('setStatus', () => {
  test('sets the status', () => {
    const onStateChange = jest.fn();
    const { setStatus } = createAutocomplete({ onStateChange });

    setStatus('stalled');

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ status: 'stalled' }),
      })
    );
  });
});
