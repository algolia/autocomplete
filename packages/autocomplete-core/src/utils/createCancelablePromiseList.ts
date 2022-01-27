import { CancelablePromise } from '.';

export type CancelablePromiseList<TValue> = {
  add(cancelablePromise: CancelablePromise<TValue>): CancelablePromise<TValue>;
  cancelAll(): void;
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
