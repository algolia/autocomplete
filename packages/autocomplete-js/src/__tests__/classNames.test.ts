import { waitFor } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';

describe('classNames', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('merges with default CSS classes', async () => {
    autocomplete({
      container,
      classNames: {
        form: 'aa-test-Form',
        input: 'aa-test-Input',
      },
    });

    await waitFor(() => {
      expect(
        document.querySelector('.aa-Form.aa-test-Form')
      ).toBeInTheDocument();
      expect(
        document.querySelector('.aa-Input.aa-test-Input')
      ).toBeInTheDocument();
    });
  });

  test('dedupes CSS classes', async () => {
    autocomplete({
      container,
      classNames: {
        form: 'aa-Form',
        input: 'aa-Input',
      },
    });

    await waitFor(() => {
      const form = document.querySelector('.aa-Form');
      const input = document.querySelector('.aa-Input');

      expect(form).toBeInTheDocument();
      expect(form.className).toEqual('aa-Form');
      expect(input).toBeInTheDocument();
      expect(input.className).toEqual('aa-Input');
    });
  });
});
