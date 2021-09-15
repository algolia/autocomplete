import type { Hit } from '@algolia/client-search';

import type { Account } from '.';

export type AutocompleteItem = Hit<Account>;
