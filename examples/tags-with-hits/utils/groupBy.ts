export function groupBy<TItem>(
  items: TItem[],
  predicate: (item: TItem) => string
) {
  return items.reduce((acc, item) => {
    const key = predicate(item);

    if (!acc.hasOwnProperty(key)) {
      acc[key] = [];
    }

    acc[key].push(item);

    return acc;
  }, {} as Record<string, TItem[]>);
}
