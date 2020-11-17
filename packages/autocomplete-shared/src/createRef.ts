export function createRef<TValue>(initialValue: TValue) {
  return {
    current: initialValue,
  };
}
