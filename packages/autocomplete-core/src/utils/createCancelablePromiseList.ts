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
  wait(timeout?: number): Promise<any>;
};

let _cancellableWaitPromise: Promise<any>;

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
      // Returns when resolving either the pending requests or the timeout (if exists).
      // Whichever comes first.
      _cancellableWaitPromise = !timeout
        ? Promise.all(list)
        : Promise.race([
            Promise.all(list),
            new Promise<void>((resolve) => setTimeout(resolve, timeout)),
          ]);

      return _cancellableWaitPromise;
    },
  };
}
