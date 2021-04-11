import { RequesterDescription } from '../types/RequesterDescription';

export function isRequesterDescription(
  description: any
): description is RequesterDescription<any, any> {
  return Boolean(description.fetcher);
}

export function assertIsRequesterDescription(
  _description: any
): asserts _description is RequesterDescription<any, any> {}
