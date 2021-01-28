import { createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getEnvironmentProps', () => {
  test.todo('forwards the remaining props');

  describe('onTouchStart', () => {
    test.todo('is a noop when panel is not open');
    test.todo('is a noop when the event target is the input element');
    test.todo('blurs input if the target is outside Autocomplete');
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
