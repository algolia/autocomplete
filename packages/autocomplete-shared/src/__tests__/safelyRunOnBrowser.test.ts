import { safelyRunOnBrowser } from '../safelyRunOnBrowser';

type CallbackReturn = {
  env: 'client' | 'server';
};

const CLIENT = 'client' as const;
const SERVER = 'server' as const;

describe('safelyRunOnBrowser', () => {
  const originalWindow = (global as any).window;

  afterEach(() => {
    (global as any).window = originalWindow;
  });

  test('runs callback on browsers', () => {
    const callback = jest.fn(() => ({ env: CLIENT }));

    const result = safelyRunOnBrowser<CallbackReturn>(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ window });
    expect(result).toEqual({ env: 'client' });
  });

  test('does not run fallback on browsers', () => {
    const callback = jest.fn(() => ({ env: CLIENT }));
    const fallback = jest.fn(() => ({ env: SERVER }));

    const result = safelyRunOnBrowser<CallbackReturn>(callback, { fallback });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ window });
    expect(fallback).toHaveBeenCalledTimes(0);
    expect(result).toEqual({ env: 'client' });
  });

  test('does not run callback on servers', () => {
    // @ts-expect-error
    delete global.window;

    const callback = jest.fn(() => ({ env: CLIENT }));

    const result = safelyRunOnBrowser<CallbackReturn>(callback);

    expect(callback).toHaveBeenCalledTimes(0);
    expect(result).toBeUndefined();
  });

  test('runs fallback on servers', () => {
    // @ts-expect-error
    delete global.window;

    const callback = jest.fn(() => ({ env: CLIENT }));
    const fallback = jest.fn(() => ({ env: SERVER }));

    const result = safelyRunOnBrowser<CallbackReturn>(callback, { fallback });

    expect(callback).toHaveBeenCalledTimes(0);
    expect(fallback).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ env: 'server' });
  });
});
