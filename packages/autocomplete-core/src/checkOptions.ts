import { warn } from '@algolia/autocomplete-shared';

import { AutocompleteOptions, BaseItem } from './types';

export function checkOptions<TItem extends BaseItem>(
  options: AutocompleteOptions<TItem>
) {
  warn(
    !options.debug,
    'The `debug` option is meant for development debugging and should not be used in production.'
  );
}
