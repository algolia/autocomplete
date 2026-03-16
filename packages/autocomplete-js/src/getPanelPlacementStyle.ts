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
  const offsetParent =
    container.offsetParent || environment.document.documentElement;

  const top = container.offsetTop + containerRect.height;

  switch (panelPlacement) {
    case 'start': {
      return {
        top,
        left: container.offsetLeft,
      };
    }

    case 'end': {
      return {
        top,
        right:
          offsetParent.clientWidth -
          (container.offsetLeft + containerRect.width),
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
        left: form.offsetLeft,
        right: offsetParent.clientWidth - (form.offsetLeft + formRect.width),
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
