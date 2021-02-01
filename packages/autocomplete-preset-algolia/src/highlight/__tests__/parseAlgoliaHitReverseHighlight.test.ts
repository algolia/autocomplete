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
    ).toEqual([
      {
        isHighlighted: false,
        value: 'He',
      },
      {
        isHighlighted: true,
        value: 'llo t',
      },
      {
        isHighlighted: false,
        value: 'he',
      },
      {
        isHighlighted: true,
        value: 're',
      },
    ]);
  });

  test('returns the reverse-highlighted parts of the hit with an array attribute', () => {
    expect(
      parseAlgoliaHitReverseHighlight({
        attribute: ['title'],
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
    ).toEqual([
      {
        isHighlighted: false,
        value: 'He',
      },
      {
        isHighlighted: true,
        value: 'llo t',
      },
      {
        isHighlighted: false,
        value: 'he',
      },
      {
        isHighlighted: true,
        value: 're',
      },
    ]);
  });

  test('returns the reverse-highlighted parts of the hit with a nested array attribute', () => {
    expect(
      parseAlgoliaHitReverseHighlight({
        attribute: ['hierarchy', 'lvl0'],
        hit: {
          objectID: '1',
          hierarchy: {
            lvl0: 'Hello there',
          },
          _highlightResult: {
            hierarchy: {
              lvl0: {
                value:
                  '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
                matchLevel: 'partial',
                matchedWords: [],
                fullyHighlighted: false,
              },
            },
          },
        },
      })
    ).toEqual([
      {
        isHighlighted: false,
        value: 'He',
      },
      {
        isHighlighted: true,
        value: 'llo t',
      },
      {
        isHighlighted: false,
        value: 'he',
      },
      {
        isHighlighted: true,
        value: 're',
      },
    ]);
  });

  test('returns the highlighted parts of the hit with a nested array attribute containing a dot', () => {
    expect(
      parseAlgoliaHitReverseHighlight({
        attribute: ['hierarchy', 'lvl0.inside'],
        hit: {
          objectID: '1',
          hierarchy: {
            'lvl0.inside': 'Hello there',
          },
          _highlightResult: {
            hierarchy: {
              'lvl0.inside': {
                value:
                  '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
                matchLevel: 'partial',
                matchedWords: [],
                fullyHighlighted: false,
              },
            },
          },
        },
      })
    ).toEqual([
      {
        isHighlighted: false,
        value: 'He',
      },
      {
        isHighlighted: true,
        value: 'llo t',
      },
      {
        isHighlighted: false,
        value: 'he',
      },
      {
        isHighlighted: true,
        value: 're',
      },
    ]);
  });

  test('returns the non-highlighted parts when every part matches', () => {
    expect(
      parseAlgoliaHitReverseHighlight({
        attribute: 'title',
        hit: {
          objectID: '1',
          title: 'Hello there',
          _highlightResult: {
            title: { value: '__aa-highlight__Hello there__/aa-highlight__' },
          },
        },
      })
    ).toEqual([{ isHighlighted: false, value: 'Hello there' }]);
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
      '[Autocomplete] The attribute "description" described by the path ["description"] does not exist on the hit. Did you set it in `attributesToHighlight`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToHighlight/'
    );
  });

  test('returns empty parts if the array attribute does not exist', () => {
    expect(
      parseAlgoliaHitReverseHighlight({
        attribute: ['description'],
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

  test('warns if the array attribute cannot be highlighted', () => {
    expect(() => {
      parseAlgoliaHitReverseHighlight({
        attribute: ['description'],
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
      '[Autocomplete] The attribute "description" described by the path ["description"] does not exist on the hit. Did you set it in `attributesToHighlight`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToHighlight/'
    );
  });

  test('returns empty parts if the nested array attribute does not exist', () => {
    expect(
      parseAlgoliaHitReverseHighlight({
        attribute: ['title', 'description'],
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

  test('warns if the nested array attribute cannot be highlighted', () => {
    expect(() => {
      parseAlgoliaHitReverseHighlight({
        attribute: ['title', 'description'],
        hit: {
          objectID: '1',
          title: 'Hello there',
          description: 'Welcome all',
          _highlightResult: {
            title: {
              noDescription: {
                value:
                  '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
                matchLevel: 'partial',
                matchedWords: [],
                fullyHighlighted: false,
              },
            },
          },
        },
      });
    }).toWarnDev(
      '[Autocomplete] The attribute "title.description" described by the path ["title","description"] does not exist on the hit. Did you set it in `attributesToHighlight`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToHighlight/'
    );
  });

  test('warns if the nested array attribute containing a dot does not exist', () => {
    expect(() => {
      parseAlgoliaHitReverseHighlight({
        attribute: ['hierarchy', 'lvl1.inside'],
        hit: {
          objectID: '1',
          hierarchy: {
            'lvl0.inside': 'Hello there',
          },
          _highlightResult: {
            hierarchy: {
              'lvl0.inside': {
                value:
                  '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
                matchLevel: 'partial',
                matchedWords: [],
                fullyHighlighted: false,
              },
            },
          },
        },
      });
    }).toWarnDev(
      '[Autocomplete] The attribute "hierarchy.lvl1.inside" described by the path ["hierarchy","lvl1.inside"] does not exist on the hit. Did you set it in `attributesToHighlight`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToHighlight/'
    );
  });
});
