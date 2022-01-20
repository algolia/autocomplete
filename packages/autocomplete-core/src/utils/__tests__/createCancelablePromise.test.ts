import {
  cancelable,
  CancelablePromise,
  createCancelablePromise,
  isCancelablePromise,
} from '..';

const delay = async (timeout = 0, callback?: Function) => {
  await new Promise((resolve) => setTimeout(resolve, timeout));

  if (callback) {
    return await callback();
  }
};

describe('Fulfilled worflow', () => {
  const promises: (
    | [string, () => Promise<any>]
    | [string, () => CancelablePromise<any>]
  )[] = [
    [
      'cancelable()',
      () =>
        cancelable<void>(
          new Promise((resolve) => {
            delay(1, resolve);
          })
        ),
    ],
    [
      'createCancelablePromise',
      () =>
        createCancelablePromise((resolve) => {
          delay(1, resolve);
        }),
    ],
    [
      'new Promise()',
      () =>
        new Promise((resolve) => {
          delay(1, resolve);
        }),
    ],
  ];

  const expectResolveWorkflow = async (
    promise1: Promise<any> | CancelablePromise<any>
  ) => {
    const callback = jest.fn();
    const promise2 = promise1.then(callback);
    const promise3 = promise1.then(() => {
      callback();
      return delay(1);
    });
    const promise4 = promise2.then(callback);
    const promise5 = promise3.then(() => {
      callback();
      return delay(1);
    });
    const promise6 = promise5.then().then(callback);
    const promise7 = promise6.finally(callback);
    await Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
      promise5,
      promise6,
      promise7,
    ]);
    expect(callback).toHaveBeenCalledTimes(6);
  };

  for (const [label, createPromise] of promises) {
    it(label, async () => {
      await expectResolveWorkflow(createPromise());
    });
  }
});

describe('Rejected worflow', () => {
  const promises: (
    | [string, () => Promise<any>]
    | [string, () => CancelablePromise<any>]
  )[] = [
    [
      'cancelable()',
      () =>
        cancelable<any>(
          new Promise((resolve, reject) => {
            delay(1, () => reject(new Error('native promise error')));
          })
        ),
    ],
    [
      'createCancelablePromise',
      () =>
        createCancelablePromise<any>((resolve, reject) => {
          delay(1, () => reject(new Error('cancelable promise error')));
        }),
    ],
    [
      'new Promise()',
      () =>
        new Promise((resolve, reject) => {
          delay(1, () => reject(new Error('native promise error')));
        }),
    ],
  ];

  const expectErrorWorkflow = async (
    promise1: Promise<any> | CancelablePromise<any>
  ) => {
    const callback = jest.fn();
    const promise2 = promise1.then(callback).catch(() => callback(1));
    const promise3 = promise1.then(callback, () => callback(2));
    const promise4 = promise3.then(() => {
      callback(3);
      return delay(1, () => Promise.reject(new Error('internal error')));
    });
    const promise5 = promise4.catch(() => callback(4));
    const promise6 = promise4.then(callback, () => callback(5));
    const promise7 = promise6.finally(() => callback(6));
    await Promise.all([promise2, promise3, promise5, promise6, promise7]);
    expect(callback).toHaveBeenCalledTimes(6);
    expect(callback).toHaveBeenCalledWith(1);
    expect(callback).toHaveBeenCalledWith(2);
    expect(callback).toHaveBeenCalledWith(3);
    expect(callback).toHaveBeenCalledWith(4);
    expect(callback).toHaveBeenCalledWith(5);
    expect(callback).toHaveBeenCalledWith(6);
  };

  for (const [label, createPromise] of promises) {
    it(label, async () => {
      await expectErrorWorkflow(createPromise());
    });
  }
});

test('Cancel root promise', async () => {
  const callback = jest.fn();
  const promise1 = cancelable(
    new Promise((resolve) => {
      delay(1, resolve);
    })
  );
  const promise2 = promise1.then(callback);
  promise1.then(callback).then(callback);
  promise2.then(callback);
  expect(promise1.isCanceled()).toBe(false);
  promise1.cancel();
  expect(promise1.isCanceled()).toBe(true);
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(0);
});

test('Cancel a returned promise', async () => {
  const callback = jest.fn();
  const promise1 = cancelable(
    new Promise((resolve) => {
      delay(1, resolve);
    })
  );
  const promise2 = promise1.then(callback);
  promise1.then(callback).then(callback);
  promise2.then(callback);
  expect(promise2.isCanceled()).toBe(false);
  promise2.cancel();
  expect(promise2.isCanceled()).toBe(true);
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(0);
});

test('Cancel a rejected promise', async () => {
  const callback = jest.fn();
  const promise1 = cancelable(
    new Promise((resolve, reject) => {
      reject();
    })
  );
  promise1.cancel();
  const promise2 = promise1.catch(callback);
  promise1.then(callback, callback).then(callback);
  promise2.then(callback);
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(0);
});

test('Cancel a promise but finally should not be still executed', async () => {
  const callback = jest.fn();
  const promise = cancelable(
    new Promise((resolve) => {
      delay(5, resolve);
    })
  ).finally(callback);
  promise.cancel();
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(0);
});

test('Cancel a promise but finally should be still executed', async () => {
  const callback = jest.fn();
  const promise = cancelable(
    new Promise((resolve) => {
      delay(5, resolve);
    })
  ).finally(callback, true);
  promise.cancel();
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('Cancel a promise but finally should not be executed twice #1', async () => {
  const callback = jest.fn();
  const promise = cancelable(
    new Promise<void>((resolve) => {
      resolve();
    })
  ).finally(callback, true);
  await promise;
  expect(callback).toHaveBeenCalledTimes(1);
  promise.cancel();
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('Cancel a promise but finally should not be executed twice #2', async () => {
  const callback = jest.fn();
  const promise = cancelable(
    new Promise<void>((resolve) => {
      delay(10, resolve);
    })
  ).finally(callback, true);
  await delay(5);
  promise.cancel();
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('On cancel callbacks should executed in the correct order', async () => {
  const callback = jest.fn();
  const p1 = cancelable(Promise.resolve(callback('resolve p1')));
  p1.then(() => {
    return createCancelablePromise((resolve, reject, onCancel) => {
      delay(10, resolve);
      onCancel(() => {
        callback('cancel p2');
      });
    }).finally(() => {
      callback('finally p2');
    }, true);
  });
  p1.then(() => {
    return createCancelablePromise((resolve, reject, onCancel) => {
      delay(10, resolve);
      onCancel(() => {
        callback('cancel p3');
      });
    }).finally(() => {
      callback('finally p3');
    }, true);
  });
  await delay(5);
  p1.cancel();
  await delay(10);
  expect(callback.mock.calls).toEqual([
    ['resolve p1'],
    ['cancel p2'],
    ['finally p2'],
    ['cancel p3'],
    ['finally p3'],
  ]);
});

test('createCancelablePromise.resolve()', async () => {
  const callback = jest.fn();
  await new Promise<string>((resolve) =>
    resolve(createCancelablePromise.resolve('ok'))
  ).then(callback);
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('ok');
});

test('createCancelablePromise.reject()', async () => {
  const callback = jest.fn();
  await new Promise<string>((resolve) =>
    resolve(createCancelablePromise.reject('ko'))
  ).catch(callback);
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('ko');
});

describe('Cancelable promises returned by executors', () => {
  async function worflow({
    withClass,
    withFail,
    withCatch,
  }: {
    withClass?: boolean;
    withFail?: boolean;
    withCatch?: boolean;
  }) {
    const callback = jest.fn();
    let promise1: CancelablePromise<void>;

    if (withClass) {
      promise1 = createCancelablePromise<void>((resolve, reject, onCancel) => {
        callback('start p1');
        const timer = setTimeout(() => {
          callback('resolve p1');
          if (withFail) {
            reject();
          } else {
            resolve();
          }
        }, 5);
        const abort = () => {
          callback('abort p1');
          clearTimeout(timer);
        };
        onCancel(abort);
      });
    } else {
      promise1 = cancelable(
        new Promise<void>((resolve, reject) => {
          callback('start p1');
          delay(5, () => {
            callback('resolve p1');
            if (withFail) {
              reject();
            } else {
              resolve();
            }
          });
        })
      );
    }

    let promise2 = promise1.then(
      ...([
        () => {
          callback('then p2');
          const promise3 = createCancelablePromise<void>(
            (resolve, reject, onCancel) => {
              callback('start p3');
              const timer = setTimeout(() => {
                callback('resolve p3');
                resolve();
              }, 10);
              const abort = () => {
                callback('abort p3');
                clearTimeout(timer);
              };
              onCancel(abort);
            }
          );
          return promise3;
        },
        !withCatch &&
          (() => {
            callback('error p2');
            const promise3 = createCancelablePromise<void>(
              (resolve, reject, onCancel) => {
                callback('start p3');
                const timer = setTimeout(() => {
                  callback('resolve p3');
                  resolve();
                }, 10);
                const abort = () => {
                  callback('abort p3');
                  clearTimeout(timer);
                };
                onCancel(abort);
              }
            );
            return promise3;
          }),
      ].filter(Boolean) as [() => CancelablePromise<void>])
    );

    if (withCatch) {
      promise2 = promise2.catch(() => {
        callback('catch p2');
        const promise3 = createCancelablePromise<void>(
          (resolve, reject, onCancel) => {
            callback('start p3');
            const timer = setTimeout(() => {
              callback('resolve p3');
              resolve();
            }, 10);
            const abort = () => {
              callback('abort p3');
              clearTimeout(timer);
            };
            onCancel(abort);
          }
        );
        return promise3;
      });
    }

    promise2.then(() => {
      callback('then done');
    });

    await delay(10, () => {
      callback('cancel p2');
      promise2.cancel();
    });
    await delay(20);
    return callback;
  }

  it('should be canceled when fulfilled (with CancelablePromise)', async () => {
    const callback = await worflow({ withClass: true, withFail: false });
    expect(callback.mock.calls).toEqual([
      ['start p1'],
      ['resolve p1'],
      ['then p2'],
      ['start p3'],
      ['cancel p2'],
      ['abort p1'],
      ['abort p3'],
    ]);
  });

  it('should be canceled when rejected (with CancelablePromise)', async () => {
    const callback = await worflow({
      withClass: true,
      withFail: true,
      withCatch: false,
    });
    expect(callback.mock.calls).toEqual([
      ['start p1'],
      ['resolve p1'],
      ['error p2'],
      ['start p3'],
      ['cancel p2'],
      ['abort p1'],
      ['abort p3'],
    ]);
  });

  it('should be canceled when rejected and caught (with CancelablePromise)', async () => {
    const callback = await worflow({
      withClass: true,
      withFail: true,
      withCatch: true,
    });
    expect(callback.mock.calls).toEqual([
      ['start p1'],
      ['resolve p1'],
      ['catch p2'],
      ['start p3'],
      ['cancel p2'],
      ['abort p1'],
      ['abort p3'],
    ]);
  });

  it('should be canceled when fulfilled (with cancelable)', async () => {
    const callback = await worflow({ withClass: false, withFail: false });
    expect(callback.mock.calls).toEqual([
      ['start p1'],
      ['resolve p1'],
      ['then p2'],
      ['start p3'],
      ['cancel p2'],
      ['abort p3'],
    ]);
  });

  it('should be canceled when rejected (with cancelable)', async () => {
    const callback = await worflow({
      withClass: false,
      withFail: true,
      withCatch: false,
    });
    expect(callback.mock.calls).toEqual([
      ['start p1'],
      ['resolve p1'],
      ['error p2'],
      ['start p3'],
      ['cancel p2'],
      ['abort p3'],
    ]);
  });

  it('should be canceled when rejected and caught (with cancelable)', async () => {
    const callback = await worflow({
      withClass: false,
      withFail: true,
      withCatch: true,
    });
    expect(callback.mock.calls).toEqual([
      ['start p1'],
      ['resolve p1'],
      ['catch p2'],
      ['start p3'],
      ['cancel p2'],
      ['abort p3'],
    ]);
  });

  it('should cancel promises deeply', async () => {
    const callback = jest.fn();
    const promise1 = cancelable(
      new Promise((resolve) => {
        setTimeout(resolve, 1);
      })
    ).then(() => {
      return createCancelablePromise((resolve) => {
        setTimeout(resolve, 1);
      }).then(() => {
        return cancelable(
          new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1);
          })
        ).then(() => {
          return createCancelablePromise<void>((resolve, reject, onCancel) => {
            const timer = setTimeout(() => {
              callback('it should not resolve');
              resolve();
            }, 10);
            onCancel(() => {
              clearTimeout(timer);
            });
          }).then(() => {
            return cancelable(
              new Promise<void>((resolve) => {
                setTimeout(() => {
                  callback('it should not resolve');
                  resolve();
                }, 0);
              })
            );
          });
        });
      });
    });
    await delay(5);
    promise1.cancel();
    await delay(20);
    expect(callback).not.toHaveBeenCalled();
  });
});

for (const [label, isCancelable] of [
  ['isCancelablePromise', isCancelablePromise],
  [
    'createCancelablePromise.isCancelable',
    createCancelablePromise.isCancelable,
  ],
] as [string, typeof isCancelablePromise][]) {
  describe(label, () => {
    it('should be cancelable', () => {
      const p1 = cancelable(new Promise(() => {}));
      const p2 = createCancelablePromise(() => {});
      expect(isCancelable(p1)).toBe(true);
      expect(isCancelable(p2)).toBe(true);
      expect(isCancelable(p1.then(() => {}))).toBe(true);
      expect(isCancelable(p2.then(() => {}))).toBe(true);
      expect(isCancelable(p1.catch(() => {}))).toBe(true);
      expect(isCancelable(p2.catch(() => {}))).toBe(true);
    });

    it('should not be cancelable', () => {
      expect(isCancelable(new Promise(() => {}))).toBe(false);
      expect(isCancelable(undefined)).toBe(false);
      expect(isCancelable(null)).toBe(false);
      expect(isCancelable({})).toBe(false);
    });
  });
}
