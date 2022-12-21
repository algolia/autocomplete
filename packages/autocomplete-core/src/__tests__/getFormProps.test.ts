import { createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getFormProps', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('forwards the remaining props', () => {
    const { getFormProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const formProps = getFormProps({ inputElement, customProps: {} });

    expect(formProps).toEqual(expect.objectContaining({ customProps: {} }));
  });

  test('returns an empty action', () => {
    const { getFormProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const formProps = getFormProps({ inputElement });

    expect(formProps.action).toEqual('');
  });

  test('returns noValidate to true', () => {
    const { getFormProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const formProps = getFormProps({ inputElement });

    expect(formProps.noValidate).toEqual(true);
  });

  test('returns search role', () => {
    const { getFormProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const formProps = getFormProps({ inputElement });

    expect(formProps.role).toEqual('search');
  });

  describe('onSubmit', () => {
    test('prevents the default event', () => {
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {}
      );
      const formProps = getFormProps({ inputElement });
      const event = { ...new Event('submit'), preventDefault: jest.fn() };

      formProps.onSubmit(event);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    test('calls user-provided onSubmit', () => {
      const onSubmit = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        { onSubmit }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onSubmit(new Event('submit'));

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    test('blurs the input', () => {
      const onSubmit = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        { onSubmit }
      );
      const formProps = getFormProps({ inputElement });

      document.body.appendChild(inputElement);

      inputElement.focus();
      formProps.onSubmit(new Event('submit'));

      expect(inputElement).not.toBe(document.activeElement);
    });

    test('does not blur the input when not provided', () => {
      const onSubmit = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        { onSubmit }
      );
      const formProps = getFormProps({ inputElement: null });

      document.body.appendChild(inputElement);

      inputElement.focus();
      formProps.onSubmit(new Event('submit'));

      expect(inputElement).toBe(document.activeElement);
    });

    test('closes the panel', () => {
      const onStateChange = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          initialState: {
            isOpen: true,
          },
        }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onSubmit(new Event('submit'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            isOpen: false,
          }),
        })
      );
    });

    test('sets the activeItemId to null', () => {
      const onStateChange = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          initialState: {
            activeItemId: 0,
          },
        }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onSubmit(new Event('submit'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            activeItemId: null,
          }),
        })
      );
    });

    test('sets the status to idle', () => {
      const onStateChange = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          initialState: {
            status: 'loading',
          },
        }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onSubmit(new Event('submit'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            status: 'idle',
          }),
        })
      );
    });
  });

  describe('onReset', () => {
    test('prevents the default event', () => {
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {}
      );
      const formProps = getFormProps({ inputElement });
      const event = { ...new Event('reset'), preventDefault: jest.fn() };

      formProps.onReset(event);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    test('calls user-provided onReset', () => {
      const onReset = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        { onReset }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onReset(new Event('reset'));

      expect(onReset).toHaveBeenCalledTimes(1);
    });

    test('focuses the input', () => {
      const onReset = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        { onReset }
      );
      const formProps = getFormProps({ inputElement });

      document.body.appendChild(inputElement);

      formProps.onReset(new Event('reset'));

      expect(inputElement).toBe(document.activeElement);
    });

    test('closes the panel without openOnFocus', () => {
      const onStateChange = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          initialState: {
            isOpen: true,
          },
        }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onReset(new Event('reset'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            isOpen: false,
          }),
        })
      );
    });

    test('opens the panel with openOnFocus', () => {
      const onStateChange = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          openOnFocus: true,
          shouldPanelOpen: () => true,
          initialState: {
            isOpen: true,
          },
        }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onReset(new Event('reset'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            isOpen: true,
          }),
        })
      );
    });

    test('sets the activeItemId to null without openOnFocus', () => {
      const onStateChange = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          initialState: {
            activeItemId: 0,
          },
        }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onReset(new Event('reset'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            activeItemId: null,
          }),
        })
      );
    });

    test('sets the activeItemId to defaultActiveItemId with openOnFocus', () => {
      const onStateChange = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {
          defaultActiveItemId: 0,
          openOnFocus: true,
          onStateChange,
          initialState: {
            activeItemId: null,
          },
        }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onReset(new Event('reset'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            activeItemId: 0,
          }),
        })
      );
    });

    test('sets the status to idle', () => {
      const onStateChange = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          initialState: {
            status: 'loading',
          },
        }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onReset(new Event('reset'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            status: 'idle',
          }),
        })
      );
    });

    test('resets the query', () => {
      const onStateChange = jest.fn();
      const { getFormProps, inputElement } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          initialState: {
            query: 'a',
          },
        }
      );
      const formProps = getFormProps({ inputElement });

      formProps.onReset(new Event('reset'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            query: '',
          }),
        })
      );
    });
  });
});
