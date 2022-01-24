import { noop } from '@algolia/autocomplete-shared';
import userEvent from '@testing-library/user-event';

import { createAutocomplete, InternalAutocompleteSource } from '..';
import { createPlayground, createSource, defer } from '../../../../test/utils';

type Source = InternalAutocompleteSource<{ label: string }>;

const delay = 10;

const debounced = debouncePromise<Source[][], Source[]>(
  (items) => Promise.resolve(items),
  delay
);

describe('debouncing', () => {
  test('only submits the final query', async () => {
    const onStateChange = jest.fn();
    const getItems = jest.fn(({ query }) => [{ label: query }]);
    const { inputElement } = createPlayground(createAutocomplete, {
      onStateChange,
      getSources: () => debounced([createSource({ getItems })]),
    });

    userEvent.type(inputElement, 'abc');

    await defer(noop, delay);

    expect(getItems).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          status: 'idle',
          isOpen: true,
          collections: expect.arrayContaining([
            expect.objectContaining({
              items: [{ __autocomplete_id: 0, label: 'abc' }],
            }),
          ]),
        }),
      })
    );
  });

  test('triggers subsequent queries after reopening the panel', async () => {
    const onStateChange = jest.fn();
    const getItems = jest.fn(({ query }) => [{ label: query }]);
    const { inputElement } = createPlayground(createAutocomplete, {
      onStateChange,
      getSources: () => debounced([createSource({ getItems })]),
    });

    userEvent.type(inputElement, 'abc{esc}');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          status: 'idle',
          isOpen: false,
        }),
      })
    );

    userEvent.type(inputElement, 'def');

    await defer(noop, delay);

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          collections: expect.arrayContaining([
            expect.objectContaining({
              items: [{ __autocomplete_id: 0, label: 'abcdef' }],
            }),
          ]),
          status: 'idle',
          isOpen: true,
        }),
      })
    );
  });
});

function debouncePromise<TParams extends unknown[], TResponse>(
  fn: (...params: TParams) => Promise<TResponse>,
  time: number
) {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;

  return function (...args: TParams) {
    if (timerId) {
      clearTimeout(timerId);
    }

    return new Promise<TResponse>((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}
