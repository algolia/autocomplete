import { AutocompleteOptions } from './types';

type GetPanelPlacementStyleParams = Pick<
  Required<AutocompleteOptions<any>>,
  'panelPlacement' | 'environment'
> & {
  container: HTMLElement;
  form: HTMLElement;
  panel: HTMLElement;
};

export function getPanelPlacementStyle({
  panelPlacement,
  container,
  form,
  panel,
  environment,
}: GetPanelPlacementStyleParams) {
  const containerRect = container.getBoundingClientRect();
  // Some browsers have specificities to retrieve the document scroll position.
  // See https://stackoverflow.com/a/28633515/9940315
  const scrollTop =
    (environment.pageYOffset as number) ||
    environment.document.documentElement.scrollTop ||
    environment.document.body.scrollTop ||
    0;
  const panelHeight = panel.offsetHeight;
  const panelStyle = environment.getComputedStyle(panel);
  const panelMarginTop = parseFloat(panelStyle.marginTop) || 0;
  const panelMarginBottom = parseFloat(panelStyle.marginBottom) || 0;
  const panelTotalHeight = panelHeight + panelMarginTop + panelMarginBottom;
  const top = scrollTop + containerRect.top + containerRect.height;
  const panelTop =
    scrollTop + containerRect.top - panelTotalHeight;
  const bottomSpace =
    environment.document.documentElement.clientHeight -
    (containerRect.top + containerRect.height);
  const topSpace = containerRect.top;
  const shouldPlacePanelAbove =
    panelTotalHeight > 0 &&
    bottomSpace < panelTotalHeight &&
    topSpace >= panelTotalHeight;
  const verticalPosition = shouldPlacePanelAbove ? panelTop : top;

  switch (panelPlacement) {
    case 'start': {
      return {
        top: verticalPosition,
        left: containerRect.left,
      };
    }

    case 'end': {
      return {
        top: verticalPosition,
        right:
          environment.document.documentElement.clientWidth -
          (containerRect.left + containerRect.width),
      };
    }

    case 'full-width': {
      return {
        top: verticalPosition,
        left: 0,
        right: 0,
        width: 'unset',
        maxWidth: 'unset',
      };
    }

    case 'input-wrapper-width': {
      const formRect = form.getBoundingClientRect();

      return {
        top: verticalPosition,
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
