import { createMatchMedia, createSource } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

describe('detachedMediaQuery', () => {
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
});
