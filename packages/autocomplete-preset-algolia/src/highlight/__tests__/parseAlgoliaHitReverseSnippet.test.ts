import { warnCache } from '@algolia/autocomplete-shared';

import { parseAlgoliaHitReverseSnippet } from '../parseAlgoliaHitReverseSnippet';

describe('parseAlgoliaHitReverseSnippet', () => {
  afterEach(() => {
    warnCache.current = {};
  });

  test('returns the highlighted snippet parts of the hit', () => {
    expect(
      parseAlgoliaHitReverseSnippet({
        attribute: 'title',
        hit: {
          objectID: '1',
          title: 'Hello there',
          _snippetResult: {
            title: {
              value:
                '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
            },
          },
        },
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "isHighlighted": false,
          "value": "He",
        },
        Object {
          "isHighlighted": true,
          "value": "llo t",
        },
        Object {
          "isHighlighted": false,
          "value": "he",
        },
        Object {
          "isHighlighted": true,
          "value": "re",
        },
      ]
    `);
  });

  test('returns the attribute value if the attribute cannot be snippeted', () => {
    expect(
      parseAlgoliaHitReverseSnippet({
        attribute: 'description',
        hit: {
          objectID: '1',
          title: 'Hello there',
          description: 'Welcome all',
          _snippetResult: {
            title: {
              value:
                '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
            },
          },
        },
      })
    ).toEqual([
      {
        value: 'Welcome all',
        isHighlighted: false,
      },
    ]);
  });

  test('returns empty parts if the attribute does not exist', () => {
    expect(
      parseAlgoliaHitReverseSnippet({
        // @ts-ignore
        attribute: 'description',
        hit: {
          objectID: '1',
          title: 'Hello there',
          _snippetResult: {
            title: {
              value:
                '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
            },
          },
        },
      })
    ).toEqual([]);
  });

  test('warns if the attribute cannot be snippeted', () => {
    expect(() => {
      parseAlgoliaHitReverseSnippet({
        attribute: 'description',
        hit: {
          objectID: '1',
          title: 'Hello there',
          description: 'Welcome all',
          _snippetResult: {
            title: {
              value:
                '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
            },
          },
        },
      });
    }).toWarnDev(
      '[Autocomplete] The attribute "_snippetResult.description.value" does not exist on the hit. Did you set it in `attributesToSnippet`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToSnippet/'
    );
  });
});
