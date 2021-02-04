import { createAutocomplete } from '../createAutocomplete';

describe('initialState', () => {
  test('defaults to an empty state', () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({ onStateChange });
    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(inputElement);

    inputElement.focus();

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        prevState: {
          activeItemId: null,
          query: '',
          completion: null,
          collections: [],
          isOpen: false,
          status: 'idle',
          context: {},
        },
      })
    );
  });

  test('sets the initial state', () => {
    const initialState = {
      activeItemId: 0,
      query: 'Initial query',
      completion: 'Initial query completion',
      collections: [],
      isOpen: true,
      status: 'loading' as const,
      context: {
        isFirstVisit: true,
      },
    };
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({ initialState, onStateChange });
    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(inputElement);

    inputElement.focus();

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        prevState: initialState,
      })
    );
  });
});
