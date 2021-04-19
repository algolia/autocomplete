import {
  createSingleSearchResponse,
  createSFFVResponse,
} from '../../../../../test/utils';
import { mapToAlgoliaResponse } from '../mapToAlgoliaResponse';

describe('mapToAlgoliaResponse', () => {
  test('pre-maps the hits and facet hits from the results', () => {
    const searchResponse = createSingleSearchResponse();
    const sffvResponse = createSFFVResponse();
    const response = mapToAlgoliaResponse([
      searchResponse,
      searchResponse,
      sffvResponse,
    ]);

    expect(response).toEqual({
      results: expect.arrayContaining([
        expect.objectContaining({
          hits: expect.any(Object),
        }),
        expect.objectContaining({
          hits: expect.any(Object),
        }),
      ]),
      hits: expect.arrayContaining([[], []]),
      facetHits: expect.arrayContaining([[]]),
    });
  });
  test('returns an empty array when there are no hits', () => {
    const { hits } = mapToAlgoliaResponse([createSFFVResponse()]);

    expect(hits).toHaveLength(0);
  });
  test('returns an empty array when there are no facet hits', () => {
    const { facetHits } = mapToAlgoliaResponse([createSingleSearchResponse()]);

    expect(facetHits).toHaveLength(0);
  });
});
