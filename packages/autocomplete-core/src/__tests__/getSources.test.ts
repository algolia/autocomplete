import userEvent from '@testing-library/user-event';

import { createSource } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

type AutocompleteItem = { url: string };

describe('getSources', () => {
  function setupTest(props) {
    const autocomplete = createAutocomplete<AutocompleteItem>({
      ...props,
    });
    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    inputElement.addEventListener('blur', inputProps.onBlur);
    inputElement.addEventListener('input', inputProps.onChange);
    inputElement.addEventListener('keydown', inputProps.onKeyDown);
    document.body.appendChild(inputElement);

    return {
      inputElement,
    };
  }

  test('gets calls on input', () => {
    const getSources = jest.fn(() => {
      return [createSource()];
    });
    const { inputElement } = setupTest({ getSources });

    inputElement.focus();
    userEvent.type(inputElement, 'a');

    expect(getSources).toHaveBeenCalledTimes(1);
    expect(getSources).toHaveBeenCalledWith({
      query: 'a',
      refresh: expect.any(Function),
      setCollections: expect.any(Function),
      setContext: expect.any(Function),
      setIsOpen: expect.any(Function),
      setQuery: expect.any(Function),
      setSelectedItemId: expect.any(Function),
      setStatus: expect.any(Function),
      state: {
        collections: [],
        completion: null,
        context: {},
        isOpen: false,
        query: 'a',
        selectedItemId: null,
        status: 'loading',
      },
    });
  });
});
