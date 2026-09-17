import { warnCache } from '@algolia/autocomplete-shared';

import { createMatchMedia, createSource } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

describe('detachedMediaQuery', () => {
  afterEach(() => {
    warnCache.current = {};
  });
  afterAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({}),
    });
  });

  test('falls back to the deprecated `addListener` if `addEventListener` is undefined', () => {
    const addListener = jest.fn();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({
        matches: true,
        addListener,
        addEventListener: undefined,
      }),
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
      container,
      getSources() {
        return [
          {
            ...createSource({}),
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
    });

    expect(addListener).toHaveBeenCalledTimes(1);
  });

  test('warns when detached mode is active and `openOnFocus` is false', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({ matches: true }),
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
      container,
      openOnFocus: false,
      getSources() {
        return [createSource({})];
      },
    });

    expect(
      consoleWarn.mock.calls.some((call) =>
        String(call[0]).includes(
          '`openOnFocus: false` can lead to unexpected behavior in detached mode'
        )
      )
    ).toBe(true);

    consoleWarn.mockRestore();
  });

  test('warns when detached mode is active and `openOnFocus` is omitted (default)', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({ matches: true }),
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
      container,
      getSources() {
        return [createSource({})];
      },
    });

    expect(
      consoleWarn.mock.calls.some((call) =>
        String(call[0]).includes(
          '`openOnFocus: false` can lead to unexpected behavior in detached mode'
        )
      )
    ).toBe(true);

    consoleWarn.mockRestore();
  });

  test('does not warn when detached mode is active and `openOnFocus` is true', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({ matches: true }),
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
      container,
      openOnFocus: true,
      getSources() {
        return [createSource({})];
      },
    });

    expect(
      consoleWarn.mock.calls.some((call) =>
        String(call[0]).includes('openOnFocus: false` can lead to')
      )
    ).toBe(false);

    consoleWarn.mockRestore();
  });

  test('does not warn when `openOnFocus` is false but detached mode is not active', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({ matches: false }),
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
      container,
      openOnFocus: false,
      getSources() {
        return [createSource({})];
      },
    });

    expect(
      consoleWarn.mock.calls.some((call) =>
        String(call[0]).includes('openOnFocus: false` can lead to')
      )
    ).toBe(false);

    consoleWarn.mockRestore();
  });

  test('warns when transitioning into detached mode via resize with `openOnFocus` false', () => {
    jest.useFakeTimers();
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

    let matches = false;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn((query) => ({
        get matches() {
          return matches;
        },
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    autocomplete<{ label: string }>({
      id: 'autocomplete',
      detachedMediaQuery: '',
      container,
      openOnFocus: false,
      getSources() {
        return [createSource({})];
      },
    });

    // No warning yet: the instance started out non-detached.
    expect(
      consoleWarn.mock.calls.some((call) =>
        String(call[0]).includes('openOnFocus: false` can lead to')
      )
    ).toBe(false);

    // Simulate the viewport crossing into the detached media query, then
    // let the debounced resize handler (20ms) run.
    matches = true;
    window.dispatchEvent(new Event('resize'));
    jest.advanceTimersByTime(20);

    expect(
      consoleWarn.mock.calls.some((call) =>
        String(call[0]).includes(
          '`openOnFocus: false` can lead to unexpected behavior in detached mode'
        )
      )
    ).toBe(true);

    consoleWarn.mockRestore();
    jest.useRealTimers();
  });
});
