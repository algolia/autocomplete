import { TagsApi } from '@algolia/autocomplete-plugin-tags';

import { NotificationFilter } from './types';

declare module '@algolia/autocomplete-core' {
  interface AutocompleteContext {
    tagsPlugin: TagsApi<NotificationFilter>;
  }
}
