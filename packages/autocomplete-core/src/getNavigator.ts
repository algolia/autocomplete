import { InternalAutocompleteOptions } from './types';

export function getNavigator({
  environment,
}: Pick<
  InternalAutocompleteOptions<unknown>,
  'environment'
>): InternalAutocompleteOptions<unknown>['navigator'] {
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
