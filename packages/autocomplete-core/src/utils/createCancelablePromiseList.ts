import { noop } from '@algolia/autocomplete-shared';

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
   * Waits for the latest pending promise to settle (resolve, reject or be canceled).
   *
   * @param timeout Maximum amount of time allowed to wait for pending promises. Returns early if this time is reached.
   */
  wait(timeout?: number): Promise<void>;
};

export function createCancelablePromiseList<
  TValue
>(): CancelablePromiseList<TValue> {
  let list: Array<CancelablePromise<TValue>> = [];
  let latest: CancelablePromise<TValue> | undefined;

  return {
    add(cancelablePromise) {
      list.push(cancelablePromise);
      latest = cancelablePromise;

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
      // Older promises are superseded by the latest one and may never settle
      // (e.g., debounced sources). `finally` also runs when the promise rejects
      // or is canceled, so this always settles.
      const settled = new Promise<void>((resolve) => {
        if (latest && list.includes(latest)) {
          latest.finally(resolve).catch(noop);
        } else {
          resolve();
        }
      });

      // Creates a promise which either resolves after the latest pending request
      // settles or the timeout is reached (if provided). Whichever comes first.
      return !timeout
        ? settled
        : Promise.race([
            settled,
            new Promise<void>((resolve) => setTimeout(resolve, timeout)),
          ]);
    },
  };
}
