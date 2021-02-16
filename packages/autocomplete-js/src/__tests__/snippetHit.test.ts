import { snippetHit } from '../highlight';

describe('snippetHit', () => {
  test('returns a snippeted hit', () => {
    expect(
      snippetHit({
        hit: {
          objectID: 'amazon fire tablets',
          query: 'amazon fire tablets',
          _snippetResult: {
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
      'amazon ',
      expect.objectContaining({
        type: 'mark',
        props: {
          children: 'fire',
        },
      }),
      ' ',
      expect.objectContaining({
        type: 'mark',
        props: {
          children: 'tablet',
        },
      }),
      's',
    ]);
  });

  test('accepts custom createElement', () => {
    expect(
      snippetHit({
        hit: {
          objectID: 'amazon fire tablets',
          query: 'amazon fire tablets',
          _snippetResult: {
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
      'amazon ',
      expect.objectContaining({
        type: 'mark',
        props: {
          key: 1,
        },
        children: 'fire',
      }),
      ' ',
      expect.objectContaining({
        type: 'mark',
        props: {
          key: 3,
        },
        children: 'tablet',
      }),
      's',
    ]);
  });
});
