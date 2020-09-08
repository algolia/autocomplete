import { AutocompleteOptions } from './types';

export function getDropdownPositionStyle({
  dropdownPlacement,
  container,
  inputWrapper,
  environment = window,
}: Partial<AutocompleteOptions<any>> & {
  container: HTMLElement;
  inputWrapper: HTMLElement;
}) {
  const containerRect = container.getBoundingClientRect();
  const top = containerRect.top + containerRect.height;

  switch (dropdownPlacement) {
    case 'start': {
      return {
        top,
        left: containerRect.left,
      };
    }

    case 'end': {
      return {
        top,
        right:
          environment.document.documentElement.clientWidth -
          (containerRect.left + containerRect.width),
      };
    }

    case 'full-width': {
      return {
        top,
        left: 0,
        right: 0,
        // @TODO [IE support] IE doesn't support `"unset"`
        // See https://caniuse.com/#feat=css-unset-value
        width: 'unset',
        maxWidth: 'unset',
      };
    }

    case 'input-wrapper-width': {
      const inputWrapperRect = inputWrapper.getBoundingClientRect();

      return {
        top,
        left: inputWrapperRect.left,
        right:
          environment.document.documentElement.clientWidth -
          (inputWrapperRect.left + inputWrapperRect.width),
        // @TODO [IE support] IE doesn't support `"unset"`
        // See https://caniuse.com/#feat=css-unset-value
        width: 'unset',
        maxWidth: 'unset',
      };
    }

    default: {
      throw new Error(
        `The \`dropdownPlacement\` value "${dropdownPlacement}" is not valid.`
      );
    }
  }
}
