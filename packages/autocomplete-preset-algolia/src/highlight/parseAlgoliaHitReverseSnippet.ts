import { Hit } from '@algolia/client-search';

import { ParseAlgoliaHitParams } from './ParseAlgoliaHitParams';
import { parseAlgoliaHitSnippet } from './parseAlgoliaHitSnippet';
import { ParsedAttribute } from './ParsedAttribute';
import { reverseHighlightedParts } from './reverseHighlightedParts';

export function parseAlgoliaHitReverseSnippet<THit extends Hit<{}>>(
  props: ParseAlgoliaHitParams<THit>
): ParsedAttribute[] {
  return reverseHighlightedParts(parseAlgoliaHitSnippet<THit>(props));
}
