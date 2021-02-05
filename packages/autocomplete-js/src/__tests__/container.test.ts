import { waitFor } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';

describe('container', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('with element returns the element', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    autocomplete({ container });

    await waitFor(() => {
      expect(document.querySelector('.aa-Autocomplete')).toBeInTheDocument();
    });
  });

  test('with a string returns the element if exists', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    autocomplete({ container: 'div' });

    await waitFor(() => {
      expect(document.querySelector('.aa-Autocomplete')).toBeInTheDocument();
    });
  });

  test('with a string throws invariant if does not exist', () => {
    expect(() => {
      autocomplete({ container: 'div' });
    }).toThrow('The element "div" is not in the document.');
  });

  test('throws invariant with an input', () => {
    const container = document.createElement('input');
    document.body.appendChild(container);

    expect(() => {
      autocomplete({ container });
    }).toThrow(
      'The `container` option does not support `input` elements. You need to change the container to a `div`.'
    );
  });
});
