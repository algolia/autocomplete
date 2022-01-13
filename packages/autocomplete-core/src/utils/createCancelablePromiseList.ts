import CancelablePromise from 'cancelable-promise';

export type CancelablePromiseQueue<TPromise = any> = {
  add(cancelablePromise: CancelablePromise<TPromise>): void;
  cancelAll(): void;
  isEmpty(): boolean;
};

export function createCancelablePromiseList<
  TPromise
>(): CancelablePromiseQueue<TPromise> {
  let list: Array<CancelablePromise<TPromise>> = [];

  function remove(cancelablePromise: CancelablePromise<TPromise>) {
    list = list.filter((promise) => promise !== cancelablePromise);
  }

  return {
    add(cancelablePromise) {
      list.push(cancelablePromise);

      cancelablePromise.finally(() => remove(cancelablePromise), true);
    },
    cancelAll() {
      list.forEach((promise) => promise.cancel());
    },
    isEmpty() {
      return list.length === 0;
    },
  };
}
