import { MaybePromise } from '@algolia/autocomplete-shared';

/**
 * Creates a runner that executes promises in a concurrent-safe way.
 *
 * This is useful to prevent older promises to resolve after a newer promise,
 * otherwise resulting in stale resolved values.
 */
export function createConcurrentSafePromise() {
  let basePromiseId = -1;
  let latestResolvedId = -1;
  let latestResolvedValue: unknown = undefined;

  return function runConcurrentSafePromise<TValue>(
    promise: MaybePromise<TValue>
  ) {
    basePromiseId++;
    const currentPromiseId = basePromiseId;

    return Promise.resolve(promise).then((x) => {
      // The promise might take too long to resolve and get outdated. This would
      // result in resolving stale values.
      // When this happens, we ignore the promise value and return the one
      // coming from the latest resolved value.
      //
      // +----------------------------------+
      // |        100ms                     |
      // | run(1) +--->  R1                 |
      // |        300ms                     |
      // | run(2) +-------------> R2 (SKIP) |
      // |        200ms                     |
      // | run(3) +--------> R3             |
      // +----------------------------------+
      if (latestResolvedValue && currentPromiseId < latestResolvedId) {
        return latestResolvedValue as TValue;
      }

      latestResolvedId = currentPromiseId;
      latestResolvedValue = x;

      return x;
    });
  };
}
