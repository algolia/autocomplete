import { warnCache } from '@algolia/autocomplete-shared';

import { parseAlgoliaHitReverseHighlight } from '../parseAlgoliaHitReverseHighlight';

describe('parseAlgoliaHitReverseHighlight', () => {
  afterEach(() => {
    warnCache.current = {};
  });

  test('returns the reverse-highlighted parts of the hit', () => {
    expect(
      parseAlgoliaHitReverseHighlight({
        attribute: 'title',
        hit: {
          objectID: '1',
          title: 'Hello there',
          _highlightResult: {
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

  test('returns the non-highlighted parts when every part matches', () => {
    expect(
      parseAlgoliaHitReverseHighlight({
        attribute: 'title',
        hit: {
          objectID: '1',
          title: 'Hello there',
          _highlightResult: { title: { value: 'Hello' } },
        },
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "isHighlighted": false,
          "value": "Hello",
        },
      ]
    `);
  });

  test('returns the attribute value if the attribute cannot be highlighted', () => {
    expect(
      parseAlgoliaHitReverseHighlight({
        attribute: 'description',
        hit: {
          objectID: '1',
          title: 'Hello there',
          description: 'Welcome all',
          _highlightResult: {
            title: {
              value:
                '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
              matchLevel: 'partial',
              matchedWords: [],
              fullyHighlighted: false,
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
      parseAlgoliaHitReverseHighlight({
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

  test('warns if the attribute cannot be highlighted', () => {
    expect(() => {
      parseAlgoliaHitReverseHighlight({
        attribute: 'description',
        hit: {
          objectID: '1',
          title: 'Hello there',
          description: 'Welcome all',
          _highlightResult: {
            title: {
              value:
                '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
              matchLevel: 'partial',
              matchedWords: [],
              fullyHighlighted: false,
            },
          },
        },
      });
    }).toWarnDev(
      '[Autocomplete] The attribute "_highlightResult.description.value" does not exist on the hit. Did you set it in `attributesToHighlight`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToHighlight/'
    );
  });
});
