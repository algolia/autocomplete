import { InternalAutocompleteOptions } from '../types';

export function getNextSelectedItemId<TItem>(
  moveAmount: number,
  baseIndex: number | null,
  itemCount: number,
  defaultSelectedItemId: InternalAutocompleteOptions<
    TItem
  >['defaultSelectedItemId']
): number | null {
  // We allow circular keyboard navigation from the base index.
  // The base index can either be `null` (nothing is highlighted) or `0`
  // (the first item is highlighted).
  // The base index is allowed to get assigned `null` only if
  // `props.defaultSelectedItemId` is `null`. This pattern allows to "stop"
  // by the actual query before navigating to other suggestions as seen on
  // Google or Amazon.
  if (baseIndex === null && moveAmount < 0) {
    return itemCount - 1;
  }

  if (defaultSelectedItemId !== null && baseIndex === 0 && moveAmount < 0) {
    return itemCount - 1;
  }

  const numericIndex = (baseIndex === null ? -1 : baseIndex) + moveAmount;

  if (numericIndex <= -1 || numericIndex >= itemCount) {
    return defaultSelectedItemId === null ? null : 0;
  }

  return numericIndex;
}
