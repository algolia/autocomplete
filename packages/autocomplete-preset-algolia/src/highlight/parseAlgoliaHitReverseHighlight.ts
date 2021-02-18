import { HighlightedHit } from './HighlightedHit';
import { parseAlgoliaHitHighlight } from './parseAlgoliaHitHighlight';
import { ParseAlgoliaHitParams } from './ParseAlgoliaHitParams';
import { ParsedAttribute } from './ParsedAttribute';
import { reverseHighlightedParts } from './reverseHighlightedParts';

export function parseAlgoliaHitReverseHighlight<
  THit extends HighlightedHit<unknown>
>(props: ParseAlgoliaHitParams<THit>): ParsedAttribute[] {
  return reverseHighlightedParts(parseAlgoliaHitHighlight<THit>(props));
}
