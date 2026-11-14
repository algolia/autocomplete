import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createRedirectUrlPlugin } from '@algolia/autocomplete-plugin-redirect-url';

import userEvent from '@testing-library/user-event';

import {
  createPlayground,
  runAllMicroTasks,
  createSource,
  defer,
} from '../../../../test/utils';
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

    describe.each([true, 1000])(
      'a plugin is configured with the option "awaitSubmit: () => %s"',
      (timeout) => {
        test('should await pending requests before triggering the submit event', async () => {
          const plugins = [
            createRedirectUrlPlugin({ awaitSubmit: () => timeout }),
            createAlgoliaInsightsPlugin({}), // "awaitSubmit" is neither configurable nor defined
          ];
          const onSubmit = jest.fn();
          const { getFormProps, inputElement } = createPlayground(
            createAutocomplete,
            {
              onSubmit,
              plugins,
            }
          );

          const formProps = getFormProps({ inputElement });

          formProps.onSubmit(new Event('submit'));

          expect(onSubmit).toHaveBeenCalledTimes(0);

          await runAllMicroTasks();

          expect(onSubmit).toHaveBeenCalledTimes(1);
        });
      }
    );
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

    test('cancels pending requests without openOnFocus', async () => {
      const onStateChange = jest.fn();
      let deferSourcesCount = -1;
      const delays = [100];

      const { inputElement, getFormProps } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          openOnFocus: false,
          getSources({ query }) {
            deferSourcesCount++;

            return defer(() => {
              return [
                createSource({
                  getItems: () => [{ label: query }],
                }),
              ];
            }, delays[deferSourcesCount]);
          },
        }
      );

      userEvent.type(inputElement, 'a');

      await runAllMicroTasks();

      // At this point, the request for 'a' is pending
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            query: 'a',
            status: 'loading',
            isOpen: false,
          }),
        })
      );

      onStateChange.mockClear();

      // Trigger reset
      const formProps = getFormProps({ inputElement });
      formProps.onReset(new Event('reset'));

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            query: '',
            status: 'idle',
            isOpen: false,
          }),
        })
      );

      onStateChange.mockClear();

      // Wait for the pending request to resolve
      await defer(() => {}, 150);
      await runAllMicroTasks();

      // The stale request shouldn't update the state and reopen the panel
      expect(onStateChange).toHaveBeenCalledTimes(0);
    });

    test('cancels pending requests with openOnFocus', async () => {
      const onStateChange = jest.fn();
      let deferSourcesCount = -1;
      const delays = [100, 100]; // First for 'a', second for the reset empty query

      const { inputElement, getFormProps } = createPlayground(
        createAutocomplete,
        {
          onStateChange,
          openOnFocus: true,
          getSources({ query }) {
            deferSourcesCount++;

            return defer(() => {
              return [
                createSource({
                  getItems: () => [{ label: query }],
                }),
              ];
            }, delays[deferSourcesCount]);
          },
        }
      );

      userEvent.type(inputElement, 'a');

      await runAllMicroTasks();

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            query: 'a',
            status: 'loading',
          }),
        })
      );

      onStateChange.mockClear();

      inputElement.blur();

      // Trigger reset
      const formProps = getFormProps({ inputElement });
      formProps.onReset(new Event('reset'));

      // The empty query request starts
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            query: '',
            status: 'loading',
          }),
        })
      );

      onStateChange.mockClear();

      // Wait for the first pending request ('a') to resolve
      // and the second empty query request to resolve
      await defer(() => {}, 150);
      await runAllMicroTasks();

      // The state should be updated by the empty query request, not 'a'
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            query: '',
            isOpen: true,
            status: 'idle',
            collections: expect.arrayContaining([
              expect.objectContaining({
                items: expect.arrayContaining([
                  expect.objectContaining({ label: '' }),
                ]),
              }),
            ]),
          }),
        })
      );
    });
  });
});
