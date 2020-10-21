import { toWarn } from './matchers';

expect.extend({ toWarn });

global.console.warn = jest.fn();
