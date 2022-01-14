class CancelablePromiseInternal<T = any> {
  #internals: Internals;
  #promise: Promise<T>;

  constructor({
    executor = () => {},
    internals = defaultInternals(),
    promise = new Promise<T>((resolve, reject) =>
      executor(resolve, reject, (onCancel) => {
        internals.onCancelList.push(onCancel);
      })
    ),
  }: {
    executor?: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      onCancel: (cancelHandler: () => void) => void
    ) => void;
    internals?: Internals;
    promise?: Promise<T>;
  }) {
    this.cancel = this.cancel.bind(this);
    this.#internals = internals;
    this.#promise =
      promise ||
      new Promise<T>((resolve, reject) =>
        executor(resolve, reject, (onCancel) => {
          internals.onCancelList.push(onCancel);
        })
      );
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((
          value: T
        ) => TResult1 | PromiseLike<TResult1> | CancelablePromise<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((
          reason: any
        ) => TResult2 | PromiseLike<TResult2> | CancelablePromise<TResult2>)
      | undefined
      | null
  ): CancelablePromise<TResult1 | TResult2> {
    return makeCancelable<TResult1 | TResult2>(
      this.#promise.then(
        createCallback(onfulfilled, this.#internals),
        createCallback(onrejected, this.#internals)
      ),
      this.#internals
    );
  }

  catch<TResult = never>(
    onrejected?:
      | ((
          reason: any
        ) => TResult | PromiseLike<TResult> | CancelablePromise<TResult>)
      | undefined
      | null
  ): CancelablePromise<T | TResult> {
    return makeCancelable<T | TResult>(
      this.#promise.catch(createCallback(onrejected, this.#internals)),
      this.#internals
    );
  }

  finally(
    onfinally?: (() => void) | undefined | null,
    runWhenCanceled?: boolean
  ): CancelablePromise<T> {
    if (runWhenCanceled) {
      this.#internals.onCancelList.push(onfinally);
    }
    return makeCancelable<T>(
      this.#promise.finally(
        createCallback(() => {
          if (onfinally) {
            if (runWhenCanceled) {
              this.#internals.onCancelList = this.#internals.onCancelList.filter(
                (callback) => callback !== onfinally
              );
            }
            return onfinally();
          }
        }, this.#internals)
      ),
      this.#internals
    );
  }

  cancel(): void {
    this.#internals.isCanceled = true;
    const callbacks = this.#internals.onCancelList;
    this.#internals.onCancelList = [];
    for (const callback of callbacks) {
      if (typeof callback === 'function') {
        try {
          callback();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  isCanceled(): boolean {
    return this.#internals.isCanceled === true;
  }
}

export class CancelablePromise<T = any> extends CancelablePromiseInternal<T> {
  static resolve = function resolve(value) {
    return cancelable(Promise.resolve(value));
  } as CancelablePromiseOverloads['resolve'];

  static reject = function reject(reason) {
    return cancelable(Promise.reject(reason));
  } as CancelablePromiseOverloads['reject'];

  static isCancelable = isCancelablePromise;

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      onCancel: (cancelHandler: () => void) => void
    ) => void
  ) {
    super({ executor });
  }
}

export function cancelable<T = any>(promise: Promise<T>): CancelablePromise<T> {
  return makeCancelable(promise, defaultInternals());
}

export function isCancelablePromise(promise: any): boolean {
  return (
    promise instanceof CancelablePromise ||
    promise instanceof CancelablePromiseInternal
  );
}

function createCallback(onResult: any, internals: Internals) {
  if (onResult) {
    return (arg?: any) => {
      if (!internals.isCanceled) {
        const result = onResult(arg);
        if (isCancelablePromise(result)) {
          internals.onCancelList.push(result.cancel);
        }
        return result;
      }
      return arg;
    };
  }
}

function makeCancelable<T>(promise: Promise<T>, internals: Internals) {
  return new CancelablePromiseInternal<T>({
    internals,
    promise,
  }) as CancelablePromise<T>;
}

function defaultInternals(): Internals {
  return { isCanceled: false, onCancelList: [] };
}

interface Internals {
  isCanceled: boolean;
  onCancelList: any[];
}

interface CancelablePromiseOverloads {
  all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>,
      T9 | PromiseLike<T9>,
      T10 | PromiseLike<T10>,
      T11 | PromiseLike<T11>,
      T12 | PromiseLike<T12>
    ]
  ): CancelablePromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12]>;

  all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>,
      T9 | PromiseLike<T9>,
      T10 | PromiseLike<T10>,
      T11 | PromiseLike<T11>
    ]
  ): CancelablePromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11]>;

  all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>,
      T9 | PromiseLike<T9>,
      T10 | PromiseLike<T10>
    ]
  ): CancelablePromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;

  all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>,
      T9 | PromiseLike<T9>
    ]
  ): CancelablePromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;

  all<T1, T2, T3, T4, T5, T6, T7, T8>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>
    ]
  ): CancelablePromise<[T1, T2, T3, T4, T5, T6, T7, T8]>;

  all<T1, T2, T3, T4, T5, T6, T7>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>
    ]
  ): CancelablePromise<[T1, T2, T3, T4, T5, T6, T7]>;

  all<T1, T2, T3, T4, T5, T6>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>
    ]
  ): CancelablePromise<[T1, T2, T3, T4, T5, T6]>;

  all<T1, T2, T3, T4, T5>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>
    ]
  ): CancelablePromise<[T1, T2, T3, T4, T5]>;

  all<T1, T2, T3, T4>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>
    ]
  ): CancelablePromise<[T1, T2, T3, T4]>;

  all<T1, T2, T3>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>
    ]
  ): CancelablePromise<[T1, T2, T3]>;

  all<T1, T2>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]
  ): CancelablePromise<[T1, T2]>;

  all<T>(values: readonly (T | PromiseLike<T>)[]): CancelablePromise<T[]>;

  allSettled<T extends readonly unknown[] | readonly [unknown]>(
    values: T
  ): CancelablePromise<
    {
      -readonly [P in keyof T]: PromiseSettledResult<
        T[P] extends PromiseLike<infer U> ? U : T[P]
      >;
    }
  >;

  allSettled<T>(
    values: Iterable<T>
  ): CancelablePromise<
    PromiseSettledResult<T extends PromiseLike<infer U> ? U : T>[]
  >;

  race<T>(
    values: readonly T[]
  ): CancelablePromise<T extends PromiseLike<infer U> ? U : T>;

  resolve(): CancelablePromise<void>;

  resolve<T>(
    value: T | PromiseLike<T> | CancelablePromise<T>
  ): CancelablePromise<T>;

  reject<T = never>(reason?: any): CancelablePromise<T>;
}
