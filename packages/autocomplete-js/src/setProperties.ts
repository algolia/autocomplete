// Taken from Preact
// https://github.com/preactjs/preact/blob/6ab49d9020740127577bf4af66bf63f4af7f9fee/src/diff/props.js#L58-L151
function setProperty(element: HTMLElement | Window, name: string, value: any) {
  let useCapture: boolean;
  let nameLower: string;

  // Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
  if (name[0] === 'o' && name[1] === 'n') {
    useCapture = name !== (name = name.replace(/Capture$/, ''));
    nameLower = name.toLowerCase();
    if (nameLower in element) name = nameLower;
    name = name.slice(2);

    if (value) {
      element.addEventListener(name, value, useCapture);
    } else {
      element.removeEventListener(name, value, useCapture);
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
    name in element
  ) {
    element[name] = value === null ? '' : value;
  } else if (
    typeof value !== 'function' &&
    name !== 'dangerouslySetInnerHTML'
  ) {
    if (
      value === null ||
      (value === false &&
        // ARIA-attributes have a different notion of boolean values.
        // The value `false` is different from the attribute not
        // existing on the DOM, so we can't remove it. For non-boolean
        // ARIA-attributes we could treat false as a removal, but the
        // amount of exceptions would cost us too many bytes. On top of
        // that other VDOM frameworks also always stringify `false`.
        !/^ar/.test(name))
    ) {
      (element as HTMLElement).removeAttribute(name);
    } else {
      (element as HTMLElement).setAttribute(name, value);
    }
  }
}

function getNormalizedName(name: string): string {
  switch (name) {
    case 'onChange':
      return 'onInput';
    default:
      return name;
  }
}

export function setProperties(dom: HTMLElement | Window, props: object): void {
  // eslint-disable-next-line guard-for-in
  for (const name in props) {
    setProperty(dom, getNormalizedName(name), props[name]);
  }
}
