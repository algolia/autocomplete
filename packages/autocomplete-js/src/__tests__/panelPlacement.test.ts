import { fireEvent, waitFor } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';

// Arbitrary values to mock `getBoundingClientRect` and `clientWidth`
// (by default jest mock everything to 0 but we cannot properly check the calculations if everything is set to 0)
const BOTTOM = 5;
const HEIGHT = 7;
const LEFT = 11;
const RIGHT = 13;
const TOP = 17;
const WIDTH = 19;
const SCROLL = 100;

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
    Object.defineProperty(document.documentElement, 'clientWidth', {
      get() {
        return 1920;
      },
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    fireEvent.scroll(document.body, { target: { scrollTop: 0 } });
  });

  afterAll(() => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      get() {
        return 0;
      },
    });
  });

  describe('with `input-wrapper-width` value', () => {
    test('places the panel below the input and takes the input width', async () => {
      autocomplete({
        container,
        panelPlacement: 'input-wrapper-width',
        initialState: {
          isOpen: true,
        },
      });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector('.aa-Form').getBoundingClientRect =
        mockedGetBoundingClientRect;
      document.querySelector('.aa-Autocomplete').getBoundingClientRect =
        mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '24px', // TOP + HEIGHT + SCROLL
          left: '11px', // LEFT
          right: '1890px', // CLIENT_WIDTH - (LEFT + WIDTH)
          width: 'unset',
          'max-width': 'unset',
        });
      });
    });

    test('keeps the panel positioned after scrolling', async () => {
      autocomplete({
        container,
        panelPlacement: 'input-wrapper-width',
        initialState: {
          isOpen: true,
        },
      });

      fireEvent.scroll(document.body, { target: { scrollTop: SCROLL } });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector('.aa-Form').getBoundingClientRect =
        mockedGetBoundingClientRect;
      document.querySelector('.aa-Autocomplete').getBoundingClientRect =
        mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '124px', // TOP + HEIGHT + SCROLL
          left: '11px', // LEFT
          right: '1890px', // CLIENT_WIDTH - (LEFT + WIDTH)
          width: 'unset',
          'max-width': 'unset',
        });
      });
    });
  });

  describe('with `start` value', () => {
    test('places the panel below the input and aligns it with the input left side', async () => {
      autocomplete({
        container,
        panelPlacement: 'start',
        initialState: {
          isOpen: true,
        },
      });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector('.aa-Form').getBoundingClientRect =
        mockedGetBoundingClientRect;
      document.querySelector('.aa-Autocomplete').getBoundingClientRect =
        mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '24px', // TOP + HEIGHT + SCROLL
          left: '11px', // LEFT
        });
      });
    });

    test('keeps the panel positioned after scrolling', async () => {
      autocomplete({
        container,
        panelPlacement: 'start',
        initialState: {
          isOpen: true,
        },
      });

      fireEvent.scroll(document.body, { target: { scrollTop: SCROLL } });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector('.aa-Form').getBoundingClientRect =
        mockedGetBoundingClientRect;
      document.querySelector('.aa-Autocomplete').getBoundingClientRect =
        mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '124px', // TOP + HEIGHT + SCROLL
          left: '11px', // LEFT
        });
      });
    });
  });

  describe('with `end` value', () => {
    test('places the panel below the input and aligns it with the input right side', async () => {
      autocomplete({
        container,
        panelPlacement: 'end',
        initialState: {
          isOpen: true,
        },
      });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector('.aa-Form').getBoundingClientRect =
        mockedGetBoundingClientRect;
      document.querySelector('.aa-Autocomplete').getBoundingClientRect =
        mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '24px', // TOP + HEIGHT + SCROLL
          right: '1890px', // CLIENT_WIDTH - (LEFT + WIDTH)
        });
      });
    });

    test('keeps the panel positioned after scrolling', async () => {
      autocomplete({
        container,
        panelPlacement: 'end',
        initialState: {
          isOpen: true,
        },
      });

      fireEvent.scroll(document.body, { target: { scrollTop: SCROLL } });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector('.aa-Form').getBoundingClientRect =
        mockedGetBoundingClientRect;
      document.querySelector('.aa-Autocomplete').getBoundingClientRect =
        mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '124px', // TOP + HEIGHT + SCROLL
          right: '1890px', // CLIENT_WIDTH - (LEFT + WIDTH)
        });
      });
    });
  });

  describe('with `full-width` value', () => {
    test('places the panel below the input and takes the full page width', async () => {
      autocomplete({
        container,
        panelPlacement: 'full-width',
        initialState: {
          isOpen: true,
        },
      });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector('.aa-Form').getBoundingClientRect =
        mockedGetBoundingClientRect;
      document.querySelector('.aa-Autocomplete').getBoundingClientRect =
        mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '24px', // TOP + HEIGHT + SCROLL
          left: 0,
          right: 0,
          width: 'unset',
          'max-width': 'unset',
        });
      });
    });

    test('keeps the panel positioned after scrolling', async () => {
      autocomplete({
        container,
        panelPlacement: 'full-width',
        initialState: {
          isOpen: true,
        },
      });

      fireEvent.scroll(document.body, { target: { scrollTop: SCROLL } });

      // Mock `getBoundingClientRect` for elements used in the panel placement calculation
      document.querySelector('.aa-Form').getBoundingClientRect =
        mockedGetBoundingClientRect;
      document.querySelector('.aa-Autocomplete').getBoundingClientRect =
        mockedGetBoundingClientRect;

      await waitFor(() => {
        expect(document.querySelector('.aa-Panel')).toHaveStyle({
          top: '124px', // TOP + HEIGHT + SCROLL
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
    document.querySelector('.aa-Form').getBoundingClientRect =
      mockedGetBoundingClientRect;
    document.querySelector('.aa-Autocomplete').getBoundingClientRect =
      mockedGetBoundingClientRect;

    await waitFor(() => {
      expect(document.querySelector('.aa-Panel')).toHaveStyle({
        top: '24px', // TOP + HEIGHT + SCROLL
        left: '11px', // LEFT
        right: '1890px', // CLIENT_WIDTH - (LEFT + WIDTH)
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
          '[Autocomplete] The `panelPlacement` value "invalid" is not valid.'
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

  test('default value keeps the panel positioned after scrolling', async () => {
    autocomplete({
      container,
      initialState: {
        isOpen: true,
      },
    });

    fireEvent.scroll(document.body, { target: { scrollTop: SCROLL } });

    // Mock `getBoundingClientRect` for elements used in the panel placement calculation
    document.querySelector('.aa-Form').getBoundingClientRect =
      mockedGetBoundingClientRect;
    document.querySelector('.aa-Autocomplete').getBoundingClientRect =
      mockedGetBoundingClientRect;

    await waitFor(() => {
      expect(document.querySelector('.aa-Panel')).toHaveStyle({
        top: '124px', // TOP + HEIGHT + SCROLL
        left: '11px', // LEFT
        right: '1890px', // CLIENT_WIDTH - (LEFT + WIDTH)
        width: 'unset',
        'max-width': 'unset',
      });
    });
  });
});
