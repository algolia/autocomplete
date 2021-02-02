import algoliaPreset from '@algolia/autocomplete-preset-algolia';

import { createSearchClient } from '../../../../test/utils';
import { getAlgoliaHits } from '../getAlgoliaHits';
import { version } from '../version';

jest.mock('@algolia/autocomplete-preset-algolia', () => {
  const module = jest.requireActual('@algolia/autocomplete-preset-algolia');

  return {
    ...module,
    getAlgoliaHits: jest.fn(),
  };
});

describe('getAlgoliaHits', () => {
  test('forwards params to the preset function', () => {
    const searchClient = createSearchClient();

    getAlgoliaHits({ searchClient, queries: [] });

    expect(algoliaPreset.getAlgoliaHits).toHaveBeenCalledTimes(1);
    expect(algoliaPreset.getAlgoliaHits).toHaveBeenCalledWith({
      searchClient,
      queries: [],
      userAgents: [{ segment: 'autocomplete-js', version }],
    });
  });
});
