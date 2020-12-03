import userEvent from '@testing-library/user-event';

import { createAutocomplete } from '../createAutocomplete';

function defer<TValue>(fn: () => TValue, timeout: number) {
  return new Promise<TValue>((resolve) => {
    setTimeout(() => resolve(fn()), timeout);
  });
}

describe('stallThreshold', () => {
  test('sets the experience to stalled after 300ms', async () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      onStateChange,
      getSources() {
        return defer(() => {
          return [
            {
              getItems() {
                return [{ label: '1' }, { label: 2 }];
              },
            },
          ];
        }, 500);
      },
    });

    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('input', inputProps.onChange);
    document.body.appendChild(inputElement);

    userEvent.type(inputElement, 'a');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({ status: 'loading' }),
    });

    await defer(() => {}, 300);

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({ status: 'stalled' }),
    });

    await defer(() => {}, 200);

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({ status: 'idle' }),
    });
  });

  test('allows custom stall threshold', async () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      stallThreshold: 400,
      onStateChange,
      getSources() {
        return defer(() => {
          return [
            {
              getItems() {
                return [{ label: '1' }, { label: 2 }];
              },
            },
          ];
        }, 500);
      },
    });

    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('input', inputProps.onChange);
    document.body.appendChild(inputElement);

    userEvent.type(inputElement, 'a');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({ status: 'loading' }),
    });

    await defer(() => {}, 300);

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({ status: 'loading' }),
    });

    await defer(() => {}, 100);

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({ status: 'stalled' }),
    });

    await defer(() => {}, 100);

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({ status: 'idle' }),
    });
  });
});
