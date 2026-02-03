import { setProperty } from '../../packages/autocomplete-js/src/utils/setProperties';

describe('setProperty eventProxy safety', () => {
  it('calls the event handler', () => {
    const dom = document.createElement('div');
    let called = false;

    setProperty(dom, 'onclick', () => {
      called = true;
    });

    dom.dispatchEvent(new Event('click'));

    expect(called).toBe(true);
  });

  it('does not throw when event is dispatched after element removal', () => {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    let called = false;

    setProperty(dom, 'onclick', () => {
      called = true;
    });

    // This situation happens when the element is removed from the dom (and is undefined)
    // or when the _listeners somehow gets deleted because something else modified the object
    delete (dom as any)._listeners;
    document.body.removeChild(dom);

    expect(() => {
      dom.dispatchEvent(new Event('click'));
    }).not.toThrow();
    expect(called).toBe(false);
  });
});
