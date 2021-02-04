import { warnCache } from '@algolia/autocomplete-shared';

import { parseAlgoliaHitSnippet } from '../parseAlgoliaHitSnippet';

describe('parseAlgoliaHitSnippet', () => {
  afterEach(() => {
    warnCache.current = {};
  });

  test('returns the highlighted snippet parts of the hit', () => {
    expect(
      parseAlgoliaHitSnippet({
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

  test('returns the highlighted snippet parts of the hit with an array attribute', () => {
    expect(
      parseAlgoliaHitSnippet({
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

  test('returns the highlighted snippet parts of the hit with a nested array attribute', () => {
    expect(
      parseAlgoliaHitSnippet({
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

  test('returns the highlighted snippet parts of the hit with a nested array attribute containing a dot', () => {
    expect(
      parseAlgoliaHitSnippet({
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

  test('returns the attribute value if the attribute cannot be snippeted', () => {
    expect(
      parseAlgoliaHitSnippet({
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
      parseAlgoliaHitSnippet({
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
      parseAlgoliaHitSnippet({
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
      parseAlgoliaHitSnippet({
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
      parseAlgoliaHitSnippet({
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
      parseAlgoliaHitSnippet({
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
      parseAlgoliaHitSnippet({
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
      parseAlgoliaHitSnippet({
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
