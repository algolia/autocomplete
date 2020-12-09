import { isOrContainsNode } from '../isOrContainsNode';

describe('isOrContainsNode', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('returns true with same node', () => {
    const parent = document.createElement('div');
    const child = parent;
    document.body.append(parent, child);

    expect(isOrContainsNode(parent, child)).toEqual(true);
  });

  test('returns true with child belonging to parent', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);
    document.body.append(parent);

    expect(isOrContainsNode(parent, child)).toEqual(true);
  });

  test('returns false with child not belonging to parent', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    document.body.appendChild(child);
    document.body.append(parent);

    expect(isOrContainsNode(parent, child)).toEqual(false);
  });
});
