import userEvent from '@testing-library/user-event';

import { createAutocomplete } from '../createAutocomplete';

describe('onSubmit', () => {
  test('calls the user provided onSubmit function', () => {
    const onSubmitProp = jest.fn();
    const { getFormProps } = createAutocomplete({ onSubmit: onSubmitProp });

    const form = document.createElement('form');
    const { onSubmit } = getFormProps({ inputElement: null });
    form.addEventListener('submit', onSubmit);
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';

    document.body.appendChild(form);
    form.appendChild(submitButton);

    userEvent.click(submitButton);

    expect(onSubmitProp).toHaveBeenCalledTimes(1);
    expect(onSubmitProp).toHaveBeenCalledWith({
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
