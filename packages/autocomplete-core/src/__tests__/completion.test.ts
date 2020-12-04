import userEvents from '@testing-library/user-event';

import { createCollection, createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('completion', () => {
  test('updates the completion state', () => {
    const onStateChange = jest.fn();
    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      onStateChange,
      initialState: {
        collections: [
          createCollection({
            source: {
              getItemInputValue({ item }) {
                return item.label;
              },
            },
            items: [{ label: '1' }, { label: '2' }],
          }),
        ],
      },
    });

    inputElement.focus();
    userEvents.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        completion: '1',
      }),
    });

    userEvents.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        completion: '2',
      }),
    });

    userEvents.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        completion: null,
      }),
    });
  });

  test('does not set completion when panel is closed', () => {
    const onStateChange = jest.fn();
    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      onStateChange,
      initialState: {
        collections: [
          createCollection({
            source: {
              getItemInputValue({ item }) {
                return item.label;
              },
            },
            items: [{ label: '1' }, { label: '2' }],
          }),
        ],
      },
    });

    inputElement.focus();
    userEvents.type(inputElement, '{esc}{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        completion: null,
      }),
    });
  });

  test('does not set completion when no selectedItemId', () => {
    const onStateChange = jest.fn();
    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      onStateChange,
    });

    inputElement.focus();
    userEvents.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        completion: null,
      }),
    });
  });

  test('does not set completion without itemInputValue', () => {
    const onStateChange = jest.fn();
    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      onStateChange,
      initialState: {
        collections: [
          createCollection({
            items: [{ label: '1' }, { label: '2' }],
          }),
        ],
      },
    });

    inputElement.focus();
    userEvents.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        completion: null,
      }),
    });
  });
});
