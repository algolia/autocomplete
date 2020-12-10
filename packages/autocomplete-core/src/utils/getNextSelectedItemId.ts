/**
 * Returns the next selected item ID from the current state.
 *
 * We allow circular keyboard navigation from the base index.
 * The base index can either be `null` (nothing is highlighted) or `0`
 * (the first item is highlighted).
 * The base index is allowed to get assigned `null` only if
 * `props.defaultSelectedItemId` is `null`. This pattern allows to "stop"
 * by the actual query before navigating to other suggestions as seen on
 * Google or Amazon.
 *
 * @param moveAmount The offset to increment (or decrement) the last index
 * @param baseIndex The current index to compute the next index from
 * @param itemCount The number of items
 * @param defaultSelectedItemId The default selected index to fallback to
 */
export function getNextSelectedItemId(
  moveAmount: number,
  baseIndex: number | null,
  itemCount: number,
  defaultSelectedItemId: number | null
): number | null {
  if (
    moveAmount < 0 &&
    (baseIndex === null || (defaultSelectedItemId !== null && baseIndex === 0))
  ) {
    return itemCount + moveAmount;
  }

  const numericIndex = (baseIndex === null ? -1 : baseIndex) + moveAmount;

  if (numericIndex <= -1 || numericIndex >= itemCount) {
    return defaultSelectedItemId === null ? null : 0;
  }

  return numericIndex;
}
