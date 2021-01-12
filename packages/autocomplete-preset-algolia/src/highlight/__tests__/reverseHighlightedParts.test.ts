import { reverseHighlightedParts } from '../reverseHighlightedParts';

describe('reverseHighlightedParts', () => {
  test('returns a reversed partially highlighted parts array', () => {
    expect(
      reverseHighlightedParts([
        { isHighlighted: true, value: 'amazon ((fire' },
        { isHighlighted: false, value: 'tv)) tablet??' },
      ])
    ).toEqual([
      { isHighlighted: false, value: 'amazon ((fire' },
      { isHighlighted: true, value: 'tv)) tablet??' },
    ]);
  });

  test('returns a reversed fully highlighted parts array', () => {
    expect(
      reverseHighlightedParts([
        { isHighlighted: true, value: 'amazon ((fire tv)) tablet??' },
      ])
    ).toEqual([{ isHighlighted: false, value: 'amazon ((fire tv)) tablet??' }]);
  });

  test('returns a reversed highlighted parts array based on sibling highlighting', () => {
    expect(
      reverseHighlightedParts([
        { isHighlighted: true, value: 'amazon ((fire tv)) tablet' },
        { isHighlighted: false, value: '??' },
      ])
    ).toEqual([
      { isHighlighted: false, value: 'amazon ((fire tv)) tablet' },
      { isHighlighted: false, value: '??' },
    ]);
  });
});
