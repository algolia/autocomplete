import { reverseHighlightHit } from '../highlight';

describe('reverseHighlightHit', () => {
  test('returns a reversed partially highlighted Recent Search hit', () => {
    expect(
      reverseHighlightHit({
        hit: {
          _highlightResult: {
            query: {
              value:
                '__aa-highlight__amazon ((fire__/aa-highlight__ tv)) tablet??',
            },
          },
        } as any,
        attribute: 'query',
      })
    ).toMatchInlineSnapshot(`"amazon ((fire<mark> tv)) tablet??</mark>"`);
  });

  test('returns a reversed fully highlighted Recent Search hit', () => {
    expect(
      reverseHighlightHit({
        hit: {
          _highlightResult: {
            query: {
              value:
                '__aa-highlight__amazon ((fire tv)) tablet??__/aa-highlight__',
            },
          },
        } as any,
        attribute: 'query',
      })
    ).toMatchInlineSnapshot(`"amazon ((fire tv)) tablet??"`);
  });

  test('returns a reversed empty highlighted query Recent Search hit', () => {
    expect(
      reverseHighlightHit({
        hit: {
          _highlightResult: {
            query: {
              value: 'amazon ((fire tv)) tablet??',
            },
          },
        } as any,
        attribute: 'query',
      })
    ).toMatchInlineSnapshot(`"amazon ((fire tv)) tablet??"`);
  });

  test('returns a reversed partially highlighted Algolia hit', () => {
    expect(
      reverseHighlightHit({
        hit: {
          objectID: 'amazon fire tablets',
          _highlightResult: {
            query: {
              fullyHighlighted: false,
              matchLevel: 'full',
              matchedWords: ['fire', 'tablet'],
              value:
                'amazon __aa-highlight__fire__/aa-highlight__ __aa-highlight__tablet__/aa-highlight__s',
            },
          },
        } as any,
        attribute: 'query',
      })
    ).toMatchInlineSnapshot(`"<mark>amazon </mark>fire tablet<mark>s</mark>"`);
  });

  test('returns a reversed fully highlighted Algolia hit', () => {
    expect(
      reverseHighlightHit({
        hit: {
          objectID: 'amazon fire tablets',
          _highlightResult: {
            query: {
              fullyHighlighted: true,
              matchLevel: 'full',
              matchedWords: ['amazon', 'fire', 'tablet'],
              value:
                '__aa-highlight__amazon__/aa-highlight__ __aa-highlight__fire__/aa-highlight__ __aa-highlight__tablets__/aa-highlight__',
            },
          },
        } as any,
        attribute: 'query',
      })
    ).toMatchInlineSnapshot(`"amazon fire tablets"`);
  });

  test('returns a reversed empty highlighted query Algolia hit', () => {
    expect(
      reverseHighlightHit({
        hit: {
          objectID: 'amazon fire tablets',
          _highlightResult: {
            query: {
              fullyHighlighted: false,
              matchLevel: 'none',
              matchedWords: [],
              value: 'amazon fire tablets',
            },
          },
        } as any,
        attribute: 'query',
      })
    ).toMatchInlineSnapshot(`"amazon fire tablets"`);
  });
});
