type ReactiveValue<TValue> = () => TValue;
export type Reactive<TValue> = {
  value: TValue;
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
      const current = value();
      const reactive: Reactive<TValue> = {
        _fn: value,
        _ref: { current },
        get value() {
          return this._ref.current;
        },
        set value(value) {
          this._ref.current = value;
        },
      };

      reactives.push(reactive);

      return reactive;
    },
    runReactives() {
      reactives.forEach((value) => {
        value._ref.current = value._fn();
      });
    },
  };
}
