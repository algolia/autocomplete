import userEvent from '@testing-library/user-event';

import { createSource, defer } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('concurrency', () => {
  test('resolves the responses in order from getSources', async () => {
    // These delays make the second query come back after the third one.
    const sourcesDelays = [100, 150, 200];
    const itemsDelays = [0, 150, 0];
    let deferSourcesCount = -1;
    let deferItemsCount = -1;

    const getSources = ({ query }) => {
      deferSourcesCount++;

      return defer(() => {
        return [
          createSource({
            getItems() {
              deferItemsCount++;

              return defer(
                () => [{ label: query }],
                itemsDelays[deferItemsCount]
              );
            },
          }),
        ];
      }, sourcesDelays[deferSourcesCount]);
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

    await defer(() => {},
    Math.max(...sourcesDelays.map((delay, index) => delay + itemsDelays[index])));

    const itemsHistory: Array<{ label: string }> = (onStateChange.mock
      .calls as any).flatMap((x) =>
      x[0].state.collections.flatMap((x) => x.items)
    );

    // The first query should have brought results.
    expect(itemsHistory.find((x) => x.label === 'a')).toBeDefined();
    // The second query should never have brought results.
    expect(itemsHistory.find((x) => x.label === 'ab')).toBeUndefined();

    // The last item must be the one corresponding to the last query.
    expect(itemsHistory[itemsHistory.length - 1]).toEqual(
      expect.objectContaining({ label: 'abc' })
    );

    document.body.removeChild(input);
  });
});
