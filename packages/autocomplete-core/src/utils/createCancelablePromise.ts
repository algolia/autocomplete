type CancelablePromiseState = {
  isCanceled: boolean;
  onCancelList: Array<(...args: any[]) => any>;
};

type PromiseExecutor<TValue> = (
  resolve: (value: TValue | PromiseLike<TValue>) => void,
  reject: (reason?: any) => void
) => void;

type CreateInternalCancelablePromiseParams<TValue> = {
  promise: Promise<TValue>;
  initialState: CancelablePromiseState;
};

function createInternalCancelablePromise<TValue>({
  initialState,
  promise,
}: CreateInternalCancelablePromiseParams<TValue>): CancelablePromise<TValue> {
  const state = initialState;

  return {
    then(onfulfilled, onrejected) {
      return createCancelable(
        promise.then(
          createCallback(onfulfilled, state, promise),
          createCallback(onrejected, state, promise)
        ),
        state
      );
    },
    catch(onrejected) {
      return createCancelable(
        promise.catch(createCallback(onrejected, state, promise)),
        state
      );
    },
    finally(onfinally) {
      if (onfinally) {
        state.onCancelList.push(onfinally);
      }

      return createCancelable<TValue>(
        promise.finally(
          createCallback(
            onfinally &&
              (() => {
                state.onCancelList = [];

                return onfinally();
              }),
            state,
            promise
          )
        ),
        state
      );
    },
    cancel() {
      state.isCanceled = true;
      const callbacks = state.onCancelList;
      state.onCancelList = [];

      callbacks.forEach((callback) => {
        callback();
      });
    },
    isCanceled() {
      return state.isCanceled === true;
    },
  };
}

export type CancelablePromise<TValue> = {
  then<TResultFulfilled = TValue, TResultRejected = never>(
    onfulfilled?:
      | ((
          value: TValue
        ) =>
          | TResultFulfilled
          | PromiseLike<TResultFulfilled>
          | CancelablePromise<TResultFulfilled>)
      | undefined
      | null,
    onrejected?:
      | ((
          reason: any
        ) =>
          | TResultRejected
          | PromiseLike<TResultRejected>
          | CancelablePromise<TResultRejected>)
      | undefined
      | null
  ): CancelablePromise<TResultFulfilled | TResultRejected>;
  catch<TResult = never>(
    onrejected?:
      | ((
          reason: any
        ) => TResult | PromiseLike<TResult> | CancelablePromise<TResult>)
      | undefined
      | null
  ): CancelablePromise<TValue | TResult>;
  finally(
    onfinally?: (() => void) | undefined | null
  ): CancelablePromise<TValue>;
  cancel(): void;
  isCanceled(): boolean;
};

export function createCancelablePromise<TValue>(
  executor: PromiseExecutor<TValue>
): CancelablePromise<TValue> {
  return createInternalCancelablePromise({
    initialState: createInitialState(),
    promise: new Promise<TValue>((resolve, reject) => {
      return executor(resolve, reject);
    }),
  });
}

createCancelablePromise.resolve = <TValue>(
  value?: TValue | PromiseLike<TValue> | CancelablePromise<TValue>
) => cancelable(Promise.resolve(value));

createCancelablePromise.reject = (reason?: any) =>
  cancelable(Promise.reject(reason));

export function cancelable<TValue>(promise: Promise<TValue>) {
  return createCancelable(promise);
}

function createCancelable<TValue>(
  promise: Promise<TValue>,
  initialState: CancelablePromiseState = createInitialState()
) {
  return createInternalCancelablePromise<TValue>({
    promise,
    initialState,
  });
}

function createCallback(
  onResult: ((...args: any[]) => any) | null | undefined,
  state: CancelablePromiseState,
  fallback: any
) {
  if (!onResult) {
    return fallback;
  }

  return function callback(arg?: any) {
    if (state.isCanceled) {
      return arg;
    }

    return onResult(arg);
  };
}

function createInitialState(): CancelablePromiseState {
  return { isCanceled: false, onCancelList: [] };
}
