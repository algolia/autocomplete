import { warnCache } from '@algolia/autocomplete-shared';

import { parseAlgoliaHitSnippet } from '../parseAlgoliaHitSnippet';

describe('parseAlgoliaHitSnippet', () => {
  afterEach(() => {
    warnCache.current = {};
  });

  test('returns the highlighted snippet parts of the hit', () => {
    expect(
      parseAlgoliaHitSnippet({
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
          "isHighlighted": true,
          "value": "He",
        },
        Object {
          "isHighlighted": false,
          "value": "llo t",
        },
        Object {
          "isHighlighted": true,
          "value": "he",
        },
        Object {
          "isHighlighted": false,
          "value": "re",
        },
      ]
    `);
  });

  test('escapes characters', () => {
    expect(
      parseAlgoliaHitSnippet({
        attribute: 'title',
        hit: {
          objectID: '1',
          title: 'Hello there',
          _snippetResult: {
            title: {
              value: `__aa-highlight__Food__/aa-highlight__ & <Drinks> 'n' "Music"`,
            },
          },
        },
      })
    ).toMatchInlineSnapshot(`
    Array [
      Object {
        "isHighlighted": true,
        "value": "Food",
      },
      Object {
        "isHighlighted": false,
        "value": " &amp; &lt;Drinks&gt; &#39;n&#39; &quot;Music&quot;",
      },
    ]
  `);
  });

  test('does not escape ignored characters', () => {
    expect(
      parseAlgoliaHitSnippet({
        attribute: 'title',
        hit: {
          objectID: '1',
          title: 'Hello there',
          _snippetResult: {
            title: {
              value: `__aa-highlight__Food__/aa-highlight__ & <Drinks> 'n' "Music"`,
            },
          },
        },
        ignoreEscape: ["'"],
      })
    ).toMatchInlineSnapshot(`
    Array [
      Object {
        "isHighlighted": true,
        "value": "Food",
      },
      Object {
        "isHighlighted": false,
        "value": " &amp; &lt;Drinks&gt; 'n' &quot;Music&quot;",
      },
    ]
  `);
  });

  test('returns the attribute value if the attribute cannot be snippeted', () => {
    expect(
      parseAlgoliaHitSnippet({
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

  test('returns empty string if the attribute does not exist', () => {
    expect(
      parseAlgoliaHitSnippet({
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
      parseAlgoliaHitSnippet({
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
    }).toWarn(
      '[Autocomplete] The attribute "_snippetResult.description.value" does not exist on the hit. Did you set it in `attributesToSnippet`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToSnippet/'
    );
  });
});
