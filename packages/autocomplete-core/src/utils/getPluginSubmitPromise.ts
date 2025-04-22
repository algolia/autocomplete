import type { InternalAutocompleteOptions } from '../types';

import { CancelablePromiseList } from './createCancelablePromiseList';

/**
 * If a plugin is configured to await a submit event, this returns a promise
 * for either the max timeout value found or until it completes.
 * Otherwise, return undefined.
 */
export const getPluginSubmitPromise = (
  plugins: InternalAutocompleteOptions<any>['plugins'],
  pendingRequests: CancelablePromiseList<void>
): Promise<void> | undefined => {
  let waitUntilComplete = false;
  const timeouts: number[] = [];

  for (const plugin of plugins) {
    const value: boolean | number | undefined =
      plugin.__autocomplete_pluginOptions?.awaitSubmit?.();
    if (typeof value === 'number') {
      timeouts.push(value);
    } else if (value === true) {
      waitUntilComplete = true;
      break; // break loop as bool overrides num array below
    }
  }

  if (waitUntilComplete) {
    return pendingRequests.wait();
  } else if (timeouts.length > 0) {
    return pendingRequests.wait(Math.max(...timeouts));
  }

  return undefined;
};
