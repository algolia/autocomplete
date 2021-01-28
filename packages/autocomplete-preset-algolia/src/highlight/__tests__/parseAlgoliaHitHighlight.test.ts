import { warnCache } from '@algolia/autocomplete-shared';

import { parseAlgoliaHitHighlight } from '../parseAlgoliaHitHighlight';

describe('parseAlgoliaHitHighlight', () => {
  afterEach(() => {
    warnCache.current = {};
  });

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
    ).toEqual([
      {
        isHighlighted: true,
        value: 'He',
      },
      {
        isHighlighted: false,
        value: 'llo t',
      },
      {
        isHighlighted: true,
        value: 'he',
      },
      {
        isHighlighted: false,
        value: 're',
      },
    ]);
  });

  test('returns the highlighted parts of the hit with an array attribute', () => {
    expect(
      parseAlgoliaHitHighlight({
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
        isHighlighted: true,
        value: 'He',
      },
      {
        isHighlighted: false,
        value: 'llo t',
      },
      {
        isHighlighted: true,
        value: 'he',
      },
      {
        isHighlighted: false,
        value: 're',
      },
    ]);
  });

  test('returns the highlighted parts of the hit with a nested array attribute', () => {
    expect(
      parseAlgoliaHitHighlight({
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
        isHighlighted: true,
        value: 'He',
      },
      {
        isHighlighted: false,
        value: 'llo t',
      },
      {
        isHighlighted: true,
        value: 'he',
      },
      {
        isHighlighted: false,
        value: 're',
      },
    ]);
  });

  test('returns the highlighted parts of the hit with a nested array attribute containing a dot', () => {
    expect(
      parseAlgoliaHitHighlight({
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
        isHighlighted: true,
        value: 'He',
      },
      {
        isHighlighted: false,
        value: 'llo t',
      },
      {
        isHighlighted: true,
        value: 'he',
      },
      {
        isHighlighted: false,
        value: 're',
      },
    ]);
  });

  test('returns the attribute value if the attribute cannot be highlighted', () => {
    expect(
      parseAlgoliaHitHighlight({
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
      parseAlgoliaHitHighlight({
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
      parseAlgoliaHitHighlight({
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
      parseAlgoliaHitHighlight({
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
      parseAlgoliaHitHighlight({
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
      parseAlgoliaHitHighlight({
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
      parseAlgoliaHitHighlight({
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
      parseAlgoliaHitHighlight({
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
