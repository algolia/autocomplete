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
};

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
  };
}
