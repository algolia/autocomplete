import {
  parseHighlightedAttribute,
  parseReverseHighlightedAttribute,
  parseReverseSnippetedAttribute,
  parseSnippetedAttribute,
} from '../formatting';

describe('highlight', () => {
  describe('parseHighlightedAttribute', () => {
    test('returns the highlighted parts of the hit', () => {
      expect(
        parseHighlightedAttribute({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: '<mark>He</mark>llo t<mark>he</mark>re',
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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

    test('allows custom highlightPreTag and highlightPostTag', () => {
      expect(
        parseHighlightedAttribute({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: '<em>He</em>llo t<em>he</em>re',
              },
            },
          },
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
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
        parseHighlightedAttribute({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: `<mark>Food</mark> & <Drinks> 'n' "Music"`,
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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
        parseHighlightedAttribute({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: `<mark>Food</mark> & <Drinks> 'n' "Music"`,
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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

  describe('parseReverseHighlightedAttribute', () => {
    test('returns the reverse-highlighted parts of the hit', () => {
      expect(
        parseReverseHighlightedAttribute({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: '<mark>He</mark>llo t<mark>he</mark>re',
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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
        parseReverseHighlightedAttribute({
          attribute: 'title',
          hit: { _highlightResult: { title: { value: 'Hello' } } },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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

    test('allows custom highlightPreTag and highlightPostTag', () => {
      expect(
        parseReverseHighlightedAttribute({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: '<em>He</em>llo t<em>he</em>re',
              },
            },
          },
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
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
        parseReverseHighlightedAttribute({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: `<mark>Food</mark> & <Drinks> 'n' "Music"`,
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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
        parseReverseHighlightedAttribute({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: `<mark>Food</mark> & <Drinks> 'n' "Music"`,
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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

  describe('parseSnippetedAttribute', () => {
    test('returns the highlighted snippet parts of the hit', () => {
      expect(
        parseSnippetedAttribute({
          attribute: 'title',
          hit: {
            _snippetResult: {
              title: {
                value: '<mark>He</mark>llo t<mark>he</mark>re',
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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

    test('allows custom highlightPreTag and highlightPostTag', () => {
      expect(
        parseSnippetedAttribute({
          attribute: 'title',
          hit: {
            _snippetResult: {
              title: {
                value: '<em>He</em>llo t<em>he</em>re',
              },
            },
          },
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
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
        parseSnippetedAttribute({
          attribute: 'title',
          hit: {
            _snippetResult: {
              title: {
                value: `<mark>Food</mark> & <Drinks> 'n' "Music"`,
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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
        parseSnippetedAttribute({
          attribute: 'title',
          hit: {
            _snippetResult: {
              title: {
                value: `<mark>Food</mark> & <Drinks> 'n' "Music"`,
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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

  describe('parseReverseSnippetedAttribute', () => {
    test('returns the highlighted snippet parts of the hit', () => {
      expect(
        parseReverseSnippetedAttribute({
          attribute: 'title',
          hit: {
            _snippetResult: {
              title: {
                value: '<mark>He</mark>llo t<mark>he</mark>re',
              },
            },
          },
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
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
  });

  test('allows custom highlightPreTag and highlightPostTag', () => {
    expect(
      parseReverseSnippetedAttribute({
        attribute: 'title',
        hit: {
          _snippetResult: {
            title: {
              value: '<em>He</em>llo t<em>he</em>re',
            },
          },
        },
        highlightPreTag: '<em>',
        highlightPostTag: '</em>',
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
      parseReverseSnippetedAttribute({
        attribute: 'title',
        hit: {
          _snippetResult: {
            title: {
              value: `<mark>Food</mark> & <Drinks> 'n' "Music"`,
            },
          },
        },
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
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
      parseReverseSnippetedAttribute({
        attribute: 'title',
        hit: {
          _snippetResult: {
            title: {
              value: `<mark>Food</mark> & <Drinks> 'n' "Music"`,
            },
          },
        },
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
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
