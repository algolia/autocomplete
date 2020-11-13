import { toWarnDev } from './matchers';

expect.extend({ toWarnDev });

global.console.warn = jest.fn();
