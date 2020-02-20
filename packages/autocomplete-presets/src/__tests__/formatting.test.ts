import {
  highlightAlgoliaHit,
  reverseHighlightAlgoliaHit,
  snippetAlgoliaHit,
} from '../formatting';

describe('highlight', () => {
  describe('highlightAlgoliaHit', () => {
    test('returns the highlighted value of the hit', () => {
      expect(
        highlightAlgoliaHit({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: '<mark>He</mark>llo t<mark>he</mark>re',
              },
            },
          },
        })
      ).toEqual('<mark>He</mark>llo t<mark>he</mark>re');
    });

    test('allows custom tags', () => {
      expect(
        highlightAlgoliaHit({
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: '<em>He</em>llo t<em>he</em>re',
              },
            },
          },
        })
      ).toEqual('<em>He</em>llo t<em>he</em>re');
    });
  });

  describe('reverseHighlightAlgoliaHit', () => {
    test('returns the reverse-highlighted value of the hit', () => {
      expect(
        reverseHighlightAlgoliaHit({
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: '<mark>He</mark>llo t<mark>he</mark>re',
              },
            },
          },
        })
      ).toEqual('He<mark>llo t</mark>he<mark>re</mark>');
    });

    test('allows custom tags', () => {
      expect(
        reverseHighlightAlgoliaHit({
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
          attribute: 'title',
          hit: {
            _highlightResult: {
              title: {
                value: '<em>He</em>llo t<em>he</em>re',
              },
            },
          },
        })
      ).toEqual('He<em>llo t</em>he<em>re</em>');
    });

    test('returns the non-highlighted value when every part matches', () => {
      expect(
        reverseHighlightAlgoliaHit({
          attribute: 'title',
          hit: { _highlightResult: { title: { value: 'Hello' } } },
        })
      ).toEqual('Hello');
    });
  });

  describe('snippetAlgoliaHit', () => {
    test('returns the highlighted snippet value of the hit', () => {
      expect(
        snippetAlgoliaHit({
          attribute: 'title',
          hit: {
            _snippetResult: {
              title: {
                value: '<mark>He</mark>llo t<mark>he</mark>re',
              },
            },
          },
        })
      ).toEqual('<mark>He</mark>llo t<mark>he</mark>re');
    });

    test('allows custom tags', () => {
      expect(
        snippetAlgoliaHit({
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
          attribute: 'title',
          hit: {
            _snippetResult: {
              title: {
                value: '<em>He</em>llo t<em>he</em>re',
              },
            },
          },
        })
      ).toEqual('<em>He</em>llo t<em>he</em>re');
    });
  });
});
