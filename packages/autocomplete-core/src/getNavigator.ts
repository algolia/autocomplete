import { BaseItem, InternalAutocompleteOptions } from './types';

export function getNavigator<TItem extends BaseItem>({
  environment,
}: Pick<
  InternalAutocompleteOptions<TItem>,
  'environment'
>): InternalAutocompleteOptions<TItem>['navigator'] {
  return {
    navigate({ itemUrl }) {
      environment.location.assign(itemUrl);
    },
    navigateNewTab({ itemUrl }) {
      const windowReference = environment.open(itemUrl, '_blank', 'noopener');

      if (windowReference) {
        windowReference.focus();
      }
    },
    navigateNewWindow({ itemUrl }) {
      environment.open(itemUrl, '_blank', 'noopener');
    },
  };
}
