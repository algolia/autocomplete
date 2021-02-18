import algoliaPreset from '@algolia/autocomplete-preset-algolia';

import { createSearchClient } from '../../../../test/utils';
import { getAlgoliaFacetHits } from '../getAlgoliaFacetHits';
import { version } from '../version';

jest.mock('@algolia/autocomplete-preset-algolia', () => {
  const module = jest.requireActual('@algolia/autocomplete-preset-algolia');

  return {
    ...module,
    getAlgoliaFacetHits: jest.fn(),
  };
});

describe('getAlgoliaFacetHits', () => {
  test('forwards params to the preset function', () => {
    const searchClient = createSearchClient();

    getAlgoliaFacetHits({ searchClient, queries: [] });

    expect(algoliaPreset.getAlgoliaFacetHits).toHaveBeenCalledTimes(1);
    expect(algoliaPreset.getAlgoliaFacetHits).toHaveBeenCalledWith({
      searchClient,
      queries: [],
      userAgents: [{ segment: 'autocomplete-js', version }],
    });
  });
});
