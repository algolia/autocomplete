import { Hit } from '@algolia/client-search';

import { parseAlgoliaHitHighlight } from './parseAlgoliaHitHighlight';
import { ParseAlgoliaHitParams } from './ParseAlgoliaHitParams';
import { ParsedAttribute } from './ParsedAttribute';
import { reverseHighlightedParts } from './reverseHighlightedParts';

export function parseAlgoliaHitReverseHighlight<THit extends Hit<{}>>(
  props: ParseAlgoliaHitParams<THit>
): ParsedAttribute[] {
  return reverseHighlightedParts(parseAlgoliaHitHighlight<THit>(props));
}
