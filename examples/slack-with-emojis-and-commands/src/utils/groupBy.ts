export function groupBy<TValue extends object, TKey extends string>(
  collection: TValue[],
  iteratee: (item: TValue) => TKey
) {
  return collection.reduce<Record<TKey, TValue[]>>((acc, item) => {
    const key = iteratee(item);

    if (!acc.hasOwnProperty(key)) {
      // eslint-disable-next-line no-param-reassign
      acc[key] = [];
    }

    acc[key].push(item);

    return acc;
  }, {} as any);
}
