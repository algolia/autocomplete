import userEvent from '@testing-library/user-event';

import { createAutocomplete } from '../createAutocomplete';

function defer<TValue>(fn: () => TValue, timeout: number) {
  return new Promise<TValue>((resolve) => {
    setTimeout(() => resolve(fn()), timeout);
  });
}

describe('concurrency', () => {
  test('resolves the responses in order from getSources', async () => {
    // These delays make the second query come back after the third one.
    const delays = [100, 300, 200];
    let deferCount = -1;

    const getSources = ({ query }) => {
      deferCount++;

      return defer(() => {
        return [
          {
            getItems() {
              return [{ label: query }];
            },
          },
        ];
      }, delays[deferCount]);
    };
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({ getSources, onStateChange });
    const { onChange } = autocomplete.getInputProps({ inputElement: null });
    const input = document.createElement('input');
    input.addEventListener('input', onChange);
    document.body.appendChild(input);

    userEvent.type(input, 'a');
    userEvent.type(input, 'b');
    userEvent.type(input, 'c');

    await defer(() => {}, Math.max(...delays));

    const itemsHistory: Array<{ label: string }> = (onStateChange.mock
      .calls as any).flatMap((x) =>
      x[0].state.collections.flatMap((x) => x.items)
    );

    // The second query should never have brought results.
    expect(itemsHistory.find((x) => x.label === 'ab')).toBeUndefined();

    // The last item must be the one corresponding to the last query.
    expect(itemsHistory[itemsHistory.length - 1]).toEqual(
      expect.objectContaining({ label: 'abc' })
    );

    document.body.removeChild(input);
  });
});
