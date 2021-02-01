import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../../test/utils';
import { version } from '../../version';
import { getAlgoliaHits } from '../getAlgoliaHits';
import { getAlgoliaResults } from '../getAlgoliaResults';

function createTestSearchClient() {
  return createSearchClient({
    search: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse<{ label: string }>(
          { hits: [{ objectID: '1', label: 'Hit 1' }] },
          { hits: [{ objectID: '2', label: 'Hit 2' }] }
        )
      )
    ),
  });
}

describe('getAlgoliaResults', () => {
  test('with default options', async () => {
    const searchClient = createTestSearchClient();

    const results = await getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 5,
          highlightPreTag: '__aa-highlight__',
          highlightPostTag: '__/aa-highlight__',
        },
      },
    ]);
    expect(results).toEqual([
      expect.objectContaining({ hits: [{ objectID: '1', label: 'Hit 1' }] }),
      expect.objectContaining({ hits: [{ objectID: '2', label: 'Hit 2' }] }),
    ]);
  });

  test('with custom search parameters', async () => {
    const searchClient = createTestSearchClient();

    const results = await getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 10,
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
          page: 2,
        },
      },
    ]);
    expect(results).toEqual([
      expect.objectContaining({ hits: [{ objectID: '1', label: 'Hit 1' }] }),
      expect.objectContaining({ hits: [{ objectID: '2', label: 'Hit 2' }] }),
    ]);
  });

  test('attaches default Algolia agent', async () => {
    const searchClient = createTestSearchClient();

    await getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledTimes(1);
    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledWith(
      'autocomplete-core',
      version
    );
  });

  test('allows custom user agents', async () => {
    const searchClient = createTestSearchClient();

    await getAlgoliaResults({
      searchClient,
      queries: [],
      userAgents: [{ segment: 'custom-ua', version: '1.0.0' }],
    });

    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledTimes(2);
    expect(searchClient.addAlgoliaAgent).toHaveBeenNthCalledWith(
      1,
      'autocomplete-core',
      version
    );
    expect(searchClient.addAlgoliaAgent).toHaveBeenNthCalledWith(
      2,
      'custom-ua',
      '1.0.0'
    );
  });
});

describe('getAlgoliaHits', () => {
  test('with default options', async () => {
    const searchClient = createTestSearchClient();

    const hits = await getAlgoliaHits({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 5,
          highlightPreTag: '__aa-highlight__',
          highlightPostTag: '__/aa-highlight__',
        },
      },
    ]);
    expect(hits).toEqual([
      [{ objectID: '1', label: 'Hit 1' }],
      [{ objectID: '2', label: 'Hit 2' }],
    ]);
  });

  test('with custom search parameters', async () => {
    const searchClient = createTestSearchClient();

    const hits = await getAlgoliaHits({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 10,
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
          page: 2,
        },
      },
    ]);
    expect(hits).toEqual([
      [{ objectID: '1', label: 'Hit 1' }],
      [{ objectID: '2', label: 'Hit 2' }],
    ]);
  });

  test('attaches Algolia agent', async () => {
    const searchClient = createTestSearchClient();

    await getAlgoliaHits({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledTimes(1);
    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledWith(
      'autocomplete-core',
      version
    );
  });

  test('allows custom user agents', async () => {
    const searchClient = createTestSearchClient();

    await getAlgoliaHits({
      searchClient,
      queries: [],
      userAgents: [{ segment: 'custom-ua', version: '1.0.0' }],
    });

    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledTimes(2);
    expect(searchClient.addAlgoliaAgent).toHaveBeenNthCalledWith(
      1,
      'autocomplete-core',
      version
    );
    expect(searchClient.addAlgoliaAgent).toHaveBeenNthCalledWith(
      2,
      'custom-ua',
      '1.0.0'
    );
  });
});
