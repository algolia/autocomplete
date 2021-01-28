import { warnCache } from '@algolia/autocomplete-shared';

import { parseAlgoliaHitReverseSnippet } from '../parseAlgoliaHitReverseSnippet';

describe('parseAlgoliaHitReverseSnippet', () => {
  afterEach(() => {
    warnCache.current = {};
  });

  test('returns the reverse-highlighted snippet parts of the hit', () => {
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
      parseAlgoliaHitReverseSnippet({
        attribute: ['title'],
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
      parseAlgoliaHitReverseSnippet({
        attribute: ['hierarchy', 'lvl0'],
        hit: {
          objectID: '1',
          hierarchy: {
            lvl0: 'Hello there',
          },
          _snippetResult: {
            hierarchy: {
              lvl0: {
                value:
                  '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
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

  test('returns the highlighted snippet parts of the hit with a nested array attribute containing a dot', () => {
    expect(
      parseAlgoliaHitReverseSnippet({
        attribute: ['hierarchy', 'lvl0.inside'],
        hit: {
          objectID: '1',
          hierarchy: {
            'lvl0.inside': 'Hello there',
          },
          _snippetResult: {
            hierarchy: {
              'lvl0.inside': {
                value:
                  '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
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
      parseAlgoliaHitReverseSnippet({
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

  test('returns the attribute value if the attribute cannot be snippeted', () => {
    expect(
      parseAlgoliaHitReverseSnippet({
        attribute: 'description',
        hit: {
          objectID: '1',
          title: 'Hello there',
          description: 'Welcome all',
          _snippetResult: {
            title: {
              value:
                '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
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
      parseAlgoliaHitReverseSnippet({
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

  test('warns if the attribute cannot be snippeted', () => {
    expect(() => {
      parseAlgoliaHitReverseSnippet({
        attribute: 'description',
        hit: {
          objectID: '1',
          title: 'Hello there',
          description: 'Welcome all',
          _snippetResult: {
            title: {
              value:
                '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
            },
          },
        },
      });
    }).toWarnDev(
      '[Autocomplete] The attribute "description" described by the path ["description"] does not exist on the hit. Did you set it in `attributesToSnippet`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToSnippet/'
    );
  });

  test('returns empty parts if the array attribute does not exist', () => {
    expect(
      parseAlgoliaHitReverseSnippet({
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

  test('warns if the array attribute cannot be snippeted', () => {
    expect(() => {
      parseAlgoliaHitReverseSnippet({
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
      '[Autocomplete] The attribute "description" described by the path ["description"] does not exist on the hit. Did you set it in `attributesToSnippet`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToSnippet/'
    );
  });

  test('returns empty parts if the nested array attribute does not exist', () => {
    expect(
      parseAlgoliaHitReverseSnippet({
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

  test('warns if the nested array attribute cannot be snippeted', () => {
    expect(() => {
      parseAlgoliaHitReverseSnippet({
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
      '[Autocomplete] The attribute "title.description" described by the path ["title","description"] does not exist on the hit. Did you set it in `attributesToSnippet`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToSnippet/'
    );
  });

  test('warns if the nested array attribute containing a dot does not exist', () => {
    expect(() => {
      parseAlgoliaHitReverseSnippet({
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
      '[Autocomplete] The attribute "hierarchy.lvl1.inside" described by the path ["hierarchy","lvl1.inside"] does not exist on the hit. Did you set it in `attributesToSnippet`?' +
        '\nSee https://www.algolia.com/doc/api-reference/api-parameters/attributesToSnippet/'
    );
  });
});
