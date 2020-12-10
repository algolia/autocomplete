import { AutocompleteOptions } from './types';

type GetPanelPositionStyleParams = Pick<
  AutocompleteOptions<any>,
  'panelPlacement' | 'environment'
> & {
  container: HTMLElement;
  form: HTMLElement;
};

export function getPanelPositionStyle({
  panelPlacement,
  container,
  form,
  environment = window,
}: GetPanelPositionStyleParams) {
  const containerRect = container.getBoundingClientRect();
  const top = container.offsetTop + containerRect.height;

  switch (panelPlacement) {
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
        width: 'unset',
        maxWidth: 'unset',
      };
    }

    case 'input-wrapper-width': {
      const formRect = form.getBoundingClientRect();

      return {
        top,
        left: formRect.left,
        right:
          environment.document.documentElement.clientWidth -
          (formRect.left + formRect.width),
        width: 'unset',
        maxWidth: 'unset',
      };
    }

    default: {
      throw new Error(
        `The \`panelPlacement\` value "${panelPlacement}" is not valid.`
      );
    }
  }
}
