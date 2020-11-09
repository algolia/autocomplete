/* eslint-disable @typescript-eslint/generic-type-naming */

declare namespace jest {
  interface Matchers<R> {
    /**
     * Ensures that a warning is triggered when the callback is called.
     */
    toWarnDev(expectedMessage?: string): CustomMatcherResult;
  }
}
