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
          hits: expect.any(Array),
        }),
        expect.objectContaining({
          hits: expect.any(Array),
        }),
      ]),
      hits: [[], []],
      facetHits: [[]],
    });
  });

  test('returns an empty array when there are no hits', () => {
    const { hits } = mapToAlgoliaResponse([createSFFVResponse()]);

    expect(hits).toEqual([]);
  });

  test('returns an empty array when there are no facet hits', () => {
    const { facetHits } = mapToAlgoliaResponse([createSingleSearchResponse()]);

    expect(facetHits).toEqual([]);
  });

  test('returns formatted results', () => {
    const { results } = mapToAlgoliaResponse([
      createSingleSearchResponse({
        index: 'indexName',
        queryID: 'queryID',
        hits: [
          {
            objectID: '1',
            label: 'Label 1',
          },
          {
            objectID: '2',
            label: 'Label 2',
          },
        ],
      }),
      createSingleSearchResponse({
        index: 'indexName',
        queryID: 'queryID',
        hits: [
          {
            objectID: '3',
            label: 'Label 3',
          },
          {
            objectID: '4',
            label: 'Label 4',
          },
        ],
      }),
    ]);

    expect(results).toEqual([
      expect.objectContaining({
        hits: [
          {
            label: 'Label 1',
            objectID: '1',
          },
          {
            label: 'Label 2',
            objectID: '2',
          },
        ],
      }),
      expect.objectContaining({
        hits: [
          {
            label: 'Label 3',
            objectID: '3',
          },
          {
            label: 'Label 4',
            objectID: '4',
          },
        ],
      }),
    ]);
  });

  test('returns formatted hits', () => {
    const { hits } = mapToAlgoliaResponse([
      createSingleSearchResponse({
        index: 'indexName',
        queryID: 'queryID',
        hits: [
          {
            objectID: '1',
            label: 'Label 1',
          },
          {
            objectID: '2',
            label: 'Label 2',
          },
        ],
      }),
      createSingleSearchResponse({
        index: 'indexName',
        queryID: 'queryID',
        hits: [
          {
            objectID: '3',
            label: 'Label 3',
          },
          {
            objectID: '4',
            label: 'Label 4',
          },
        ],
      }),
    ]);

    expect(hits).toEqual([
      [
        {
          label: 'Label 1',
          objectID: '1',
        },
        {
          label: 'Label 2',
          objectID: '2',
        },
      ],
      [
        {
          label: 'Label 3',
          objectID: '3',
        },
        {
          label: 'Label 4',
          objectID: '4',
        },
      ],
    ]);
  });

  test('returns formatted facet hits', () => {
    const { facetHits } = mapToAlgoliaResponse([
      createSFFVResponse({
        facetHits: [
          {
            count: 1,
            value: 'Label 1',
            highlighted: 'Label 1',
          },
          {
            count: 2,
            value: 'Label 2',
            highlighted: 'Label 2',
          },
        ],
      }),
    ]);

    expect(facetHits).toEqual([
      [
        {
          count: 1,
          label: 'Label 1',
          _highlightResult: {
            label: {
              value: 'Label 1',
            },
          },
        },
        {
          count: 2,
          label: 'Label 2',
          _highlightResult: {
            label: {
              value: 'Label 2',
            },
          },
        },
      ],
    ]);
  });
});
