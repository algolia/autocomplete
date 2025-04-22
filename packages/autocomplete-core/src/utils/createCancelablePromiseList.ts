import { CancelablePromise } from '.';

export type CancelablePromiseList<TValue> = {
  /**
   * Add a cancelable promise to the list.
   *
   * @param cancelablePromise The cancelable promise to add.
   */
  add(cancelablePromise: CancelablePromise<TValue>): CancelablePromise<TValue>;
  /**
   * Cancel all pending promises.
   *
   * Requests aren't actually stopped. All pending promises will settle, but
   * attached handlers won't run.
   */
  cancelAll(): void;
  /**
   * Whether there are pending promises in the list.
   */
  isEmpty(): boolean;
  /**
   * Waits for all pending promises to be resolved.
   *
   * @param timeout Maximum amount of time allowed to wait for pending promises. Returns early if this time is reached.
   */
  wait(timeout?: number): Promise<void>;
};

// Ensures multiple callers sync to the same promise.
let _hasWaitPromiseResolved = true;
let _waitPromise: Promise<any>;

export function createCancelablePromiseList<
  TValue
>(): CancelablePromiseList<TValue> {
  let list: Array<CancelablePromise<TValue>> = [];

  return {
    add(cancelablePromise) {
      list.push(cancelablePromise);

      return cancelablePromise.finally(() => {
        list = list.filter((item) => item !== cancelablePromise);
      });
    },
    cancelAll() {
      list.forEach((promise) => promise.cancel());
    },
    isEmpty() {
      return list.length === 0;
    },
    wait(timeout) {
      // Reuse promise if already exists. Keeps multiple callers subscribed to the same promise.
      if (!_hasWaitPromiseResolved) {
        return _waitPromise;
      }

      // Creates a promise which either resolves after all pending requests complete
      // or the timeout is reached (if provided). Whichever comes first.
      _hasWaitPromiseResolved = false;
      _waitPromise = !timeout
        ? Promise.all(list)
        : Promise.race([
            Promise.all(list),
            new Promise<void>((resolve) => setTimeout(resolve, timeout)),
          ]);

      return _waitPromise.then(() => {
        _hasWaitPromiseResolved = true;
      });
    },
  };
}
