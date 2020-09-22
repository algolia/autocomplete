import { toWarn } from './matchers';

expect.extend({ toWarn });

global.console.warn = jest.fn();
global.console.log = jest.fn();
global.console.error = jest.fn();
global.console.info = jest.fn();
global.console.debug = jest.fn();
