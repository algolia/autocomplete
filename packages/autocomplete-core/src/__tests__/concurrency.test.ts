import { noop } from '@algolia/autocomplete-shared';
import userEvent from '@testing-library/user-event';

import { AutocompleteState } from '..';
import {
  createPlayground,
  createSource,
  defer,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

type Item = {
  label: string;
};

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('concurrency', () => {
  test('resolves the responses in order from getSources', async () => {
    const { timeout, delayedGetSources: getSources } = createDelayedGetSources({
      // These delays make the second query come back after the third one.
      sources: [100, 150, 200],
      items: [0, 150, 0],
    });

    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({ getSources, onStateChange });
    const { onChange } = autocomplete.getInputProps({ inputElement: null });
    const input = document.createElement('input');
    input.addEventListener('input', onChange);
    document.body.appendChild(input);

    userEvent.type(input, 'a');
    userEvent.type(input, 'b');
    userEvent.type(input, 'c');

    await defer(noop, timeout);

    let stateHistory: Array<AutocompleteState<Item>> =
      onStateChange.mock.calls.flatMap((x) => x[0].state);

    const itemsHistory: Item[] = stateHistory.flatMap(({ collections }) =>
      collections.flatMap((x) => x.items)
    );

    // The first query should have brought results.
    expect(itemsHistory.find((x) => x.label === 'a')).toBeDefined();
    // The second query should never have brought results.
    expect(itemsHistory.find((x) => x.label === 'ab')).toBeUndefined();

    // The last item must be the one corresponding to the last query.
    expect(itemsHistory[itemsHistory.length - 1]).toEqual(
      expect.objectContaining({ label: 'abc' })
    );

    expect(stateHistory[stateHistory.length - 1]).toEqual(
      expect.objectContaining({ isOpen: true })
    );

    userEvent.type(input, '{backspace}'.repeat(3));

    await defer(noop, timeout);

    stateHistory = onStateChange.mock.calls.flatMap((x) => x[0].state);

    // The collections are empty despite late resolving promises.
    expect(stateHistory[stateHistory.length - 1].collections).toEqual([
      expect.objectContaining({ items: [] }),
    ]);

    // The panel closes despite late resolving promises.
    expect(stateHistory[stateHistory.length - 1]).toEqual(
      expect.objectContaining({ isOpen: false })
    );

    document.body.removeChild(input);
  });

  describe('closing the panel with pending requests', () => {
    describe('without debug mode', () => {
      test('keeps the panel closed on Escape', async () => {
        const onStateChange = jest.fn();
        const { timeout, delayedGetSources } = createDelayedGetSources({
          sources: [100, 200],
        });
        const getSources = jest.fn(delayedGetSources);

        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          getSources,
        });

        userEvent.type(inputElement, 'ab');

        // The search request is triggered
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'loading',
              query: 'ab',
            }),
          })
        );

        userEvent.type(inputElement, '{esc}');

        // The status is immediately set to "idle" and the panel is closed
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'idle',
              isOpen: false,
              query: '',
            }),
          })
        );

        await defer(noop, timeout);

        // Once the request is settled, the state remains unchanged
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'idle',
              isOpen: false,
            }),
          })
        );

        expect(getSources).toHaveBeenCalledTimes(3);
      });

      test('keeps the panel closed on Enter', async () => {
        const onStateChange = jest.fn();
        const { timeout, delayedGetSources } = createDelayedGetSources({
          sources: [100, 200],
        });
        const getSources = jest.fn(delayedGetSources);

        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          getSources,
        });

        userEvent.type(inputElement, 'a');

        await runAllMicroTasks();

        // The search request is triggered
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'loading',
              query: 'a',
            }),
          })
        );

        userEvent.type(inputElement, '{enter}');

        // The status is immediately set to "idle" and the panel is closed
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'idle',
              isOpen: false,
              query: 'a',
            }),
          })
        );

        await defer(noop, timeout);

        // Once the request is settled, the state remains unchanged
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'idle',
              isOpen: false,
            }),
          })
        );

        expect(getSources).toHaveBeenCalledTimes(2);
      });

      test('keeps the panel closed on click outside', async () => {
        const onStateChange = jest.fn();
        const { timeout, delayedGetSources } = createDelayedGetSources({
          sources: [100, 200],
        });
        const getSources = jest.fn(delayedGetSources);

        const { inputElement, getEnvironmentProps, formElement } =
          createPlayground(createAutocomplete, {
            onStateChange,
            getSources,
          });

        const panelElement = document.createElement('div');

        const { onMouseDown } = getEnvironmentProps({
          inputElement,
          formElement,
          panelElement,
        });
        window.addEventListener('mousedown', onMouseDown);

        userEvent.type(inputElement, 'a');

        await runAllMicroTasks();

        // The search request is triggered
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'loading',
              query: 'a',
            }),
          })
        );

        userEvent.click(document.body);

        // The status is immediately set to "idle" and the panel is closed
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'idle',
              isOpen: false,
              query: 'a',
            }),
          })
        );

        await defer(noop, timeout);

        // Once the request is settled, the state remains unchanged
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'idle',
              isOpen: false,
            }),
          })
        );

        expect(getSources).toHaveBeenCalledTimes(1);
      });

      test('keeps the panel closed on touchstart', async () => {
        const onStateChange = jest.fn();
        const { timeout, delayedGetSources } = createDelayedGetSources({
          sources: [100, 200],
        });
        const getSources = jest.fn(delayedGetSources);

        const { getEnvironmentProps, inputElement, formElement } =
          createPlayground(createAutocomplete, {
            onStateChange,
            getSources,
          });

        const panelElement = document.createElement('div');

        const { onTouchStart } = getEnvironmentProps({
          inputElement,
          formElement,
          panelElement,
        });
        window.addEventListener('touchstart', onTouchStart);

        userEvent.type(inputElement, 'a');

        await runAllMicroTasks();

        // The search request is triggered
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'loading',
              query: 'a',
            }),
          })
        );

        const customEvent = new CustomEvent('touchstart', { bubbles: true });
        window.document.dispatchEvent(customEvent);

        // The status is immediately set to "idle" and the panel is closed
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'idle',
              isOpen: false,
              query: 'a',
            }),
          })
        );

        await defer(noop, timeout);

        // Once the request is settled, the state remains unchanged
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              status: 'idle',
              isOpen: false,
            }),
          })
        );

        expect(getSources).toHaveBeenCalledTimes(1);

        window.removeEventListener('touchstart', onTouchStart);
      });
    });

    describe('with debug mode', () => {
      const delay = 300;

      test('keeps the panel closed on Escape', async () => {
        const onStateChange = jest.fn();
        const getSources = jest.fn(() => {
          return defer(() => {
            return [
              createSource({
                getItems: () => [{ label: '1' }, { label: '2' }],
              }),
            ];
          }, delay);
        });
        const { inputElement } = createPlayground(createAutocomplete, {
          debug: true,
          onStateChange,
          getSources,
        });

        userEvent.type(inputElement, 'a{esc}');

        await defer(noop, delay);

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: false,
              status: 'idle',
            }),
          })
        );
        expect(getSources).toHaveBeenCalledTimes(1);
      });

      test('keeps the panel open on blur', async () => {
        const onStateChange = jest.fn();
        const getSources = jest.fn(() => {
          return defer(() => {
            return [
              createSource({
                getItems: () => [{ label: '1' }, { label: '2' }],
              }),
            ];
          }, delay);
        });
        const { inputElement } = createPlayground(createAutocomplete, {
          debug: true,
          onStateChange,
          getSources,
        });

        userEvent.type(inputElement, 'a{enter}');

        await defer(noop, delay);

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: true,
              status: 'idle',
            }),
          })
        );
        expect(getSources).toHaveBeenCalledTimes(1);
      });

      test('keeps the panel open on touchstart blur', async () => {
        const onStateChange = jest.fn();
        const getSources = jest.fn(() => {
          return defer(() => {
            return [
              createSource({
                getItems: () => [{ label: '1' }, { label: '2' }],
              }),
            ];
          }, delay);
        });
        const { getEnvironmentProps, inputElement, formElement } =
          createPlayground(createAutocomplete, {
            debug: true,
            onStateChange,
            getSources,
          });

        const panelElement = document.createElement('div');

        const { onTouchStart } = getEnvironmentProps({
          inputElement,
          formElement,
          panelElement,
        });
        window.addEventListener('touchstart', onTouchStart);

        userEvent.type(inputElement, 'a');
        const customEvent = new CustomEvent('touchstart', { bubbles: true });
        window.document.dispatchEvent(customEvent);

        await defer(noop, delay);

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: true,
              status: 'idle',
            }),
          })
        );
        expect(getSources).toHaveBeenCalledTimes(1);

        window.removeEventListener('touchstart', onTouchStart);
      });
    });
  });
});

function createDelayedGetSources(delays: {
  sources: number[];
  items?: number[];
}) {
  let deferSourcesCount = -1;
  let deferItemsCount = -1;

  const itemsDelays = delays.items || delays.sources.map(() => 0);

  const timeout = Math.max(
    ...delays.sources.map((delay, index) => delay + itemsDelays[index])
  );

  function delayedGetSources({ query }) {
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
    }, delays.sources[deferSourcesCount]);
  }

  return { timeout, delayedGetSources };
}
