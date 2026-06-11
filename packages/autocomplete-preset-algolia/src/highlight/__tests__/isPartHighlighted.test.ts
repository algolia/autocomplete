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

  test('does not inherit sibling state when siblings disagree', () => {
    // The separator (index 1) sits between a highlighted ("Amazon") and a
    // non-highlighted ("Fire") part. Since the siblings disagree, the separator
    // must keep its own `isHighlighted` value rather than being treated as
    // highlighted-from-siblings.
    expect(
      isPartHighlighted(
        [
          { isHighlighted: true, value: 'Amazon' },
          { isHighlighted: false, value: ' - ' },
          { isHighlighted: false, value: 'Fire' },
        ],
        1
      )
    ).toEqual(false);
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

  // Japanese (俺はジャイアン): start / middle / end

  test('does not treat Japanese text as a separator at the start (俺はジャイアン)', () => {
    expect(
      isPartHighlighted(
        [
          { isHighlighted: false, value: '俺は' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: true, value: 'ジャイアン' },
        ],
        0
      )
    ).toEqual(false);
  });

  test('does not treat Japanese text as a separator in the middle (俺はジャイアンだ)', () => {
    expect(
      isPartHighlighted(
        [
          { isHighlighted: true, value: '俺は' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: false, value: 'ジャイアン' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: true, value: 'だ' },
        ],
        2
      )
    ).toEqual(false);
  });

  test('does not treat Japanese text as a separator at the end (俺はジャイアンだ)', () => {
    expect(
      isPartHighlighted(
        [
          { isHighlighted: true, value: '俺は' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: true, value: 'ジャイアン' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: false, value: 'だ' },
        ],
        4
      )
    ).toEqual(false);
  });

  // Cyrillic (regression #1317): start / middle / end

  test('does not treat Cyrillic text as a separator at the start (regression #1317)', () => {
    expect(
      isPartHighlighted(
        [
          { isHighlighted: false, value: 'привет' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: true, value: 'мир' },
        ],
        0
      )
    ).toEqual(false);
  });

  test('does not treat Cyrillic text as a separator in the middle (regression #1317)', () => {
    expect(
      isPartHighlighted(
        [
          { isHighlighted: true, value: 'привет' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: false, value: 'мир' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: true, value: 'привет' },
        ],
        2
      )
    ).toEqual(false);
  });

  test('does not treat Cyrillic text as a separator at the end (regression #1317)', () => {
    expect(
      isPartHighlighted(
        [
          { isHighlighted: true, value: 'привет' },
          { isHighlighted: false, value: ' ' },
          { isHighlighted: false, value: 'мир' },
        ],
        2
      )
    ).toEqual(false);
  });
});
