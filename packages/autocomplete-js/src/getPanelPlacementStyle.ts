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
  // Some browsers have specificities to retrieve the document scroll position.
  // See https://stackoverflow.com/a/28633515/9940315
  const offsetParent =
    container.offsetParent || environment.document.documentElement;

  const scrollTop =
    (environment.pageYOffset as number) ||
    offsetParent.scrollTop ||
    environment.document.body.scrollTop ||
    0;
  const top = scrollTop + container.offsetTop + containerRect.height;

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
