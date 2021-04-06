import { createFetcher } from '../createFetcher';
import { flatten } from '../utils';

describe('createFetcher', () => {
  test('uses the passed `request` function to fetch data', async () => {
    const fetchFn = createFetcher({
      request: () => Promise.resolve([{}]),
    });

    const results = await fetchFn({
      searchClient: null,
      queries: [],
    });

    expect(results).toEqual([{}]);
  });
  test('uses the passed `transform` function to transform data', async () => {
    const fetchFn = createFetcher({
      request: ({ queries }) => {
        return Promise.resolve(queries.map(({ query }) => query));
      },
      transform: (values) => flatten(values).map((word) => word.toUpperCase()),
    });

    const results = await fetchFn({
      searchClient: null,
      queries: [
        { query: ['hello', 'world'], type: 'greetings' },
        { query: ['what', 'how'], type: 'questions' },
      ],
    });

    expect(results).toEqual(['HELLO', 'WORLD', 'WHAT', 'HOW']);
  });
  test('provides the initial queries in the `transform` function', async () => {
    const fetchFn = createFetcher({
      request: ({ queries }) => {
        return Promise.resolve(queries.map(({ query }) => query));
      },
      transform: (values, initialQueries) =>
        values.map((words, index) => {
          const { type } = initialQueries[index];

          return {
            type,
            words,
          };
        }),
    });

    const results = await fetchFn({
      searchClient: null,
      queries: [
        { query: ['hello', 'world'], type: 'greetings' },
        { query: ['what', 'how'], type: 'questions' },
      ],
    });

    expect(results).toEqual([
      { words: ['hello', 'world'], type: 'greetings' },
      { words: ['what', 'how'], type: 'questions' },
    ]);
  });
});
