import userEvent from '@testing-library/user-event';

import { createAutocomplete } from '../createAutocomplete';

describe('onReset', () => {
  test('calls the user provided onReset function', () => {
    const onResetProp = jest.fn();
    const { getFormProps } = createAutocomplete({ onReset: onResetProp });

    const form = document.createElement('form');
    const { onReset } = getFormProps({ inputElement: null });
    form.addEventListener('reset', onReset);
    const resetButton = document.createElement('button');
    resetButton.type = 'reset';

    document.body.appendChild(form);
    form.appendChild(resetButton);

    userEvent.click(resetButton);

    expect(onResetProp).toHaveBeenCalledTimes(1);
    expect(onResetProp).toHaveBeenCalledWith({
      event: expect.any(Event),
      navigator: expect.any(Object),
      refresh: expect.any(Function),
      setCollections: expect.any(Function),
      setContext: expect.any(Function),
      setIsOpen: expect.any(Function),
      setQuery: expect.any(Function),
      setActiveItemId: expect.any(Function),
      setStatus: expect.any(Function),
      state: {
        collections: [],
        completion: null,
        context: {},
        isOpen: false,
        query: '',
        activeItemId: null,
        status: 'idle',
      },
    });
  });
});
