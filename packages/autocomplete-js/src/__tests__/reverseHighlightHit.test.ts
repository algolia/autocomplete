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
    ).toEqual([
      expect.objectContaining({
        type: 'mark',
        props: {
          children: 'amazon ',
        },
      }),
      'fire',
      ' ',
      'tablet',
      expect.objectContaining({
        type: 'mark',
        props: {
          children: 's',
        },
      }),
    ]);
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
    ).toEqual(['amazon', ' ', 'fire', ' ', 'tablets']);
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
    ).toEqual(['amazon fire tablets']);
  });

  test('accepts custom createElement', () => {
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
        createElement(type, props, children) {
          return {
            type,
            props,
            children,
          };
        },
      })
    ).toEqual([
      expect.objectContaining({
        type: 'mark',
        props: {
          key: 0,
        },
        children: 'amazon ',
      }),
      'fire',
      ' ',
      'tablet',
      expect.objectContaining({
        type: 'mark',
        props: {
          key: 4,
        },
        children: 's',
      }),
    ]);
  });
});
