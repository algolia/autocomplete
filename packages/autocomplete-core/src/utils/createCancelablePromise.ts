import { noop } from '@algolia/autocomplete-shared';

type PromiseExecutor<TValue = any> = (
  resolve: (value: TValue | PromiseLike<TValue>) => void,
  reject: (reason?: any) => void,
  onCancel: (handler: () => void) => void
) => void;

type CreateInternalCancelablePromiseParams<TValue = any> = {
  executor?: PromiseExecutor<TValue>;
  promise?: Promise<TValue>;
  initialState?: InternalState;
};

export type CancelablePromise<TValue> = {
  then<TResult1 = TValue, TResult2 = never>(
    onfulfilled?:
      | ((
          value: TValue
        ) => TResult1 | PromiseLike<TResult1> | CancelablePromise<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((
          reason: any
        ) => TResult2 | PromiseLike<TResult2> | CancelablePromise<TResult2>)
      | undefined
      | null
  ): CancelablePromise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?:
      | ((
          reason: any
        ) => TResult | PromiseLike<TResult> | CancelablePromise<TResult>)
      | undefined
      | null
  ): CancelablePromise<TValue | TResult>;
  finally(
    onfinally?: (() => void) | undefined | null,
    runWhenCanceled?: boolean
  ): CancelablePromise<TValue>;
  cancel(): void;
  isCanceled(): boolean;
};

export function createInternalCancelablePromise<TValue = any>({
  executor = noop,
  initialState = createInitialState(),
  promise = new Promise<TValue>((resolve, reject) => {
    return executor(resolve, reject, (onCancel) => {
      initialState.onCancelList.push(onCancel);
    });
  }),
}: CreateInternalCancelablePromiseParams): CancelablePromise<TValue> {
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
    finally(onfinally, runWhenCanceled) {
      if (runWhenCanceled) {
        state.onCancelList.push(onfinally);
      }

      return createCancelable<TValue>(
        promise.finally(
          createCallback(
            () => {
              if (onfinally) {
                if (runWhenCanceled) {
                  state.onCancelList = state.onCancelList.filter(
                    (callback) => callback !== onfinally
                  );
                }
                return onfinally();
              }
            },
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

      for (const callback of callbacks) {
        if (typeof callback === 'function') {
          try {
            callback();
          } catch (err) {
            console.error(err);
          }
        }
      }
    },
    isCanceled() {
      return state.isCanceled === true;
    },
  };
}

export function createCancelablePromise<TValue = any>(
  executor: PromiseExecutor<TValue>
): CancelablePromise<TValue> {
  return createInternalCancelablePromise({ executor });
}

createCancelablePromise.resolve = ((value) =>
  cancelable(Promise.resolve(value))) as CancelablePromiseOverloads['resolve'];
createCancelablePromise.reject = ((reason) =>
  cancelable(Promise.reject(reason))) as CancelablePromiseOverloads['reject'];
createCancelablePromise.isCancelable = isCancelablePromise;

function createCancelable<TValue = any>(
  promise: Promise<TValue>,
  initialState: InternalState
): CancelablePromise<TValue> {
  return createInternalCancelablePromise<TValue>({ promise, initialState });
}

export function cancelable<TValue = any>(
  promise: Promise<TValue>
): CancelablePromise<TValue> {
  return createCancelable(promise, createInitialState());
}

export function isCancelablePromise<TValue = any>(
  promise: Promise<TValue> | CancelablePromise<TValue>
): boolean {
  return promise?.hasOwnProperty('cancel') || false;
}

function createCallback(
  onResult: ((...args: any[]) => any) | null | undefined,
  state: InternalState,
  fallback: any
) {
  if (onResult) {
    return (arg?: any) => {
      if (!state.isCanceled) {
        const result = onResult(arg);

        if (isCancelablePromise(result)) {
          state.onCancelList.push(result.cancel);
        }

        return result;
      }

      return arg;
    };
  }

  return fallback;
}

function createInitialState(): InternalState {
  return { isCanceled: false, onCancelList: [] };
}

interface InternalState {
  isCanceled: boolean;
  onCancelList: any[];
}

interface CancelablePromiseOverloads {
  resolve<TValue>(
    value?: TValue | PromiseLike<TValue> | CancelablePromise<TValue>
  ): CancelablePromise<TValue>;
  reject<TValue = never>(reason?: any): CancelablePromise<TValue>;
}
