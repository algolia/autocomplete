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

    cancelablePromiseList.add(cancelablePromise).catch(noop);

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

  test('cancels all promises and empties the list', () => {
    const cancelablePromiseList = createCancelablePromiseList();
    const cancelablePromise1 = createCancelablePromise.resolve();
    const cancelablePromise2 = createCancelablePromise.reject();
    const cancelablePromise3 = createCancelablePromise(noop);

    cancelablePromiseList.add(cancelablePromise1).catch(noop);
    cancelablePromiseList.add(cancelablePromise2).catch(noop);
    cancelablePromiseList.add(cancelablePromise3).catch(noop);

    expect(cancelablePromise1.isCanceled()).toBe(false);
    expect(cancelablePromise2.isCanceled()).toBe(false);
    expect(cancelablePromise3.isCanceled()).toBe(false);
    expect(cancelablePromiseList.isEmpty()).toBe(false);

    cancelablePromiseList.cancelAll();

    expect(cancelablePromise1.isCanceled()).toBe(true);
    expect(cancelablePromise2.isCanceled()).toBe(true);
    expect(cancelablePromise3.isCanceled()).toBe(true);
    expect(cancelablePromiseList.isEmpty()).toBe(true);
  });
});
