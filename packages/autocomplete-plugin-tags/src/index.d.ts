import { TagsApi } from './createTagsPlugin';

declare module '@algolia/autocomplete-core' {
  export interface AutocompleteContext {
    tagsPlugin: TagsApi;
  }
}
