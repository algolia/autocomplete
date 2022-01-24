import { noop } from '@algolia/autocomplete-shared';

import { createCancelablePromise, createCancelablePromiseList } from '..';

describe('createCancelablePromiseList', () => {
  test('adds cancelable promises to the list', () => {
    const cancelablePromiseList = createCancelablePromiseList();
    const cancelablePromise = createCancelablePromise(noop);

    expect(cancelablePromiseList.isEmpty()).toBe(true);

    cancelablePromiseList.add(cancelablePromise);

    expect(cancelablePromiseList.isEmpty()).toBe(false);
  });
  test('removes the cancelable promise from the list when it resolves', async () => {
    const cancelablePromiseList = createCancelablePromiseList();
    const cancelablePromise = createCancelablePromise.resolve();

    cancelablePromiseList.add(cancelablePromise);

    expect(cancelablePromiseList.isEmpty()).toBe(false);

    await cancelablePromise;

    expect(cancelablePromiseList.isEmpty()).toBe(true);
  });
  test('removes the cancelable promise from the list when it rejects', async () => {
    const cancelablePromiseList = createCancelablePromiseList();
    const cancelablePromise = createCancelablePromise.reject();

    cancelablePromiseList.add(cancelablePromise);

    expect(cancelablePromiseList.isEmpty()).toBe(false);

    await cancelablePromise.catch(noop);

    expect(cancelablePromiseList.isEmpty()).toBe(true);
  });
  test('removes the cancelable promise from the list when it is canceled', () => {
    const cancelablePromiseList = createCancelablePromiseList();
    const cancelablePromise = createCancelablePromise.resolve();

    cancelablePromiseList.add(cancelablePromise);

    expect(cancelablePromiseList.isEmpty()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromiseList.isEmpty()).toBe(true);
  });
  test('empties the list when all promises are canceled', () => {
    const cancelablePromiseList = createCancelablePromiseList();
    const cancelablePromise = createCancelablePromise.resolve();

    cancelablePromiseList.add(cancelablePromise);

    expect(cancelablePromiseList.isEmpty()).toBe(false);

    cancelablePromiseList.cancelAll();

    expect(cancelablePromiseList.isEmpty()).toBe(true);
  });
});
