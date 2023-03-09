import { safelyRunOnBrowser } from '../safelyRunOnBrowser';

describe('safelyRunOnBrowser', () => {
  const originalWindow = (global as any).window;

  afterEach(() => {
    (global as any).window = originalWindow;
  });

  test('runs callback on browsers', () => {
    const callback = jest.fn(() => ({ env: 'client' }));

    const result = safelyRunOnBrowser(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ window });
    expect(result).toEqual({ env: 'client' });
  });

  test('does not run callback on servers', () => {
    // @ts-expect-error
    delete global.window;

    const callback = jest.fn(() => ({ env: 'client' }));

    const result = safelyRunOnBrowser(callback);

    expect(callback).toHaveBeenCalledTimes(0);
    expect(result).toBeUndefined();
  });
});
