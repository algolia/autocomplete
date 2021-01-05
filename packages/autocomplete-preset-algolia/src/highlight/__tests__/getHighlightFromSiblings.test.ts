import getHighlightFromSiblings from '../getHighlightFromSiblings';

describe('getHighlightFromSiblings', () => {
  test('returns the isHighlighted value with a missing sibling', () => {
    expect(
      getHighlightFromSiblings(
        [
          { isHighlighted: true, value: 'Amazon' },
          {
            isHighlighted: false,
            value: ' - Fire HD8 - 8&quot; - Tablet - 16GB - Wi-Fi - Black',
          },
        ],
        0
      )
    ).toEqual(true);
  });

  test('returns the isHighlighted value with both siblings', () => {
    expect(
      getHighlightFromSiblings(
        [
          { isHighlighted: false, value: 'Amazon' },
          {
            isHighlighted: true,
            value: ' - Fire HD8 - 8&quot; - Tablet - 16GB - Wi-',
          },
          { isHighlighted: false, value: 'Fi' },
          { isHighlighted: false, value: ' - ' },
          { isHighlighted: false, value: 'Black' },
        ],
        1
      )
    ).toEqual(true);
  });
});
