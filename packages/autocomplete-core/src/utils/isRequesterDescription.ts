import { RequesterDescription } from '../createRequester';
import { BaseItem } from '../types';

export function isRequesterDescription<TItem extends BaseItem>(
  description: TItem[] | TItem[][] | RequesterDescription<TItem>
): description is RequesterDescription<TItem> {
  return Boolean((description as RequesterDescription<TItem>).execute);
}

export function assertIsRequesterDescription<TItem extends BaseItem>(
  _description: TItem[] | TItem[][] | RequesterDescription<TItem>
): asserts _description is RequesterDescription<TItem> {}
