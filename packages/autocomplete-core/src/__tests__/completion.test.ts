import userEvent from '@testing-library/user-event';

import {
  createCollection,
  createPlayground,
  runAllMicroTasks,
} from '../../../../test/utils';
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
    userEvent.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          completion: '1',
        }),
      })
    );

    userEvent.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          completion: '2',
        }),
      })
    );

    userEvent.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          completion: null,
        }),
      })
    );
  });

  test('does not throw without collections with panel open', async () => {
    const onStateChange = jest.fn();
    const { inputElement } = createPlayground(createAutocomplete, {
      onStateChange,
      openOnFocus: true,
      initialState: {
        collections: [],
      },
      shouldPanelOpen() {
        return true;
      },
    });

    inputElement.focus();
    await runAllMicroTasks();

    userEvent.type(inputElement, '{arrowup}');
    await runAllMicroTasks();
    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          completion: null,
        }),
      })
    );
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
    userEvent.type(inputElement, '{esc}{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          completion: null,
        }),
      })
    );
  });

  test('does not set completion when no activeItemId', () => {
    const onStateChange = jest.fn();
    const { inputElement } = createPlayground(createAutocomplete, {
      openOnFocus: true,
      onStateChange,
    });

    inputElement.focus();
    userEvent.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          completion: null,
        }),
      })
    );
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
    userEvent.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          completion: null,
        }),
      })
    );
  });

  test('clears completion on "reset"', () => {
    const { inputElement, resetElement } = createPlayground(
      createAutocomplete,
      {
        openOnFocus: true,
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
      }
    );
    inputElement.focus();

    userEvent.type(inputElement, 'Some text to make sure reset shows');
    expect(inputElement).toHaveValue('Some text to make sure reset shows');

    userEvent.type(inputElement, '{arrowdown}');
    expect(inputElement).toHaveValue('1');

    resetElement.click();
    expect(inputElement).toHaveValue('');
  });
});
