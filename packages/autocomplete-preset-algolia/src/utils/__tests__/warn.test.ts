/* eslint-disable no-console */

import { warn } from '../warn';

describe('warn', () => {
  test('trims the message', () => {
    expect(() => {
      warn('\nwarning! ');
    }).toWarn('warning!');
  });

  test('warns a message a single time', () => {
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();

    warn('warning1');
    warn('warning1');
    warn('warning2');

    expect(console.warn).toHaveBeenCalledTimes(2);
    expect(console.warn).toHaveBeenNthCalledWith(1, 'warning1');
    expect(console.warn).toHaveBeenNthCalledWith(2, 'warning2');

    console.warn = originalConsoleWarn;
  });
});
