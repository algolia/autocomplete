import { setProperties, setPropertiesWithoutEvents } from '../setProperties';

describe('setProperties', () => {
  afterEach(() => {
    delete (Object.prototype as any).innerHTML;
    delete (Object.prototype as any).color;
  });

  test('sets own properties on the element', () => {
    const element = document.createElement('div');

    setProperties(element, { id: 'root', hidden: true });

    expect(element.id).toBe('root');
    expect(element.hidden).toBe(true);
  });

  test('ignores properties inherited from Object.prototype', () => {
    const element = document.createElement('div');
    (Object.prototype as any).innerHTML = '<img src=x>';

    setProperties(element, { id: 'root' });

    expect(element.id).toBe('root');
    expect(element.innerHTML).toBe('');
  });

  test('ignores style properties inherited from Object.prototype', () => {
    const element = document.createElement('div');
    (Object.prototype as any).color = 'red';

    setProperties(element, { style: { display: 'none' } });

    expect(element.style.display).toBe('none');
    expect(element.style.color).toBe('');
  });
});

describe('setPropertiesWithoutEvents', () => {
  afterEach(() => {
    delete (Object.prototype as any).innerHTML;
  });

  test('ignores properties inherited from Object.prototype', () => {
    const element = document.createElement('div');
    (Object.prototype as any).innerHTML = '<img src=x>';

    setPropertiesWithoutEvents(element, { id: 'root' });

    expect(element.id).toBe('root');
    expect(element.innerHTML).toBe('');
  });
});
