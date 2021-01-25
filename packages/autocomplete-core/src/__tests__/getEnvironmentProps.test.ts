import { createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getEnvironmentProps', () => {
  test.todo('forwards the remaining props');

  describe('onTouchStart', () => {
    test('is a noop when panel is not open', () => {
      const {
        getEnvironmentProps,
        inputElement,
        formElement,
      } = createPlayground(createAutocomplete, {});
      const panelElement = document.createElement('div');

      jest.spyOn(inputElement, 'blur');

      const { onTouchStart } = getEnvironmentProps({
        inputElement,
        formElement,
        panelElement,
      });
      window.addEventListener('touchstart', onTouchStart);

      // Focus input (with the panel closed)
      inputElement.focus();

      // Dispatch TouchStart event on window
      const customEvent = new CustomEvent('touchstart', {
        bubbles: true,
      });
      window.dispatchEvent(customEvent);

      expect(inputElement.blur).toHaveBeenCalledTimes(0);
    });

    test('is a noop when the event target is the input element', () => {
      const {
        getEnvironmentProps,
        inputElement,
        formElement,
      } = createPlayground(createAutocomplete, {
        openOnFocus: true,
      });
      const panelElement = document.createElement('div');

      jest.spyOn(inputElement, 'blur');

      const { onTouchStart } = getEnvironmentProps({
        inputElement,
        formElement,
        panelElement,
      });
      window.addEventListener('touchstart', onTouchStart);

      // Focus input (opens the panel)
      inputElement.focus();

      // Dispatch TouchStart event on the input (bubbles to window)
      const customEvent = new CustomEvent('touchstart', {
        bubbles: true,
      });
      inputElement.dispatchEvent(customEvent);

      expect(inputElement.blur).toHaveBeenCalledTimes(0);
    });

    test('closes panel if the target is outside Autocomplete', () => {
      const onStateChange = jest.fn();
      const {
        getEnvironmentProps,
        inputElement,
        formElement,
      } = createPlayground(createAutocomplete, {
        onStateChange,
        initialState: { isOpen: true },
      });
      const panelElement = document.createElement('div');

      const { onTouchStart } = getEnvironmentProps({
        inputElement,
        formElement,
        panelElement,
      });
      window.addEventListener('touchstart', onTouchStart);

      // Dispatch TouchStart event on window (so, outside of Autocomplete)
      const customEvent = new CustomEvent('touchstart', {
        bubbles: true,
      });
      window.document.dispatchEvent(customEvent);

      expect(onStateChange).toHaveBeenLastCalledWith({
        prevState: expect.anything(),
        state: expect.objectContaining({
          activeItemId: null,
          isOpen: false,
        }),
      });
    });
  });

  describe('onTouchMove', () => {
    test('is a noop when panel is not open', () => {
      const {
        getEnvironmentProps,
        inputElement,
        formElement,
      } = createPlayground(createAutocomplete, {});
      const panelElement = document.createElement('div');

      jest.spyOn(inputElement, 'blur');

      const { onTouchMove } = getEnvironmentProps({
        inputElement,
        formElement,
        panelElement,
      });
      window.addEventListener('touchmove', onTouchMove);

      // Focus input (with the panel closed)
      inputElement.focus();

      // Dispatch TouchMove event on window
      const customEvent = new CustomEvent('touchmove', {
        bubbles: true,
      });
      window.dispatchEvent(customEvent);

      expect(inputElement.blur).toHaveBeenCalledTimes(0);
    });

    test('is a noop when the event target is the input element', () => {
      const {
        getEnvironmentProps,
        inputElement,
        formElement,
      } = createPlayground(createAutocomplete, {
        openOnFocus: true,
      });
      const panelElement = document.createElement('div');

      jest.spyOn(inputElement, 'blur');

      const { onTouchMove } = getEnvironmentProps({
        inputElement,
        formElement,
        panelElement,
      });
      window.addEventListener('touchmove', onTouchMove);

      // Focus input (opens the panel)
      inputElement.focus();

      // Dispatch TouchMove event on the input (bubbles to window)
      const customEvent = new CustomEvent('touchmove', {
        bubbles: true,
      });
      inputElement.dispatchEvent(customEvent);

      expect(inputElement.blur).toHaveBeenCalledTimes(0);
    });

    test('is a noop when input is not the active element', () => {
      const {
        getEnvironmentProps,
        inputElement,
        formElement,
      } = createPlayground(createAutocomplete, {
        initialState: { isOpen: true },
      });
      const panelElement = document.createElement('div');

      jest.spyOn(inputElement, 'blur');

      const { onTouchMove } = getEnvironmentProps({
        inputElement,
        formElement,
        panelElement,
      });
      window.addEventListener('touchmove', onTouchMove);

      // Focus the form (with the panel open)
      formElement.focus();

      // Dispatch TouchMove event on window
      const customEvent = new CustomEvent('touchmove', {
        bubbles: true,
      });
      window.dispatchEvent(customEvent);

      expect(inputElement.blur).toHaveBeenCalledTimes(0);
    });

    test('blurs input otherwise', () => {
      const {
        getEnvironmentProps,
        inputElement,
        formElement,
      } = createPlayground(createAutocomplete, {
        openOnFocus: true,
      });
      const panelElement = document.createElement('div');

      jest.spyOn(inputElement, 'blur');

      const { onTouchMove } = getEnvironmentProps({
        inputElement,
        formElement,
        panelElement,
      });
      window.addEventListener('touchmove', onTouchMove);

      // Focus input (opens the panel)
      inputElement.focus();

      // Dispatch TouchMove event on window
      const customEvent = new CustomEvent('touchmove', {
        bubbles: true,
      });
      window.dispatchEvent(customEvent);

      expect(inputElement.blur).toHaveBeenCalledTimes(1);
    });
  });
});
