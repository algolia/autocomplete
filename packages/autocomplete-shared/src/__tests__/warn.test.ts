/* eslint-disable no-console */

import { warn } from '../warn';

describe('warn', () => {
  if (__DEV__) {
    test('logs when the condition is unmet', () => {
      expect(() => {
        warn(false, 'warning');
      }).toWarnDev('[Autocomplete] warning');
    });

    test('does not log when the condition is met', () => {
      expect(() => {
        warn(true, 'warning');
      }).not.toWarnDev();
    });

    test('trims the message', () => {
      expect(() => {
        warn(false, '\nwarning! ');
      }).toWarnDev('[Autocomplete] warning!');
    });

    test('warns a message a single time', () => {
      const originalConsoleWarn = console.warn;
      console.warn = jest.fn();

      warn(false, 'warning1');
      warn(false, 'warning1');
      warn(false, 'warning2');

      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        '[Autocomplete] warning1'
      );
      expect(console.warn).toHaveBeenNthCalledWith(
        2,
        '[Autocomplete] warning2'
      );

      console.warn = originalConsoleWarn;
    });
  }
});
