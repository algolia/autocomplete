/* eslint-disable */

/**
 * Touch-specific event aliases
 *
 * See https://w3c.github.io/touch-events/#extensions-to-the-globaleventhandlers-mixin
 */
const TOUCH_EVENTS_ALIASES = [
  'ontouchstart',
  'ontouchend',
  'ontouchmove',
  'ontouchcancel',
];

/*
 * Taken from Preact
 *
 * See https://github.com/preactjs/preact/blob/6ab49d9020740127577bf4af66bf63f4af7f9fee/src/diff/props.js#L58-L151
 */

function setStyle(style: object, key: string, value: any) {
  if (value === null) {
    style[key] = '';
  } else if (typeof value !== 'number') {
    style[key] = value;
  } else {
    style[key] = value + 'px';
  }
}

/**
 * Proxy an event to hooked event handlers
 */
function eventProxy(this: any, event: Event) {
  this._listeners[event.type](event);
}

/**
 * Set a property value on a DOM node
 */
export function setProperty(dom: HTMLElement, name: string, value: any) {
  let useCapture: boolean;
  let nameLower: string;
  let oldValue = dom[name];

  if (name === 'style') {
    if (typeof value == 'string') {
      (dom as any).style = value;
    } else {
      if (value === null) {
        (dom as any).style = '';
      } else {
        for (name in value) {
          if (!oldValue || value[name] !== oldValue[name]) {
            setStyle(dom.style, name, value[name]);
          }
        }
      }
    }
  }
  // Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
  else if (name[0] === 'o' && name[1] === 'n') {
    useCapture = name !== (name = name.replace(/Capture$/, ''));
    nameLower = name.toLowerCase();
    if (nameLower in dom || TOUCH_EVENTS_ALIASES.includes(nameLower))
      name = nameLower;
    name = name.slice(2);

    if (!(dom as any)._listeners) (dom as any)._listeners = {};
    (dom as any)._listeners[name] = value;

    if (value) {
      if (!oldValue) dom.addEventListener(name, eventProxy, useCapture);
    } else {
      dom.removeEventListener(name, eventProxy, useCapture);
    }
  } else if (
    name !== 'list' &&
    name !== 'tagName' &&
    // HTMLButtonElement.form and HTMLInputElement.form are read-only but can be set using
    // setAttribute
    name !== 'form' &&
    name !== 'type' &&
    name !== 'size' &&
    name !== 'download' &&
    name !== 'href' &&
    name in dom
  ) {
    dom[name] = value == null ? '' : value;
  } else if (typeof value != 'function' && name !== 'dangerouslySetInnerHTML') {
    if (
      value == null ||
      (value === false &&
        // ARIA-attributes have a different notion of boolean values.
        // The value `false` is different from the attribute not
        // existing on the DOM, so we can't remove it. For non-boolean
        // ARIA-attributes we could treat false as a removal, but the
        // amount of exceptions would cost us too many bytes. On top of
        // that other VDOM frameworks also always stringify `false`.
        !/^ar/.test(name))
    ) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, value);
    }
  }
}

function getNormalizedName(name: string): string {
  switch (name) {
    case 'onChange':
      return 'onInput';
    // see: https://github.com/preactjs/preact/issues/1978
    case 'onCompositionEnd':
      return 'oncompositionend';
    default:
      return name;
  }
}

export function setProperties(dom: HTMLElement, props: object): void {
  for (const name in props) {
    setProperty(dom, getNormalizedName(name), props[name]);
  }
}

export function setPropertiesWithoutEvents(
  dom: HTMLElement,
  props: object
): void {
  for (const name in props) {
    if (!(name[0] === 'o' && name[1] === 'n')) {
      setProperty(dom, getNormalizedName(name), props[name]);
    }
  }
}
