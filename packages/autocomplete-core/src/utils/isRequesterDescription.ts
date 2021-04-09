import { RequesterDescription } from '../types/RequesterDescription';

export function isRequesterDescription(
  description: any
): description is RequesterDescription<any, any> {
  return Boolean(description.fetcher);
}
