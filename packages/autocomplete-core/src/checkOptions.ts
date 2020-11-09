import { warn } from '@algolia/autocomplete-shared';

import { AutocompleteOptions } from './types';

export function checkOptions<TItem>(option: AutocompleteOptions<TItem>) {
  warn(
    !option.debug,
    'The `debug` option is meant for development debugging and should not be used in production.'
  );
}
