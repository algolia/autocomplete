type ReactiveValue<TValue> = () => TValue;
export type Reactive<TValue> = {
  current: TValue;
  /**
   * @private
   */
  _fn: ReactiveValue<TValue>;
  /**
   * @private
   */
  _ref: {
    current: TValue;
  };
};

export function createReactiveWrapper() {
  const reactives: Array<Reactive<any>> = [];

  return {
    reactive<TValue>(value: ReactiveValue<TValue>) {
      const reactive: Reactive<TValue> = {
        _fn: value,
        _ref: { current: value() },
        get current() {
          return this._ref.current;
        },
        set current(value) {
          this._ref.current = value;
        },
      };

      reactives.push(reactive);

      value();

      return reactive;
    },
    runReactives() {
      reactives.forEach((value) => {
        value._ref.current = value._fn();
      });
    },
  };
}
