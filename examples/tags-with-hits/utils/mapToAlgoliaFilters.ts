import { Tag } from '@algolia/autocomplete-plugin-tags';

import { TagExtraData } from '../types';

export function mapToAlgoliaFilters(
  tagsByFacet: Record<string, Array<Tag<TagExtraData>>>,
  operator = 'AND'
) {
  return Object.keys(tagsByFacet)
    .map((facet) => {
      return `(${tagsByFacet[facet]
        .map(({ label }) => `${facet}:"${label}"`)
        .join(' OR ')})`;
    })
    .join(` ${operator} `);
}
