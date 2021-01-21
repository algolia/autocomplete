import { parseAttribute } from '../parseAttribute';

describe('parseAttribute', () => {
  test('returns highlighting parts', () => {
    expect(
      parseAttribute({
        highlightedValue:
          '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
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

  test('concatenates similar consecutive highlighting parts', () => {
    expect(
      parseAttribute({
        highlightedValue:
          '__aa-highlight__Hello __/aa-highlight____aa-highlight__the__/aa-highlight__re __aa-highlight__people__/aa-highlight__ from earth',
      })
    ).toEqual([
      {
        isHighlighted: true,
        value: 'Hello the',
      },
      {
        isHighlighted: false,
        value: 're ',
      },
      {
        isHighlighted: true,
        value: 'people',
      },
      {
        isHighlighted: false,
        value: ' from earth',
      },
    ]);
  });
});
