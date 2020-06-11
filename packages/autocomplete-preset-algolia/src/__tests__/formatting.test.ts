import {
  parseHighlightedAttribute,
  parseReverseHighlightedAttribute,
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
  });
});
