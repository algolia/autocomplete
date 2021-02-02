import { getHTMLElement } from '../getHTMLElement';

describe('getHTMLElement', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('with element returns the element', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    expect(getHTMLElement(element)).toEqual(element);
  });

  test('with a string returns the element if exists', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    expect(getHTMLElement('div')).toEqual(element);
  });

  test('with a string throws invariant if does not exist', () => {
    expect(() => {
      getHTMLElement('div');
    }).toThrow('The element "div" is not in the document.');
  });
});
