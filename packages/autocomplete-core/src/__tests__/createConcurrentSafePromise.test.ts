import { createConcurrentSafePromise } from '../createConcurrentSafePromise';

function defer<TValue>(fn: () => TValue, timeout: number) {
  return new Promise<TValue>((resolve) => {
    setTimeout(() => resolve(fn()), timeout);
  });
}

describe('createConcurrentSafePromise', () => {
  test('resolves the value from the last call', async () => {
    type PromiseValue = { value: number };

    const runConcurrentSafePromise = createConcurrentSafePromise<
      PromiseValue
    >();
    const concurrentSafePromise1 = runConcurrentSafePromise(
      defer(() => ({ value: 1 }), 100)
    );
    const concurrentSafePromise2 = runConcurrentSafePromise(
      defer(() => ({ value: 2 }), 500)
    );
    const concurrentSafePromise3 = runConcurrentSafePromise(
      defer(() => ({ value: 3 }), 200)
    );

    jest.runAllTimers();

    expect(await concurrentSafePromise1).toEqual({
      value: 1,
    });
    // `concurrentSafePromise2` resolved after `concurrentSafePromise3`
    // and is now outdated, so the resolved value from `concurrentSafePromise3`
    // is returned.
    expect(await concurrentSafePromise2).toEqual({
      value: 3,
    });
    expect(await concurrentSafePromise3).toEqual({
      value: 3,
    });
  });
});
