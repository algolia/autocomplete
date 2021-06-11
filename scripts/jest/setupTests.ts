import { createMatchMedia } from '../../test/utils';

import { toWarnDev } from './matchers';

expect.extend({ toWarnDev });

global.console.warn = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: createMatchMedia({}),
});
