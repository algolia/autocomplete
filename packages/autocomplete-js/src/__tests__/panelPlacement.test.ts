import { waitFor } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';

// Arbitrary values to mock `getBoundingClientRect`, `offsetTop` and `clientWidth`
// (by default jest mock everything to 0 but we cannot properly check the calculations if everything is set to 0)
const OFFSET_TOP = 2;
const CLIENT_WIDTH = 3;
const BOTTOM = 5;
const HEIGHT = 7;
const LEFT = 11;
const RIGHT = 13;
const TOP = 17;
const WIDTH = 19;

describe('panelPlacement', () => {
  let container: HTMLDivElement;
  const mockedGetBoundingClientRect = (): DOMRect => ({
    bottom: BOTTOM,
    height: HEIGHT,
    left: LEFT,
    right: RIGHT,
    top: TOP,
    width: WIDTH,
    x: 0,
    y: 0,
    toJSON: () => {},
  });

  beforeAll(() => {
    Object.defineProperty(window.HTMLElement.prototype, 'offsetTop', {
      get() {
        return OFFSET_TOP;
      },
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      get() {
        return CLIENT_WIDTH;
      },
    });
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  afterAll(() => {
    Object.defineProperty(window.HTMLElement.prototype, 'offsetTop', {
      get() {
        return 0;
      },
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      get() {
        return 0;
      },
    });
  });

  describe('with `input-wrapper-width` value', () => {
    test('places the panel bellow the input and takes the input width', async () => {
      autocomplete({
        container,
        panelPlacement: 'input-wrapper-width',
        initialState: {
          isOpen: true,
        },
      });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector(
        '.aa-Form'
      ).getBoundingClientRect = mockedGetBoundingClientRect;
      document.querySelector(
        '.aa-Autocomplete'
      ).getBoundingClientRect = mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '9px', // OFFSET_TOP + HEIGHT
          left: '11px', // LEFT
          right: '-27px', // CLIENT_WIDTH - (LEFT + WIDTH)
          width: 'unset',
          'max-width': 'unset',
        });
      });
    });
  });

  describe('with `start` value', () => {
    test('places the panel bellow the input and align it with the input left side', async () => {
      autocomplete({
        container,
        panelPlacement: 'start',
        initialState: {
          isOpen: true,
        },
      });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector(
        '.aa-Form'
      ).getBoundingClientRect = mockedGetBoundingClientRect;
      document.querySelector(
        '.aa-Autocomplete'
      ).getBoundingClientRect = mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '9px', // OFFSET_TOP + HEIGHT
          left: '11px', // LEFT
        });
      });
    });
  });

  describe('with `end` value', () => {
    test('places the panel bellow the input and align it with the input right side', async () => {
      autocomplete({
        container,
        panelPlacement: 'end',
        initialState: {
          isOpen: true,
        },
      });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector(
        '.aa-Form'
      ).getBoundingClientRect = mockedGetBoundingClientRect;
      document.querySelector(
        '.aa-Autocomplete'
      ).getBoundingClientRect = mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '9px', // OFFSET_TOP + HEIGHT
          right: '-27px', // CLIENT_WIDTH - (LEFT + WIDTH)
        });
      });
    });
  });

  describe('with `full-width` value', () => {
    test('places the panel bellow the input and takes the full page width', async () => {
      autocomplete({
        container,
        panelPlacement: 'full-width',
        initialState: {
          isOpen: true,
        },
      });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector(
        '.aa-Form'
      ).getBoundingClientRect = mockedGetBoundingClientRect;
      document.querySelector(
        '.aa-Autocomplete'
      ).getBoundingClientRect = mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '9px', // OFFSET_TOP + HEIGHT
          left: 0,
          right: 0,
          width: 'unset',
          'max-width': 'unset',
        });
      });
    });
  });

  test('behaves like `input-wrapper-width` if no value is set', async () => {
    autocomplete({
      container,
      initialState: {
        isOpen: true,
      },
    });

    // Mock `getBoundingClientRect` for elements used in the panel placement calculation
    document.querySelector(
      '.aa-Form'
    ).getBoundingClientRect = mockedGetBoundingClientRect;
    document.querySelector(
      '.aa-Autocomplete'
    ).getBoundingClientRect = mockedGetBoundingClientRect;

    await waitFor(() => {
      expect(document.querySelector('.aa-Panel')).toHaveStyle({
        top: '9px', // OFFSET_TOP + HEIGHT
        left: '11px', // LEFT
        right: '-27px', // CLIENT_WIDTH - (LEFT + WIDTH)
        width: 'unset',
        'max-width': 'unset',
      });
    });
  });

  // eslint-disable-next-line jest/no-done-callback
  test('throws an error if an invalid value is used', async (done) => {
    window.addEventListener(
      'error',
      (error) => {
        error.preventDefault();
        expect(error.message).toEqual(
          'The `panelPlacement` value "invalid" is not valid.'
        );
        done();
      },
      { once: true }
    );

    autocomplete({
      container,
      // @ts-expect-error
      panelPlacement: 'invalid',
      initialState: {
        isOpen: true,
      },
    });

    await waitFor(() => {
      expect(document.querySelector('.aa-Panel')).toHaveStyle({});
    });
  });
});
