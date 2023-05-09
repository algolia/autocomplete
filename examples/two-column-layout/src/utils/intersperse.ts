export function intersperse<TItem, TSeparator>(
  arr: TItem[],
  separator: TSeparator
) {
  return arr.reduce((acc, curr) => [...acc, curr, separator], []).slice(0, -1);
}
