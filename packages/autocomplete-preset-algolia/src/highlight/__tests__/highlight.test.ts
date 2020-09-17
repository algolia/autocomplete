import { parseAlgoliaHitHighlight } from '../parseAlgoliaHitHighlight';
import { parseAlgoliaHitReverseHighlight } from '../parseAlgoliaHitReverseHighlight';
import { parseAlgoliaHitReverseSnippet } from '../parseAlgoliaHitReverseSnippet';
import { parseAlgoliaHitSnippet } from '../parseAlgoliaHitSnippet';

describe('highlight', () => {
  describe('parseAlgoliaHitHighlight', () => {
    test('returns the highlighted parts of the hit', () => {
      expect(
        parseAlgoliaHitHighlight({
          attribute: 'title',
          hit: {
            objectID: '1',
            title: 'Hello there',
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
        parseAlgoliaHitHighlight({
          attribute: 'title',
          hit: {
            objectID: '1',
            title: 'Hello there',
            _highlightResult: {
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

    test('do not escape ignored characters', () => {
      expect(
        parseAlgoliaHitHighlight({
          attribute: 'title',
          hit: {
            objectID: '1',
            title: 'Hello there',
            _highlightResult: {
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
  });

  describe('parseAlgoliaHitReverseHighlight', () => {
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

    test('escapes characters', () => {
      expect(
        parseAlgoliaHitReverseHighlight({
          attribute: 'title',
          hit: {
            objectID: '1',
            title: 'Hello there',
            _highlightResult: {
              title: {
                value: `__aa-highlight__Food__/aa-highlight__ & <Drinks> 'n' "Music"`,
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "isHighlighted": false,
            "value": "Food",
          },
          Object {
            "isHighlighted": true,
            "value": " &amp; &lt;Drinks&gt; &#39;n&#39; &quot;Music&quot;",
          },
        ]
      `);
    });

    test('do not escape ignored characters', () => {
      expect(
        parseAlgoliaHitReverseHighlight({
          attribute: 'title',
          hit: {
            objectID: '1',
            title: 'Hello there',
            _highlightResult: {
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
            "isHighlighted": false,
            "value": "Food",
          },
          Object {
            "isHighlighted": true,
            "value": " &amp; &lt;Drinks&gt; 'n' &quot;Music&quot;",
          },
        ]
      `);
    });
  });

  describe('parseAlgoliaHitReverseSnippet', () => {
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

    test('escapes characters', () => {
      expect(
        parseAlgoliaHitReverseSnippet({
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
            "isHighlighted": false,
            "value": "Food",
          },
          Object {
            "isHighlighted": true,
            "value": " &amp; &lt;Drinks&gt; &#39;n&#39; &quot;Music&quot;",
          },
        ]
      `);
    });

    test('do not escape ignored characters', () => {
      expect(
        parseAlgoliaHitReverseSnippet({
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
            "isHighlighted": false,
            "value": "Food",
          },
          Object {
            "isHighlighted": true,
            "value": " &amp; &lt;Drinks&gt; 'n' &quot;Music&quot;",
          },
        ]
      `);
    });
  });

  describe('parseAlgoliaHitSnippet', () => {
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

  test('do not escape ignored characters', () => {
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
});
