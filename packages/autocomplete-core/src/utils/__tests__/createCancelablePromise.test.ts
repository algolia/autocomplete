import { noop } from '@algolia/autocomplete-shared';

import { cancelable, createCancelablePromise } from '..';
import { runAllMicroTasks } from '../../../../../test/utils';

describe('createCancelablePromise', () => {
  test('returns an immediately resolved cancelable promise', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();

    await createCancelablePromise
      .resolve('ok')
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally);

    expect(onFulfilled).toHaveBeenCalledTimes(1);
    expect(onFulfilled).toHaveBeenCalledWith('ok');
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('returns an immediately rejected cancelable promise', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();

    await createCancelablePromise
      .reject(new Error())
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally);

    expect(onRejected).toHaveBeenCalledTimes(1);
    expect(onRejected).toHaveBeenCalledWith(new Error());
    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('triggers callbacks when the cancelable promise resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();

    await createCancelablePromise((resolve) => {
      resolve('ok');
    })
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally);

    expect(onFulfilled).toHaveBeenCalledTimes(1);
    expect(onFulfilled).toHaveBeenCalledWith('ok');
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('triggers callbacks when the cancelable promise rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();

    await createCancelablePromise((_, reject) => {
      reject(new Error());
    })
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally);

    expect(onRejected).toHaveBeenCalledTimes(1);
    expect(onRejected).toHaveBeenCalledWith(new Error());
    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('does not trigger callbacks when the cancelable promise is canceled then resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = createCancelablePromise((resolve) => {
      resolve('ok');
    });

    cancelablePromise.then(onFulfilled).catch(onRejected).finally(onFinally);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });

  test('triggers `finally` handler with `runWhenCanceled=true` when the cancelable promise is canceled then resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = createCancelablePromise((resolve) => {
      resolve('ok');
    });

    cancelablePromise
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally, true);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('does not trigger `finally` handler with `runWhenCanceled=false` when the cancelable promise is canceled then resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = createCancelablePromise((resolve) => {
      resolve('ok');
    });

    cancelablePromise
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally, false);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });

  test('only triggers `finally` handler once when the cancelable promise is canceled then resolves', async () => {
    const onFulfilled = jest.fn();
    const cancelablePromise = createCancelablePromise((resolve) => {
      resolve('ok');
    }).finally(onFulfilled, true);

    await cancelablePromise;

    expect(onFulfilled).toHaveBeenCalledTimes(1);

    cancelablePromise.cancel();

    await runAllMicroTasks();

    expect(onFulfilled).toHaveBeenCalledTimes(1);
  });

  test('does not trigger callbacks when the cancelable promise is canceled then rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = createCancelablePromise((_, reject) => {
      reject(new Error());
    });

    cancelablePromise.then(onFulfilled).catch(onRejected).finally(onFinally);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });

  test('triggers `finally` handler with `runWhenCanceled=true` when the cancelable promise is canceled then rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = createCancelablePromise((_, reject) => {
      reject(new Error());
    });

    cancelablePromise
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally, true);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('does not trigger `finally` handler with `runWhenCanceled=false` when the cancelable promise is canceled then rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = createCancelablePromise((_, reject) => {
      reject(new Error());
    });

    cancelablePromise
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally, false);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });

  test('only triggers `finally` handler once when the cancelable promise is canceled then rejects', async () => {
    const onFulfilled = jest.fn();
    const cancelablePromise = createCancelablePromise((_, reject) => {
      reject(new Error());
    }).finally(onFulfilled, true);

    await cancelablePromise.catch(noop);

    expect(onFulfilled).toHaveBeenCalledTimes(1);

    cancelablePromise.cancel();

    await runAllMicroTasks();

    expect(onFulfilled).toHaveBeenCalledTimes(1);
  });

  test('cancels nested cancelable promises', async () => {
    const onFulfilled = jest.fn();
    const cancelablePromise = createCancelablePromise((resolve) => {
      resolve('ok');
    }).then(() =>
      createCancelablePromise((resolve) => {
        resolve('ok');
        onFulfilled();
      })
    );

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
  });
});

describe('cancelable', () => {
  test('triggers callbacks when the cancelable promise resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();

    await cancelable(
      new Promise((resolve) => {
        resolve('ok');
      })
    )
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally);

    expect(onFulfilled).toHaveBeenCalledTimes(1);
    expect(onFulfilled).toHaveBeenCalledWith('ok');
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('triggers callbacks when the cancelable promise rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();

    await cancelable(
      new Promise((_, reject) => {
        reject(new Error());
      })
    )
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally);

    expect(onRejected).toHaveBeenCalledTimes(1);
    expect(onRejected).toHaveBeenCalledWith(new Error());
    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('does not trigger callbacks when the cancelable promise is canceled then resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((resolve) => {
        resolve('ok');
      })
    );

    cancelablePromise.then(onFulfilled).catch(onRejected).finally(onFinally);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });

  test('triggers `finally` handler with `runWhenCanceled=true` when the cancelable promise is canceled then resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((resolve) => {
        resolve('ok');
      })
    );

    cancelablePromise
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally, true);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('does not trigger `finally` handler with `runWhenCanceled=false` when the cancelable promise is canceled then resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((resolve) => {
        resolve('ok');
      })
    );

    cancelablePromise
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally, false);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });

  test('only triggers `finally` handler once when the cancelable promise is canceled then resolves', async () => {
    const onFulfilled = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((resolve) => {
        resolve('ok');
      })
    ).finally(onFulfilled, true);

    await cancelablePromise;

    expect(onFulfilled).toHaveBeenCalledTimes(1);

    cancelablePromise.cancel();

    await runAllMicroTasks();

    expect(onFulfilled).toHaveBeenCalledTimes(1);
  });

  test('does not trigger callbacks when the cancelable promise is canceled then rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((_, reject) => {
        reject(new Error());
      })
    );

    cancelablePromise.then(onFulfilled).catch(onRejected).finally(onFinally);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });

  test('triggers `finally` handler with `runWhenCanceled=true` when the cancelable promise is canceled then rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((_, reject) => {
        reject(new Error());
      })
    );

    cancelablePromise
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally, true);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
  });

  test('does not trigger `finally` handler with `runWhenCanceled=false` when the cancelable promise is canceled then rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((_, reject) => {
        reject(new Error());
      })
    );

    cancelablePromise
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally, false);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
  });

  test('only triggers `finally` handler once when the cancelable promise is canceled then rejects', async () => {
    const onFulfilled = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((_, reject) => {
        reject(new Error());
      })
    ).finally(onFulfilled, true);

    await cancelablePromise.catch(noop);

    expect(onFulfilled).toHaveBeenCalledTimes(1);

    cancelablePromise.cancel();

    await runAllMicroTasks();

    expect(onFulfilled).toHaveBeenCalledTimes(1);
  });

  test('cancels nested cancelable promises', async () => {
    const onFulfilled = jest.fn();

    const cancelablePromise = cancelable(
      new Promise((resolve) => {
        resolve('ok');
      })
    ).then(() =>
      cancelable(
        new Promise((resolve) => {
          resolve('ok');
          onFulfilled();
        })
      )
    );

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
  });
});
