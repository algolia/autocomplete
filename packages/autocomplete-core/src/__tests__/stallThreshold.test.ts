import userEvent from '@testing-library/user-event';

import { createSource, defer } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('stallThreshold', () => {
  test('sets the experience to stalled after 300ms', async () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      onStateChange,
      getSources() {
        return defer(() => {
          return [
            createSource({
              getItems() {
                return [{ label: '1' }, { label: 2 }];
              },
            }),
          ];
        }, 500);
      },
    });

    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('input', inputProps.onChange);
    document.body.appendChild(inputElement);

    userEvent.type(inputElement, 'a');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ status: 'loading' }),
      })
    );

    await defer(() => {}, 300);

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ status: 'stalled' }),
      })
    );

    await defer(() => {}, 200);

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ status: 'idle' }),
      })
    );
  });

  test('allows custom stall threshold', async () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      stallThreshold: 400,
      onStateChange,
      getSources() {
        return defer(() => {
          return [
            createSource({
              getItems() {
                return [{ label: '1' }, { label: 2 }];
              },
            }),
          ];
        }, 500);
      },
    });

    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('input', inputProps.onChange);
    document.body.appendChild(inputElement);

    userEvent.type(inputElement, 'a');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ status: 'loading' }),
      })
    );

    await defer(() => {}, 300);

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ status: 'loading' }),
      })
    );

    await defer(() => {}, 100);

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ status: 'stalled' }),
      })
    );

    await defer(() => {}, 100);

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ status: 'idle' }),
      })
    );
  });
});
