import { reverseHighlightHit } from '../highlight';

describe('reverseHighlightHit', () => {
  test('returns a reversed partially highlighted hit', () => {
    expect(
      reverseHighlightHit({
        hit: {
          objectID: 'amazon fire tablets',
          query: 'amazon fire tablets',
          _highlightResult: {
            query: {
              fullyHighlighted: false,
              matchLevel: 'full',
              matchedWords: ['fire', 'tablet'],
              value:
                'amazon __aa-highlight__fire__/aa-highlight__ __aa-highlight__tablet__/aa-highlight__s',
            },
          },
        },
        attribute: 'query',
      })
    ).toMatchInlineSnapshot(`"<mark>amazon </mark>fire tablet<mark>s</mark>"`);
  });

  test('returns a reversed fully highlighted hit', () => {
    expect(
      reverseHighlightHit({
        hit: {
          objectID: 'amazon fire tablets',
          query: 'amazon fire tablets',
          _highlightResult: {
            query: {
              fullyHighlighted: true,
              matchLevel: 'full',
              matchedWords: ['amazon', 'fire', 'tablet'],
              value:
                '__aa-highlight__amazon__/aa-highlight__ __aa-highlight__fire__/aa-highlight__ __aa-highlight__tablets__/aa-highlight__',
            },
          },
        },
        attribute: 'query',
      })
    ).toMatchInlineSnapshot(`"amazon fire tablets"`);
  });

  test('returns a reversed empty highlighted query hit', () => {
    expect(
      reverseHighlightHit({
        hit: {
          objectID: 'amazon fire tablets',
          query: 'amazon fire tablets',
          _highlightResult: {
            query: {
              fullyHighlighted: false,
              matchLevel: 'none',
              matchedWords: [],
              value: 'amazon fire tablets',
            },
          },
        },
        attribute: 'query',
      })
    ).toMatchInlineSnapshot(`"amazon fire tablets"`);
  });
});
