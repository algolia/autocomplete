import { isPartHighlighted } from '../isPartHighlighted';

describe('isPartHighlighted', () => {
  test('returns the isHighlighted value with a missing sibling', () => {
    expect(
      isPartHighlighted(
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
      isPartHighlighted(
        [
          { isHighlighted: true, value: 'Amazon' },
          { isHighlighted: false, value: ' - ' },
          { isHighlighted: true, value: 'Fire' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: true, value: 'TV' },
        ],
        1
      )
    ).toEqual(true);
  });
});
