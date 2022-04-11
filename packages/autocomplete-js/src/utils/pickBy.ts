export function pickBy<TValue = unknown>(
  obj: Record<string, TValue>,
  predicate: (value: { key: string; value: TValue }) => boolean
) {
  return Object.entries(obj).reduce<Record<string, TValue>>(
    (acc, [key, value]) => {
      if (predicate({ key, value })) {
        return { ...acc, [key]: value };
      }

      return acc;
    },
    {}
  );
}
