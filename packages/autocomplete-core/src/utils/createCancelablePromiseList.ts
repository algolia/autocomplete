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

  return {
    add(cancelablePromise) {
      list.push(cancelablePromise);

      cancelablePromise.catch(noop).finally(() => {
        list = list.filter((item) => item !== cancelablePromise);
      }, true);
    },
    cancelAll() {
      list.forEach((promise) => promise.cancel());
    },
    isEmpty() {
      return list.length === 0;
    },
  };
}
