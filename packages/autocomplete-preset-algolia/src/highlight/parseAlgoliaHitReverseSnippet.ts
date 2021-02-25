import { ParseAlgoliaHitParams } from './ParseAlgoliaHitParams';
import { parseAlgoliaHitSnippet } from './parseAlgoliaHitSnippet';
import { ParsedAttribute } from './ParsedAttribute';
import { reverseHighlightedParts } from './reverseHighlightedParts';
import { SnippetedHit } from './SnippetedHit';

export function parseAlgoliaHitReverseSnippet<
  THit extends SnippetedHit<unknown>
>(props: ParseAlgoliaHitParams<THit>): ParsedAttribute[] {
  return reverseHighlightedParts(parseAlgoliaHitSnippet<THit>(props));
}
