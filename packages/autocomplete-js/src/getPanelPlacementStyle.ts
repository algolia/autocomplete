import { AutocompleteOptions } from './types';

type GetPanelPlacementStyleParams = Pick<
  Required<AutocompleteOptions<any>>,
  'panelPlacement' | 'environment'
> & {
  container: HTMLElement;
  form: HTMLElement;
};

export function getPanelPlacementStyle({
  panelPlacement,
  container,
  form,
  environment,
}: GetPanelPlacementStyleParams) {
  const containerRect = container.getBoundingClientRect();
  const top =
    environment.document.body.scrollTop +
    containerRect.top +
    containerRect.height;

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
        `[Autocomplete] The \`panelPlacement\` value ${JSON.stringify(
          panelPlacement
        )} is not valid.`
      );
    }
  }
}
