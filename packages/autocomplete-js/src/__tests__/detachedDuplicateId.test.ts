import { createMatchMedia } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

beforeEach(() => {
  document.body.innerHTML = '';
});

function getIdsInDocument() {
  return Array.from(document.querySelectorAll('[id]')).map(
    (element) => element.id
  );
}

describe('detached duplicate ids', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({ matches: true }),
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia({}),
    });
  });

  function setup(options: Partial<Parameters<typeof autocomplete>[0]> = {}) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const api = autocomplete({
      container,
      detachedMediaQuery: '',
      openOnFocus: true,
      ...options,
    });
    return { api, container };
  }

  test('renders unique ids in detached mode', () => {
    const { api } = setup();

    document
      .querySelector<HTMLButtonElement>('.aa-DetachedSearchButton')!
      .click();

    const ids = getIdsInDocument();
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    expect(duplicates).toEqual([]);

    api.destroy();
  });

  test('resolves the combobox `aria-labelledby` to the detached search button', () => {
    const { api, container } = setup();

    document
      .querySelector<HTMLButtonElement>('.aa-DetachedSearchButton')!
      .click();

    const root = container.querySelector('.aa-Autocomplete')!;
    const labelId = root.getAttribute('aria-labelledby')!;
    const trigger = document.getElementById(labelId)!;

    expect(trigger).toHaveClass('aa-DetachedSearchButton');
    // The trigger carries the accessible name users hear: the search button
    // title plus the placeholder text.
    expect(trigger).toHaveTextContent('Search');

    api.destroy();
  });

  test('resolves the input `aria-labelledby` to the detached search button', () => {
    const { api } = setup();

    document
      .querySelector<HTMLButtonElement>('.aa-DetachedSearchButton')!
      .click();

    const input = document.querySelector('.aa-Input')!;
    const labelId = input.getAttribute('aria-labelledby')!;
    const trigger = document.getElementById(labelId)!;

    expect(trigger).toHaveClass('aa-DetachedSearchButton');

    api.destroy();
  });

  test('preserves custom `getLabelProps` properties on the label', () => {
    const { api } = setup({
      getLabelProps(props: Record<string, unknown>) {
        return {
          ...props,
          class: 'custom-label-class',
          'data-custom': 'custom-value',
        };
      },
    });

    document
      .querySelector<HTMLButtonElement>('.aa-DetachedSearchButton')!
      .click();

    const label = document.querySelector('[data-custom="custom-value"]')!;

    expect(label).toHaveClass('custom-label-class');
    expect(label.tagName).toBe('LABEL');
    // The `${id}-label` id is still omitted to avoid the duplicate.
    expect(label.hasAttribute('id')).toBe(false);

    api.destroy();
  });
});

describe('inline mode label id', () => {
  test('keeps the label id unique and resolvable', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const api = autocomplete({
      container,
      openOnFocus: true,
    });

    const root = container.querySelector('.aa-Autocomplete')!;
    const labelId = root.getAttribute('aria-labelledby')!;
    const label = document.getElementById(labelId)!;

    expect(label).toHaveClass('aa-Label');
    expect(getIdsInDocument().filter((id) => id === labelId)).toHaveLength(1);

    const input = document.querySelector('.aa-Input')!;
    expect(
      document.getElementById(input.getAttribute('aria-labelledby')!)
    ).toBe(label);

    api.destroy();
  });
});
