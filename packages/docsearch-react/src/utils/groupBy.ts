export function groupBy<TValue extends object>(
  values: TValue[],
  predicate: (value: TValue) => string
): Record<string, TValue[]> {
  return values.reduce<Record<string, TValue[]>>((acc, item) => {
    const key = predicate(item);

    if (!acc.hasOwnProperty(key)) {
      acc[key] = [];
    }

    acc[key].push(item);

    return acc;
  }, {});
}
