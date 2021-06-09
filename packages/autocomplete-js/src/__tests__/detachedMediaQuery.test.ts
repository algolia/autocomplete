import { autocomplete } from '../autocomplete';

describe('detachedMediaQuery', () => {
  const originalMatchMedia = window.matchMedia;
  const addEventListener = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener,
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  test('fallback to the deprecated `addListener` if `addEventListener` is undefined', () => {
    const addListener = jest.fn();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener,
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
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
            sourceId: 'testSource',
            getItems() {
              return [{ label: 'Item 1' }];
            },
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
    expect(addEventListener).not.toHaveBeenCalled();
  });
});
