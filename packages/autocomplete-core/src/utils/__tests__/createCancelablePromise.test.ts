import { noop } from '@algolia/autocomplete-shared';
import {
  cancelable,
  CancelablePromise,
  createCancelablePromise,
  isCancelablePromise,
} from '..';
import { defer, runAllMicroTasks } from '../../../../../test/utils';

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
    const onCancelSpy = jest.fn();

    await createCancelablePromise((resolve, _, onCancel) => {
      resolve('ok');
      onCancel(onCancelSpy);
    })
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally);

    expect(onFulfilled).toHaveBeenCalledTimes(1);
    expect(onFulfilled).toHaveBeenCalledWith('ok');
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
    expect(onCancelSpy).toHaveBeenCalledTimes(0);
  });

  test('triggers callbacks when the cancelable promise rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const onCancelSpy = jest.fn();

    await createCancelablePromise((_, reject, onCancel) => {
      reject(new Error());
      onCancel(onCancelSpy);
    })
      .then(onFulfilled)
      .catch(onRejected)
      .finally(onFinally);

    expect(onRejected).toHaveBeenCalledTimes(1);
    expect(onRejected).toHaveBeenCalledWith(new Error());
    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledWith();
    expect(onCancelSpy).toHaveBeenCalledTimes(0);
  });

  test('does not trigger callbacks when the cancelable promise is canceled and it resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const onCancelSpy = jest.fn();
    const cancelablePromise = createCancelablePromise(
      (resolve, _, onCancel) => {
        resolve('ok');
        onCancel(onCancelSpy);
      }
    );

    cancelablePromise.then(onFulfilled).catch(onRejected).finally(onFinally);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onCancelSpy).toHaveBeenCalledWith();
  });

  test('triggers `finally` handler callback with `runWhenCanceled=true` when the cancelable promise is canceled and it resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const onCancelSpy = jest.fn();
    const cancelablePromise = createCancelablePromise(
      (resolve, _, onCancel) => {
        resolve('ok');
        onCancel(onCancelSpy);
      }
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
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onCancelSpy).toHaveBeenCalledWith();
  });

  test('triggers `finally` handler callback with `runWhenCanceled=false` when the cancelable promise is canceled and it resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const onCancelSpy = jest.fn();
    const cancelablePromise = createCancelablePromise(
      (resolve, _, onCancel) => {
        resolve('ok');
        onCancel(onCancelSpy);
      }
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
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onCancelSpy).toHaveBeenCalledWith();
  });

  test('does not trigger callbacks when the cancelable promise is canceled and it rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const onCancelSpy = jest.fn();
    const cancelablePromise = createCancelablePromise((_, reject, onCancel) => {
      reject();
      onCancel(onCancelSpy);
    });

    cancelablePromise.then(onFulfilled).catch(onRejected).finally(onFinally);

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    expect(onFinally).not.toHaveBeenCalled();
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onCancelSpy).toHaveBeenCalledWith();
  });

  test('triggers `finally` handler callback with `runWhenCanceled=true` when the cancelable promise is canceled and it rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const onCancelSpy = jest.fn();
    const cancelablePromise = createCancelablePromise((_, reject, onCancel) => {
      reject();
      onCancel(onCancelSpy);
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
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onCancelSpy).toHaveBeenCalledWith();
  });

  test('triggers `finally` handler callback with `runWhenCanceled=false` when the cancelable promise is canceled and it resolves', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const onCancelSpy = jest.fn();
    const cancelablePromise = createCancelablePromise((_, reject, onCancel) => {
      reject();
      onCancel(onCancelSpy);
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
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onCancelSpy).toHaveBeenCalledWith();
  });

  test('deeply cancels nested cancelable promises', async () => {
    const onFulfilled = jest.fn();
    const onCancelSpy = jest.fn();

    const cancelablePromise = createCancelablePromise(
      (resolve, _, onCancel) => {
        resolve('ok');
        onCancel(onCancelSpy);
      }
    ).then(() =>
      createCancelablePromise((resolve) => {
        resolve('ok');
        onFulfilled();
      }).then(() =>
        createCancelablePromise((resolve) => {
          resolve('ok');
          onFulfilled();
        }).then(onFulfilled)
      )
    );

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
    expect(onCancelSpy).toHaveBeenCalledWith();
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

  test('does not trigger callbacks when the cancelable promise is canceled and it resolves', async () => {
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

  test('triggers `finally` handler callback with `runWhenCanceled=true` when the cancelable promise is canceled and it resolves', async () => {
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

  test('triggers `finally` handler callback with `runWhenCanceled=false` when the cancelable promise is canceled and it resolves', async () => {
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

  test('does not trigger callbacks when the cancelable promise is canceled and it rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((_, reject) => {
        reject();
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

  test('triggers `finally` handler callback with `runWhenCanceled=true` when the cancelable promise is canceled and it rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((_, reject) => {
        reject();
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

  test('triggers `finally` handler callback with `runWhenCanceled=false` when the cancelable promise is canceled and it rejects', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const onFinally = jest.fn();
    const cancelablePromise = cancelable(
      new Promise((_, reject) => {
        reject();
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

  test('deeply cancels nested cancelable promises', async () => {
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
      ).then(() =>
        cancelable(
          new Promise((resolve) => {
            resolve('ok');
            onFulfilled();
          })
        ).then(onFulfilled)
      )
    );

    expect(cancelablePromise.isCanceled()).toBe(false);

    cancelablePromise.cancel();

    expect(cancelablePromise.isCanceled()).toBe(true);

    await runAllMicroTasks();

    expect(onFulfilled).not.toHaveBeenCalled();
  });
});

describe('isCancelablePromise', () => {
  test('should be cancelable', () => {
    const p1 = cancelable(new Promise(noop));
    const p2 = createCancelablePromise(noop);

    expect(isCancelablePromise(p1)).toBe(true);
    expect(isCancelablePromise(p2)).toBe(true);
    expect(isCancelablePromise(p1.then(noop))).toBe(true);
    expect(isCancelablePromise(p2.then(noop))).toBe(true);
    expect(isCancelablePromise(p1.catch(noop))).toBe(true);
    expect(isCancelablePromise(p2.catch(noop))).toBe(true);
  });

  test('should not be cancelable', () => {
    expect(isCancelablePromise(new Promise(noop))).toBe(false);
    expect(isCancelablePromise(undefined)).toBe(false);
    expect(isCancelablePromise(null)).toBe(false);
  });
});
