import { noop } from '@algolia/autocomplete-shared';

import { CancelablePromise } from '.';

export type CancelablePromiseList<TValue> = {
  add(cancelablePromise: CancelablePromise<TValue>): void;
  cancelAll(): void;
  isEmpty(): boolean;
};

export function createCancelablePromiseList<
  TValue
>(): CancelablePromiseList<TValue> {
  let list: Array<CancelablePromise<TValue>> = [];

  function remove(cancelablePromise: CancelablePromise<TValue>) {
    list = list.filter((item) => item !== cancelablePromise);
  }

  return {
    add(cancelablePromise) {
      list.push(cancelablePromise);

      cancelablePromise
        .catch(noop)
        .finally(() => remove(cancelablePromise), true);
    },
    cancelAll() {
      list.forEach((promise) => promise.cancel());
    },
    isEmpty() {
      return list.length === 0;
    },
  };
}
