import algoliaPreset from '@algolia/autocomplete-preset-algolia';

import { createSearchClient } from '../../../../test/utils';
import { getAlgoliaResults } from '../getAlgoliaResults';
import { version } from '../version';

jest.mock('@algolia/autocomplete-preset-algolia', () => {
  const module = jest.requireActual('@algolia/autocomplete-preset-algolia');

  return {
    ...module,
    getAlgoliaResults: jest.fn(),
  };
});

describe('getAlgoliaResults', () => {
  test('forwards params to the preset function', () => {
    const searchClient = createSearchClient();

    getAlgoliaResults({ searchClient, queries: [] });

    expect(algoliaPreset.getAlgoliaResults).toHaveBeenCalledTimes(1);
    expect(algoliaPreset.getAlgoliaResults).toHaveBeenCalledWith({
      searchClient,
      queries: [],
      userAgents: [{ segment: 'autocomplete-js', version }],
    });
  });
});
